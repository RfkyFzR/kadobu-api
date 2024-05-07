const { showPenggunas, insertPengguna } = require("./pengguna.repository.js");
const hashPassword = require("../helper/hash.js")

async function getPengguna(){
    try {
        const users = await showPenggunas();
        return users;
    } catch (error) {
        throw error;
    }
};

async function createPengguna(formData){
    try {
    const encryptPassword = hashPassword(formData.password);
    formData.password = encryptPassword;
        const users = await insertPengguna(formData);
        return users;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getPengguna,
    createPengguna,
};