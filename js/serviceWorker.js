chrome.runtime.onInstalled.addListener(() => {
    console.log("installed service worker");

    chrome.storage.sync.set({
        books: [],
    });
});
