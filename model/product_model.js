const { pool } = require('../db.config');

const getCategories = () => {
  return new Promise(function (resolve, reject) {
    pool.query('SELECT * FROM category ORDER BY id ASC', (error, results) => {
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
const getProducts = (category) => {
  let q = 'select * from product';
  let params = [];

  if (category != undefined && category != null) {
    q = q + ' where category_id in (select id from category where name = $1)';
    params = [category];
  }
  return new Promise(function (resolve, reject) {
    pool.query(q, params, (error, results) => {
      console.log(error);
      if (error) {
        reject(error);
      }
      if (results === null || results == undefined) {
        resolve([]);
      } else {
        resolve(results.rows);
      }
    });
  });
};

module.exports = {
  getCategories,
  getBrands,
  getProducts,
};
