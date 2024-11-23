const SIDEBAR_WIDTH = 400; // 设置侧边栏宽度

// 创建或获取侧边栏
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

        // 添加过渡效果
        document.body.style.transition = 'margin-right 0.3s ease-in-out';
        document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;

        requestAnimationFrame(() => {
            sidebarContainer.style.width = `${SIDEBAR_WIDTH}px`;
            console.log('Sidebar expanded.');
        });

        // 监听关闭侧边栏的消息
        window.addEventListener('message', function (event) {
            if (event.data && event.data.action === 'closeSidebar') {
                console.log('Received closeSidebar message.');
                sidebarContainer.style.width = '0';
                document.body.style.marginRight = '0';
            }
        });
    } else {
        // 如果侧边栏已存在，刷新 iframe 内容
        const iframe = sidebarContainer.querySelector('iframe');
        iframe.src = chrome.runtime.getURL('html/popup.html') + '?tabUrl=' + encodeURIComponent(window.location.href);
        sidebarContainer.style.width = `${SIDEBAR_WIDTH}px`;
        document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;
        console.log('Sidebar content refreshed and expanded.');
    }
    return sidebarContainer;
}

// 监听来自 background.js 或 popup.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);

    if (request.action === 'toggleSidebar') {
        const sidebar = document.getElementById('web-copilot-sidebar');
        if (sidebar) {
            // 判断侧边栏是否已经展开，决定是展开还是收起
            const isOpen = sidebar.style.width !== '0px' && sidebar.style.width !== '';
            if (isOpen) {
                sidebar.style.width = '0';
                document.body.style.marginRight = '0';
                console.log('Sidebar closed.');
            } else {
                getOrCreateSidebar();
                console.log('Sidebar opened.');
            }
        } else {
            getOrCreateSidebar();
            console.log('Sidebar created and opened.');
        }
        sendResponse({ success: true });
    }
    return true; // 保证异步消息响应
});