chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "audioOnly",
        title: "Get Audio Only",
        contexts: ["action"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === "audioOnly") {
        chrome.action.setPopup({ popup: "index.html?audioOnly=true" });
        chrome.action.openPopup();
    }
});
