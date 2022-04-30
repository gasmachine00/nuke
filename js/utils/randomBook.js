const randomBook = () => ({
    code: new Array(6)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 9).toString())
        .join(""),
    liked: false,
});

export default randomBook;
