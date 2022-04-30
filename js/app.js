import Sortable from "/node_modules/sortablejs/modular/sortable.esm.js";

import { $, $$ } from "/js/libs/query.js";
import jsh from "/js/libs/jsh.js";

import * as extension from "/js/libs/extension.js";

import createBook from "./components/createBook.js";
import validateCode from "./utils/validateCode.js";

import createBookmark from "./components/icons/createBookmark.js";
import createPopup from "./components/createPopup.js";

import randomMessage from "./utils/randomMessage.js";
import downloadFile from "./utils/downloadFile.js";

import getCover from "./utils/getCover.js";

import Book from "./models/Book.js";

// select elements
const input = $("input[type='text']");
const [addButton, addFileButton, exportButton] = $$("button");

const gallery = $(".gallery");
const footer = $("footer");

// update footer
footer.textContent = randomMessage();

let books = (await extension.getBooks()).map((b) => new Book(b));

// mainly for ctrl+z functionality
let restored = false;
let deletedBooks = [];
let keys = [];

const reader = new FileReader();

// core app
const renderBooks = (genesis) => {
    if (!books) {
        return;
    }

    // purge gallery
    while (gallery.childNodes.length > 0) {
        gallery.childNodes[0].remove();
    }

    // re-append everything
    books.forEach((book) => {
        const onTrash = (e) => {
            const parent = e.target.closest(".gallery__book");
            parent.remove();

            deletedBooks.push(book);
            books = books.filter((b) => b.code !== book.code);
            extension.syncBooks(books);
        };

        const onLike = (e) => {
            const parent = e.target.closest(".gallery__book");
            const bookmarkIcon = parent.querySelector(".icon-bookmark");

            const liked = !JSON.parse(bookmarkIcon.dataset.liked);
            bookmarkIcon.dataset.liked = liked;
            bookmarkIcon.innerHTML = createBookmark({ liked }).innerHTML;

            // update book to new liked state
            for (const b of books) {
                if (b === book) {
                    b.liked = liked;
                }
            }

            extension.syncBooks(books);
        };

        gallery.appendChild(
            createBook({
                ...book.serialize(),
                onTrash,
                onLike,
            })
        );
    });

    // sync dom to extension storage
    if (!genesis) {
        extension.syncBooks(books);
    }
};

renderBooks(true);

// add event listeners
new Sortable(gallery, {
    animation: 150,
    scroll: true,
    bubbleScroll: true,
    revertOnSpill: true,
    onEnd: () => {
        const updatedOrder = $$(".gallery__book").map((el) => el.textContent);
        const newBooks = [];

        // really ass algorithm (O(n^2))
        for (const code of updatedOrder) {
            for (const book of books) {
                if (book.code === code) {
                    newBooks.push(book);
                    books.splice(books.indexOf(book), 1);
                }
            }
        }

        books = newBooks;

        extension.syncBooks(books);
    },
});

// import doujin
addButton.addEventListener("click", async () => {
    const tab = await extension.getTab();

    if (tab?.url.includes("https://nhentai.net/g/")) {
        const code = parseInt(tab.url.split("/g/").pop());

        if (validateCode(code, books)) {
            books.unshift(
                new Book({
                    metadata: await getCover(tab.id),
                    code: code.toString(),
                    liked: false,
                })
            );

            renderBooks();
        } else {
            createPopup({ text: "Already added!" });
        }
    } else {
        createPopup({ text: "Use on a doujin!" });
    }
});

// import doujin(s) by file
addFileButton.addEventListener("click", () => {
    const onChange = async () => {
        reader.onload = () => {
            const importedBooks = JSON.parse(reader.result);
            console.log(importedBooks);
            for (const book of importedBooks) {
                if (validateCode(book.code, books)) {
                    books.unshift(new Book(book));
                }
            }

            renderBooks();
            createPopup({ text: "Imported doujin" });
        };

        reader.readAsText(input.files[0]);
        input.remove();
    };

    const input = jsh.input({ type: "file", style: "display: none", onChange });
    document.body.appendChild(input);
    input.click();
});

// export all codes
exportButton.addEventListener("click", () => {
    downloadFile(
        "codes.json",
        JSON.stringify(
            books.map((b) => b.serialize()),
            null,
            4
        )
    );

    createPopup({ text: "Downloaded as codes.json" });
});

// keyboard listeners for restoring deleted doujin
document.body.addEventListener("keydown", (e) => {
    if (!keys.includes(e.key)) {
        keys.push(e.key);
    }

    if (
        keys.includes("Control") &&
        keys.includes("z") &&
        !restored &&
        deletedBooks.length > 0
    ) {
        books.unshift(deletedBooks.pop());
        renderBooks();

        restored = true;
    }
});

document.body.addEventListener("keyup", (e) => {
    keys = keys.filter((k) => k !== e.key);
    restored = false;
});

input.addEventListener("keyup", (e) => {
    const filteredOrder = $$(".gallery__book");

    for (let i = 0; i < books.length; i++) {
        const book = books[i];

        filteredOrder[i].style.display = book.filter(e.target.value)
            ? "flex"
            : "none";
    }
});
