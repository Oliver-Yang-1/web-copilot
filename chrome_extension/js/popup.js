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

  // Handle send button click
  const sendButton = document.querySelector(".send-button");
  if (sendButton) {
    sendButton.addEventListener("click", function () {
      const userOrderInput = document.querySelector("input[type='text']");
      if (!userOrderInput || !userOrderInput.value) {
        alert("Please enter a task.");
        return;
      }

      const serverAddress = localStorage.getItem('serverAddress');
      if (!serverAddress) {
        alert("Server address not set. Please go to settings to configure.");
        return;
      }

      const userOrder = userOrderInput.value;

      // Send a message to the content script to get the HTML of the current active page
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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

              if (result.script) {
                chrome.scripting.executeScript({
                  target: { tabId: tabs[0].id },
                  func: new Function(result.script)
                });
              }
            } else {
              const error = await apiResponse.json();
              alert(`Error: ${error.error}`);
            }
          } catch (error) {
            alert("Failed to connect to the server. Please check your server address and internet connection.");
          }
        });
      });
    });
  }
});
