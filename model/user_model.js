const { pool } = require('../db.config');

const addUser = (body) => {
  return new Promise(function (resolve, reject) {
    const { firstName, lastName, email, password, city, street, postalCode } =
      body;
    console.log(body);
    pool.query(
      'INSERT INTO users (first_name,last_name,email,password,city,street,postal_code) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [firstName, lastName, email, password, city, street, postalCode],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results) {
          console.log(`${results.rows[0]['id']}`);
          resolve(`${results.rows[0]['id']}`);
        }
      }
    );
  });
};
const getUserbyEmail = (body) => {
  return new Promise(function (resolve, reject) {
    const { email } = body;
    pool.query(
      'SELECT * FROM users WHERE email = ($1)',
      [email],
      (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        if (results === null) {
          resolve({});
        } else {
          console.log('Rezultat login ' + results.rows.length);
          resolve(results.rows[0]);
        }
      }
    );
  });
};
module.exports = {
  addUser,
  getUserbyEmail,
};
