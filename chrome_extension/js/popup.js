document.addEventListener("DOMContentLoaded", function () {
  function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
  }

  const tagName = getQueryParam('tabUrl');

  const settingsButton = document.querySelector("#settings-button");
  if (settingsButton) {
      settingsButton.addEventListener("click", function () {
          window.location.href = './settings.html?tabUrl=' + encodeURIComponent(tagName);
      });
  }

  const closeButton = document.getElementById('close-button');
  if (closeButton) {
      closeButton.addEventListener('click', function () {
          parent.postMessage({ action: 'closeSidebar' }, '*'); // 通知关闭
          window.parent.postMessage({ action: 'sidebarClosed' }, '*');
      });
  }

  let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || {};

  const chatArea = document.getElementById('chat-area');
  const userInput = document.querySelector("input[type='text']");
  const sendButton = document.querySelector(".send-button");

  // 恢复历史记录
  if (chatHistory[tagName]) {
      chatHistory[tagName].forEach(entry => {
          const [sender, message] = entry;
          const messageDiv = document.createElement('div');
          messageDiv.className = `message ${sender}`;
          messageDiv.textContent = message;
          chatArea.appendChild(messageDiv);
      });
  }

  // 获取当前页面的 HTML 内容
  function getPageHTML() {
      return new Promise((resolve, reject) => {
          window.addEventListener('message', function handler(event) {
              if (event.data && event.data.action === 'pageHTML') {
                  resolve(event.data.htmlContent);
                  window.removeEventListener('message', handler);
              }
          });
          parent.postMessage({ action: 'getPageHTML' }, '*');
      });
  }

  // 发送消息逻辑
  if (sendButton) {
      sendButton.addEventListener("click", async function () {
          if (!userInput.value.trim()) {
              alert("请输入内容。");
              return;
          }

          const userMessage = userInput.value.trim();

          // 显示用户消息
          const userMessageDiv = document.createElement('div');
          userMessageDiv.className = 'message user';
          userMessageDiv.textContent = userMessage;
          chatArea.appendChild(userMessageDiv);

          // 清空输入框
          userInput.value = "";

          // 更新历史记录
          if (!chatHistory[tagName]) {
              chatHistory[tagName] = [];
          }
          chatHistory[tagName].push(['user', userMessage]);

          const serverAddress = localStorage.getItem('serverAddress');
          if (!serverAddress) {
              alert("未设置服务地址，请前往设置页面配置。");
              return;
          }

          try {
              const htmlContent = await getPageHTML();
              const containHtml = true;

              const formData = new FormData();
              formData.append("contain_html", containHtml);
              formData.append("html_file", new Blob([htmlContent], { type: "text/html" }));
              formData.append("userOrder", userMessage);

              const apiResponse = await fetch(`${serverAddress}/process-task`, {
                  method: "POST",
                  body: formData,
              });

              if (apiResponse.ok) {
                  const result = await apiResponse.json();

                  // 显示系统回复
                  const systemMessageDiv = document.createElement('div');
                  systemMessageDiv.className = 'message system';
                  systemMessageDiv.textContent = result.response || "服务无响应内容。";
                  chatArea.appendChild(systemMessageDiv);

                  // 更新历史记录
                  chatHistory[tagName].push(['system', result.response]);
                  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

                  if (result.script) {
                      parent.postMessage({ action: 'executeScript', script: result.script }, '*');
                  }
              } else {
                  const error = await apiResponse.json();
                  const errorMessageDiv = document.createElement('div');
                  errorMessageDiv.className = 'message system';
                  errorMessageDiv.textContent = `错误: ${error.error}`;
                  chatArea.appendChild(errorMessageDiv);

                  // 更新历史记录
                  chatHistory[tagName].push(['system', `错误: ${error.error}`]);
                  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
              }
          } catch (error) {
              const connectionErrorDiv = document.createElement('div');
              connectionErrorDiv.className = 'message system';
              connectionErrorDiv.textContent = "无法连接到服务，请检查网络或服务地址。";
              chatArea.appendChild(connectionErrorDiv);

              // 更新历史记录
              chatHistory[tagName].push(['system', "无法连接到服务，请检查网络或服务地址。"]);
              localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
          }
      });
  }
});