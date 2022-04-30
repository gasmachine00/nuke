const messages = [
    "Fap to the Moon 🚀",
    "I see what ur doing there 😏",
    "How'd you get that strong bicep? 💪",
    "Getting a new shipment 📦",
    "EXPLOSION! 💣💥",
];

const randomMessage = () =>
    messages[Math.floor(Math.random() * messages.length)];

export default randomMessage;
