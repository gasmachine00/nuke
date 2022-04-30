import jsh from "/js/libs/jsh.js";

import createBookmark from "./icons/createBookmark.js";
import createClipboard from "./icons/createClipboard.js";
import createTrash from "./icons/createTrash.js";
import createOpen from "./icons/createOpen.js";

import createPopup from "./createPopup.js";

const createBook = ({ metadata, code, liked, onTrash, onLike }) => {
    const image = jsh.img({
        class: "gallery__book__image",
    });

    const onMouseOver = () => {
        image.src = metadata.cover;
    };

    return jsh.div(
        { class: "gallery__book" },
        jsh.span({ onMouseOver }, code),
        jsh.div(
            {},
            createTrash({ onClick: onTrash }),
            createClipboard({
                onClick: () => {
                    navigator.clipboard.writeText(code.toString());
                    createPopup({ text: "Copied!" });
                },
            }),
            jsh.a(
                {
                    href: `https://nhentai.net/g/${code}`,
                    style: "margin: 0; display: inline-flex;",
                },
                createOpen()
            ),
            createBookmark({ liked, onClick: onLike })
        ),
        image
    );
};
export default createBook;
