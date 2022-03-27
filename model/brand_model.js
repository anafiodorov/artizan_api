const { pool } = require('../db.config');

const getBrands = () => {
  return new Promise(function (resolve, reject) {
    pool.query(
      'SELECT * FROM brands ORDER BY brand_id ASC',
      (error, results) => {
        console.log(error);
        if (error) {
          reject(error);
        }
        if (results === null) {
          resolve([]);
        } else {
          resolve(results.rows);
        }
      }
    );
  });
};

module.exports = {
  getBrands,
};
