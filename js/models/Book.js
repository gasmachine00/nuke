import createBook from "/js/components/createBook.js";

export default class Book {
    constructor({ metadata, liked, code } = {}) {
        this.metadata = metadata;
        this.liked = liked;
        this.code = code;
    }

    /**
        {
            metadata: {
                title: "",
                cover: "",
                tags: [],
            }
        }
     */

    serialize() {
        return {
            metadata: this.metadata,
            liked: this.liked,
            code: this.code,
        };
    }

    filter(query) {
        return Object.keys(this.metadata)
            .map((key) =>
                (Array.isArray(this.metadata[key])
                    ? this.metadata[key].join(" ")
                    : this.metadata[key]
                )
                    .toLowerCase()
                    .includes(query)
            )
            .concat([this.code.includes(query)])
            .concat([query === "liked" && this.liked])
            .includes(true);
    }
}
