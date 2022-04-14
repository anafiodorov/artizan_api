const { pool } = require('../db.config');

const getBrands = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM brand ORDER BY id ASC', (error, results) => {
      console.log(error);
      if (error) {
        reject(error);
      }
      if (results === null) {
        resolve([]);
      } else {
        resolve(results.rows);
      }
    });
  });
};

module.exports = {
  getBrands,
};
