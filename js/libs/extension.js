import randomBook from "/js/utils/randomBook.js";

export const getTab = () =>
    new Promise((resolve) => {
        if (chrome.tabs) {
            chrome.tabs.query(
                {
                    active: true,
                    lastFocusedWindow: true,
                },
                (tabs) => {
                    resolve(tabs[0]);
                }
            );
        } else {
            resolve({
                url: location.href,
            });
        }
    });

export const getBooks = () =>
    new Promise((resolve) => {
        if (chrome.storage) {
            chrome.storage.sync.get(["books"], (data) => {
                resolve(data["books"]);
            });
        } else {
            resolve(new Array(4).fill(0).map(randomBook));
        }
    });

export const syncBooks = (books) => {
    if (chrome.storage) {
        chrome.storage.sync.set({
            books: books.map((book) => book.serialize()),
        });
    }
};
