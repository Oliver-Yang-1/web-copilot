// js/injectSidebar.js
console.log('injectSidebar.js has been injected.');

const SIDEBAR_WIDTH = 400; // 设置侧边栏宽度

// 创建或获取侧边栏元素的函数
function getOrCreateSidebar() {
    let sidebarContainer = document.getElementById('web-copilot-sidebar');
    if (!sidebarContainer) {
        console.log('Creating sidebar...');
        // 创建侧边栏容器
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

        // 创建 iframe 加载 Copilot 页面
        const iframe = document.createElement('iframe');
        iframe.src = chrome.runtime.getURL('html/popup.html') + '?tabUrl=' + encodeURIComponent(window.location.href);
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '12px';

        // 将 iframe 添加到侧边栏容器
        sidebarContainer.appendChild(iframe);
        document.body.appendChild(sidebarContainer);

        // 动态调整页面宽度
        document.body.style.transition = 'margin-right 0.3s ease-in-out';
        document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;

        // 展开侧边栏
        requestAnimationFrame(() => {
            sidebarContainer.style.width = `${SIDEBAR_WIDTH}px`;
            console.log('Sidebar expanded.');
        });

        // 监听 iframe 中的关闭事件
        window.addEventListener('message', function (event) {
            if (event.data && event.data.action === 'closeSidebar') {
                console.log('Received closeSidebar message.');
                // 收回侧边栏
                sidebarContainer.style.width = '0';
                document.body.style.marginRight = '0'; // 恢复页面宽度
            }
        });
    } else {
        console.log('Sidebar already exists.');
    }
    return sidebarContainer;
}

// 处理消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Received message:', request);
    if (request.action === 'toggleSidebar') {
        const sidebar = document.getElementById('web-copilot-sidebar');
        if (sidebar) {
            if (sidebar.style.width === '0px' || sidebar.style.width === '') {
                // 打开侧边栏
                sidebar.style.width = `${SIDEBAR_WIDTH}px`;
                document.body.style.marginRight = `${SIDEBAR_WIDTH}px`;
                console.log('Sidebar opened.');
            } else {
                // 关闭侧边栏
                sidebar.style.width = '0';
                document.body.style.marginRight = '0';
                console.log('Sidebar closed.');
            }
        } else {
            // 侧边栏不存在，创建并打开
            getOrCreateSidebar();
            console.log('Sidebar created and opened.');
        }
        sendResponse({ success: true });
    }
    // 允许异步响应
    return true;
});

// 初始化侧边栏（仅首次注入时）
if (!document.getElementById('web-copilot-sidebar')) {
    getOrCreateSidebar();
} else {
    console.log('Sidebar already initialized.');
}