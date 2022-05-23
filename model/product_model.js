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

  let productsResponse = [];

  let q = 'select * from product';
  let qSizes =
    'select p.id, p.brand_id, p.category_id, p.name, p.price, s.name from product p, size s where exists (select 1 from product_size ps where ps.product_id = p.id and ps.size_id = s.id)';
  let params = [];

  console.log(category);

  if (category) {
    q = q + ' where category_id in (select id from category where name = $1)';
    qSizes =
      qSizes +
      ' and p.category_id in (select id from category where name = $1)';
    params = [category];
  } else if (brand) {
    q = q + ' where brand_id in (select id from brand where alias = $1)';
    qSizes =
      qSizes + ' and p.brand_id in (select id from brand where alias = $1)';
    params = [brand];
  }
  qSizes = qSizes + ' order by p.id, s.id';

  return new Promise(function (resolve, reject) {
    pool.query(q, params, (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      if (results === null || results == undefined) {
        resolve([]);
      } else {
        productsResponse = results.rows;
        pool.query(qSizes, params, (error, results) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          if (results === null || results == undefined) {
            resolve(productsResponse);
          } else {
            productsResponse.forEach((p) => {
              let sizes = results.rows
                .filter((ps) => {
                  return ps.id === p.id;
                })
                .map((el) => {
                  return el.name;
                });

              // console.log('ProductId: ' + p.id + ' Sizes: ');
              // sizes.forEach((e) => {
              //   console.log(e + ',');
              // });
              const index = productsResponse.indexOf(p);
              productsResponse[index] = { ...p, sizes: sizes };
            });

            productsResponse.forEach((e) => {
              console.log(JSON.stringify(e) + ',');
            });
            resolve(productsResponse);
          }
        });
      }
    });
  });
};

module.exports = {
  getCategories,
  getBrands,
  getProducts,
};
