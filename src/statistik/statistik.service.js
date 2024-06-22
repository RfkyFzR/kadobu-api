const { showStatisticsInYear } = require('./statistik.repository.js');
const { countsKatalogsReady } = require('../katalog/katalog.repository.js');

async function getStatisticsInYear(id_toko, year) {
  try {
    const statistics = await showStatisticsInYear(id_toko, year);
    const katalog = await countsKatalogsReady(id_toko);
    return {
      ...katalog[0],
      statistics,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getStatisticsInYear,
};

