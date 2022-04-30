const validateCode = (code, books) => {
    try {
        const validDigits = parseInt(code).toString().length == 6;
        const uniqueCode = !books.find((b) => b.code == code);

        return validDigits && uniqueCode;
    } catch (e) {
        return false;
    }
};

export default validateCode;
