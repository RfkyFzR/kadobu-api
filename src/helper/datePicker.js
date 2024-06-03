function datePicker (){
    const dateTime = new Date();
    return dateTime.toISOString();
}

module.exports = {
    datePicker,
}