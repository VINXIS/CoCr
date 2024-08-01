const updateContextMenu = (isAudioOnly) => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "audioOnly",
            title: isAudioOnly ? "Download with Video" : "Download Audio Only",
            contexts: ["action"]
        });
    });
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('isAudioOnly', (data) => {
        const isAudioOnly = data.isAudioOnly || false;
        updateContextMenu(isAudioOnly);
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
