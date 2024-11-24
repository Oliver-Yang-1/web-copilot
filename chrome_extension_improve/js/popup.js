document.addEventListener("DOMContentLoaded", function () {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const tagName = getQueryParam("tabUrl");
    console.log("Loaded tabUrl:", tagName);

    const settingsButton = document.querySelector("#settings-button");
    if (settingsButton) {
        settingsButton.addEventListener("click", function () {
            window.location.href = './settings.html?tabUrl=' + encodeURIComponent(tagName);
        });
    }

    const closeButton = document.getElementById("close-button");
    if (closeButton) {
        closeButton.addEventListener("click", function () {
            // 关闭侧边栏前发送消息
            parent.postMessage({ action: "closeSidebar" }, "*");
            window.parent.postMessage({ action: "sidebarClosed" }, "*");
            
            // 设置标识以便触发重置聊天历史
            localStorage.setItem('copilotClosed', 'true');
        });
    }

    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
    console.log("Loaded chat history:", chatHistory);

    const chatArea = document.getElementById("chat-area");
    const chatIntro = document.getElementById("chat-intro");
    const userInput = document.querySelector("input[type='text']");
    const sendButton = document.querySelector(".send-button");

    // 重置聊天历史的逻辑
    function resetChat() {
        // 仅在 Copilot 被关闭时才重置历史消息
        if (localStorage.getItem('copilotClosed') === 'true') {
            chatArea.innerHTML = ''; // 清空聊天区域
            chatIntro.style.display = "block";  // 显示提示信息
            chatIntro.textContent = "Hi!\nWhat can I do for you?";
            chatIntro.style.animation = "none"; // 先清除动画
            chatIntro.offsetHeight; // 强制回流
            chatIntro.style.animation = "fadeIn 2s ease-out"; // 重新启动动画
            localStorage.removeItem('copilotClosed');  // 重置标识
        }
    }

    // 监听插件按钮的点击事件来重置聊天
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'toggleSidebar') {
            resetChat();
        }
    });

    // 追加消息到聊天框
    function appendMessage(sender, message) {
        // 移除初始的提示
        chatIntro.style.display = "none";

        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = message;
        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight; // 滚动到底部
    }

    // 获取当前页面的 HTML 内容
    async function getPageHTML() {
        try {
            // 获取当前活动标签页
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab || !tab.id) {
                throw new Error("无法获取当前活动标签页。");
            }

            // 使用 chrome.scripting.executeScript 获取页面 HTML
            const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.documentElement.outerHTML
            });

            if (chrome.runtime.lastError) {
                throw new Error(chrome.runtime.lastError.message);
            }

            return result.result;
        } catch (error) {
            throw error;
        }
    }

    // 发送消息逻辑
    let firstMessageSent = false;  // 记录是否已发送过第一条消息

    async function sendMessage() {
        console.log("Send button clicked!");

        if (!userInput.value.trim()) {
            alert("请输入内容。");
            return;
        }

        const userMessage = userInput.value.trim();
        console.log("User input:", userMessage);

        // 清空输入框
        userInput.value = "";

        // 如果是第一次发送消息，加载历史记录
        if (!firstMessageSent && chatHistory[tagName]) {
            // 显示历史记录（在新消息之前）
            chatHistory[tagName].forEach(([sender, message]) => {
                appendMessage(sender, message);
            });
            firstMessageSent = true; // 标记为已发送第一条消息
        }

        // 将用户输入消息显示在聊天框
        appendMessage("user", userMessage);

        // 保存用户消息到历史记录
        if (!chatHistory[tagName]) {
            chatHistory[tagName] = [];
        }
        chatHistory[tagName].push(["user", userMessage]);
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        const serverAddress = localStorage.getItem("serverAddress");
        const useLightFriday = localStorage.getItem('useLightFriday') === 'true';
        const sessionList = localStorage.getItem('sessionList');
        console.log("Server Address:", serverAddress);

        if (!serverAddress) {
            alert("未设置服务地址，请前往设置页面配置。");
            return;
        }

        try {
            // 获取页面 HTML 内容
            const htmlContent = await getPageHTML();
            console.log("HTML Content Retrieved:", htmlContent);

            if (!htmlContent || htmlContent.length === 0) {
                console.error("Failed to retrieve HTML content.");
                appendMessage("system", "无法获取页面 HTML 内容。");
                return;
            }

            const formData = new FormData();
            formData.append("contain_html", true);
            formData.append("html_file", new Blob([htmlContent], { type: "text/html" }));
            formData.append("userOrder", userMessage);

            formData.append("session_list", sessionList || "[]"); // Default to an empty array in JSON string format if not set
            formData.append("use_light_friday", useLightFriday); // Append useLightFriday as a boolean

            for (let [key, value] of formData.entries()) {
                console.log(`FormData entry: ${key} = ${value}`);
            }

            const apiResponse = await fetch(`${serverAddress}/process-task`, {
                method: "POST",
                body: formData,
            });

            console.log("Fetch request sent to:", `${serverAddress}/process-task`);
            console.log("API status code:", apiResponse.status);

            if (apiResponse.ok) {
                const result = await apiResponse.json();
                console.log("API Response:", result);

                // 显示系统回复
                appendMessage("system", result.response || "服务无响应内容。");

                // 更新历史记录
                if (!chatHistory[tagName]) {
                    chatHistory[tagName] = [];
                }
                chatHistory[tagName].push(["system", result.response]);
                localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

                // 如果返回了脚本，则执行它
                if (result.script) {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: new Function(result.script)
                    });
                }
            } else {
                const errorDetails = await apiResponse.text();
                console.error("API Error Details:", errorDetails);

                appendMessage("system", `错误: ${errorDetails}`);
            }
        } catch (error) {
            console.error("Fetch Error:", error);

            appendMessage("system", "无法连接到服务，请检查网络或服务地址。");
        }
    }

    // 监听“回车”键
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();  // 防止回车换行
            sendMessage();
        }
    });

    // 发送按钮点击
    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }
});
