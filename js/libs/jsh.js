const h = (tag, props = {}, children = []) => {
    // create the element
    const element = ["svg", "path"].includes(tag)
        ? document.createElementNS(
              props.xmlns || "http://www.w3.org/2000/svg",
              tag
          )
        : document.createElement(tag);

    // loop through the props
    for (const [key, value] of Object.entries(props)) {
        // if the prop starts with "on" then add it is an event listener
        // otherwise just set the attribute
        if (key.startsWith("on")) {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else if (key.startsWith("data-")) {
            element.dataset[key.substring(5)] = value;
        } else {
            element.setAttribute(key, value);
        }
    }

    // loop through the children
    for (const child of children.flat(Infinity)) {
        // if the child is a string then add it as a text node
        // otherwise just add it as an element
        if (child) {
            if (typeof child == "string") {
                const text = document.createTextNode(child);
                element.appendChild(text);
            } else {
                element.appendChild(child);
            }
        }
    }

    // return the element
    return element;
};

const elements = new Proxy(
    {},
    {
        get:
            (_, tag) =>
            (props, ...children) =>
                h(tag, props, children),
    }
);

export default elements;
export { h };
