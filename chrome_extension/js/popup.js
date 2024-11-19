document.addEventListener("DOMContentLoaded", function () {
  const settingsButton = document.querySelector(".settings-button");
  if (settingsButton) {
    settingsButton.addEventListener("click", function () {
      console.log("clicked!");
      window.location.href = './settings.html';
    });
  }

  // Close the popup window
  const closeButton = document.getElementById('close-button');
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      window.close();
    });
  }

  // Chat history map
  let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || {};

  // Get elements
  const chatArea = document.getElementById('chat-area');
  const userInput = document.querySelector("input[type='text']");
  const sendButton = document.querySelector(".send-button");

  // Get the tag name dynamically based on the current active page's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tagName = tabs[0].url;

    // Load chat history for the current tag
    if (chatHistory[tagName]) {
      chatHistory[tagName].forEach(entry => {
        const [sender, message] = entry;
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender === 'user' ? 'user' : ''}`;
        messageDiv.textContent = message;
        chatArea.appendChild(messageDiv);
      });
    }

    // Handle send button click
    if (sendButton) {
      sendButton.addEventListener("click", function () {
        if (!userInput || !userInput.value) {
          alert("Please enter a task.");
          return;
        }

        const serverAddress = localStorage.getItem('serverAddress');
        if (!serverAddress) {
          alert("Server address not set. Please go to settings to configure.");
          return;
        }

        const userOrder = userInput.value;

        // Append user message to chat area
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = userOrder;
        chatArea.appendChild(userMessageDiv);

        // Save user message to chat history
        if (!chatHistory[tagName]) {
          chatHistory[tagName] = [];
        }
        chatHistory[tagName].push(['user', userOrder]);

        // Send a message to the content script to get the HTML of the current active page
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => document.documentElement.outerHTML
        }, async (results) => {
          if (chrome.runtime.lastError || !results || !results[0] || !results[0].result) {
            alert("Failed to retrieve page HTML. Please make sure the extension has permission to access the page.");
            return;
          }

          const htmlContent = results[0].result;
          const containHtml = true;

          const formData = new FormData();
          formData.append("contain_html", containHtml);
          formData.append("html_file", new Blob([htmlContent], { type: "text/html" }));
          formData.append("userOrder", userOrder);

          try {
            const apiResponse = await fetch(`${serverAddress}/process-task`, {
              method: "POST",
              body: formData,
            });

            if (apiResponse.ok) {
              const result = await apiResponse.json();
              alert(`Response: ${result.response}`);

              // Append system response to chat area
              const systemMessageDiv = document.createElement('div');
              systemMessageDiv.className = 'chat-message';
              systemMessageDiv.textContent = result.response;
              chatArea.appendChild(systemMessageDiv);

// Save system message to chat history
              chatHistory[tagName].push(['system', result.response]);

// Save updated chat history to localStorage
              localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

              // Save updated chat history to localStorage
              localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

              if (result.script) {
                chrome.scripting.executeScript({
                  target: { tabId: tabs[0].id },
                  func: new Function(result.script)
                });
              }
            } else {
              const error = await apiResponse.json();
              alert(`Error: ${error.error}`);

// Append error response to chat area
              const errorMessageDiv = document.createElement('div');
              errorMessageDiv.className = 'chat-message';
              errorMessageDiv.textContent = `Error: ${error.error}`;
              chatArea.appendChild(errorMessageDiv);

// Save error message to chat history
              chatHistory[tagName].push(['system', `Error: ${error.error}`]);

// Save updated chat history to localStorage
              localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
            }
          } catch (error) {
            alert("Failed to connect to the server. Please check your server address and internet connection.");

// Append connection error message to chat area
            const connectionErrorDiv = document.createElement('div');
            connectionErrorDiv.className = 'chat-message';
            connectionErrorDiv.textContent = "Failed to connect to the server. Please check your server address and internet connection.";
            chatArea.appendChild(connectionErrorDiv);

// Save connection error message to chat history
            chatHistory[tagName].push(['system', "Failed to connect to the server. Please check your server address and internet connection."]);

// Save updated chat history to localStorage
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
          }
        });

        // Clear user input
        userInput.value = "";
      });
    }
  });
});
