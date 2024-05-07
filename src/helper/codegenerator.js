function codeGenerator(id){
    const characters ='0123456789';
    let lengthCode = 8;
    let result = '';
    for (let i = 0; i <= lengthCode; i++) {
        result += characters.charAt(Math.floor(Math.random() * lengthCode))
    }
    // result = "kdb" + result;
    id = result;
    return (id);
}

module.exports = codeGenerator;