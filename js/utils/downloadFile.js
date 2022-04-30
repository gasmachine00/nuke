import jsh from "/js/libs/jsh.js";

const downloadFile = (filename, content) => {
    // create file
    const blob = new Blob([content], { type: "text/plain;charset=UTF-8" });
    const objectUrl = URL.createObjectURL(blob);

    // download file
    const anchor = jsh.a({
        href: objectUrl,
        download: filename,
        style: "display: none;",
    });
    document.body.appendChild(anchor);
    anchor.click();

    // dispose file
    URL.revokeObjectURL(objectUrl);
    anchor.remove();
};

export default downloadFile;
