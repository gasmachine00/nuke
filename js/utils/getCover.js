const scrapeMetadata = () => {
    return {
        cover: document.getElementById("cover").querySelector("img").dataset
            .src,
        tags: [...document.querySelectorAll(".tags .tag .name")].map(
            (el) => el.textContent
        ),
        title: document.querySelector(".title .pretty").textContent,
    };
};

const getCover = async (tabId) => {
    return new Promise((resolve) => {
        if (chrome.scripting) {
            chrome.scripting.executeScript(
                {
                    target: { tabId, allFrames: true },
                    func: scrapeMetadata,
                },
                (injectionResults) => {
                    resolve(injectionResults[0].result);
                }
            );
        } else {
            resolve({});
        }
    });
};

export default getCover;
