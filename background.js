const updateContextMenu = (isAudioOnly) => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "audioOnly",
            title: isAudioOnly ? "Download with Video" : "Download Audio Only",
            contexts: ["action"]
        });
    });
};

chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.sync.get('isAudioOnly', (data) => {
        const isAudioOnly = data.isAudioOnly || false;
        updateContextMenu(isAudioOnly);
    });

    const rules = [{
        id: 1,
        action: {
            type: 'modifyHeaders',
            requestHeaders: [
                {
                    header: 'Origin',
                    operation: 'set',
                    value: 'https://cobalt.tools',
                }
            ],
        },
        condition: {
            domains: [chrome.runtime.id],
            urlFilter: 'api.cobalt.tools',
            resourceTypes: ['xmlhttprequest'],
        },
    }];
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map(r => r.id),
        addRules: rules,
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.isAudioOnly) {
        updateContextMenu(changes.isAudioOnly.newValue);
    }
});

chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === "audioOnly") {
        chrome.action.setPopup({ popup: "index.html?audioOnly=change" });
        chrome.action.openPopup();
        chrome.action.setPopup({ popup: "index.html" });
    }
});
