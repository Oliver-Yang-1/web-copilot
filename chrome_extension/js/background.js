// background.js
chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab) {
      console.error('No active tab found.');
      return;
    }

    const url = activeTab.url || '';
    console.log('Active Tab URL:', url);

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://')) {
      // 尝试发送消息切换侧边栏
      chrome.tabs.sendMessage(activeTab.id, { action: 'toggleSidebar' }, (response) => {
        if (chrome.runtime.lastError || !response) {
          console.warn('No content script found. Injecting script now.');

          // 如果未找到 content script，则注入脚本
          chrome.scripting.executeScript(
            {
              target: { tabId: activeTab.id },
              files: ['js/injectSidebar.js'],
            },
            () => {
              if (chrome.runtime.lastError) {
                console.error('Script injection failed: ', chrome.runtime.lastError);
              } else {
                console.log('Sidebar injected successfully.');
              }
            }
          );
        } else {
          console.log('Sidebar toggled successfully.', response);
        }
      });
    } else {
      // 通知用户无法在当前页面使用扩展程序
      const iconUrl = chrome.runtime.getURL('icons/icon48.png');
      chrome.notifications.create(
        {
          type: 'basic',
          iconUrl: iconUrl,
          title: 'Web Copilot',
          message: '抱歉，无法在此页面使用 Web Copilot 扩展程序。',
          priority: 2,
        },
        function (notificationId) {
          if (chrome.runtime.lastError) {
            console.error('Notification Error:', chrome.runtime.lastError);
          } else {
            console.log('Notification created with ID:', notificationId);
          }
        }
      );
    }
  });
});
