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

const getProducts = (req) => {
  const category = req.query.category;
  const brand = req.query.brand;

  let q = 'select * from product';
  let params = [];

  console.log(category);

  if (category) {
    q = q + ' where category_id in (select id from category where name = $1)';
    params = [category];
  } else if (brand) {
    q = q + ' where brand_id in (select id from brand where alias = $1)';
    params = [brand];
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
