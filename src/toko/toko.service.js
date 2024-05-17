const { showKatalogsByIdStore, showStoreById } = require('../toko/toko.repository.js')

async function getKatalogsAndStoreById(id){
    try {
        const katalog = await showKatalogsByIdStore(id);
        const store = await showStoreById(id);
        return {
            ...store[0],
            katalog,
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getKatalogsAndStoreById,
}