import jsh from "/js/libs/jsh.js";

const createPopup = ({ text } = {}) => {
    const popup = jsh.div(
        {
            class: "popup",
            onAnimationEnd: () => {
                popup.remove();
            },
        },
        text
    );

    document.body.appendChild(popup);
};

export default createPopup;
