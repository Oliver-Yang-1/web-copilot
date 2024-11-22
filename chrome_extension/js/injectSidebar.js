const SIDEBAR_WIDTH = 400; // 设置侧边栏宽度

function getOrCreateSidebar() {
    let sidebarContainer = document.getElementById('web-copilot-sidebar');
    if (!sidebarContainer) {
        console.log('Creating sidebar...');
        sidebarContainer = document.createElement('div');
        sidebarContainer.id = 'web-copilot-sidebar';
        sidebarContainer.style.position = 'fixed';
        sidebarContainer.style.top = '0';
        sidebarContainer.style.right = '0';
        sidebarContainer.style.width = '0';
        sidebarContainer.style.height = '100vh';
        sidebarContainer.style.zIndex = '999999';
        sidebarContainer.style.transition = 'width 0.3s ease-in-out';
        sidebarContainer.style.overflow = 'hidden';
        sidebarContainer.style.borderRadius = '12px';
        sidebarContainer.style.backgroundColor = '#ffffff';
        sidebarContainer.style.boxShadow = '-4px 0 8px rgba(0, 0, 0, 0.1)';

        const iframe = document.createElement('iframe');
        iframe.src = chrome.runtime.getURL('html/popup.html') + '?tabUrl=' + encodeURIComponent(window.location.href);
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '12px';

        sidebarContainer.appendChild(iframe);
        document.body.appendChild(sidebarContainer);

        document.body.style.transition = 'margin-right 0.3s ease-in-out';
        document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;

        requestAnimationFrame(() => {
            sidebarContainer.style.width = `${SIDEBAR_WIDTH}px`;
            console.log('Sidebar expanded.');
        });

        window.addEventListener('message', function (event) {
            if (event.data && event.data.action === 'closeSidebar') {
                console.log('Received closeSidebar message.');
                sidebarContainer.style.width = '0';
                document.body.style.marginRight = '0';
            }
        });
    } else {
        console.log('Sidebar already exists.');
    }
    return sidebarContainer;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);

    if (request.action === 'toggleSidebar') {
        const sidebar = document.getElementById('web-copilot-sidebar');
        if (sidebar) {
            if (sidebar.style.width === '0px' || sidebar.style.width === '') {
                sidebar.style.width = `${SIDEBAR_WIDTH}px`;
                document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;
                console.log('Sidebar opened.');
            } else {
                sidebar.style.width = '0';
                document.body.style.marginRight = '0';
                console.log('Sidebar closed.');
            }
        } else {
            getOrCreateSidebar();
            console.log('Sidebar created and opened.');
        }
        sendResponse({ success: true });
    } else if (request.action === 'getPageHTML') {
        try {
            // 获取页面 HTML 内容
            const htmlContent = document.documentElement.outerHTML;
            console.log('Sending page HTML content:', htmlContent.length);
            
            // 返回 HTML 内容
            sendResponse({ htmlContent });
        } catch (error) {
            console.error('Error retrieving HTML content:', error);
            sendResponse({ error: 'Failed to retrieve page HTML content.' });
        }
    }
    return true; // 标记为异步响应，确保消息返回
});

// 新增的监听器：用于处理 popup.js 中的消息通信
window.addEventListener('message', function (event) {
    if (event.data && event.data.action === 'getPageHTML') {
        console.log('Received getPageHTML request from popup.js');
        try {
            const htmlContent = document.documentElement.outerHTML;
            console.log('Returning HTML content length:', htmlContent.length);

            // 将 HTML 内容通过消息发送回 popup.js
            window.postMessage({ action: 'pageHTML', htmlContent: htmlContent }, '*');
        } catch (error) {
            console.error('Error processing getPageHTML:', error);
            window.postMessage({ action: 'pageHTML', error: 'Failed to retrieve HTML content.' }, '*');
        }
    }
});

if (!document.getElementById('web-copilot-sidebar')) {
    getOrCreateSidebar();
} else {
    console.log('Sidebar already initialized.');
}
