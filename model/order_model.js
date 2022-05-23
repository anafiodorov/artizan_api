const { pool } = require('../db.config');

const addOrder = (body) => {
  return new Promise(function (resolve, reject) {
    console.log(body);
    const {
      order,
      firstName,
      lastName,
      country,
      street,
      postalCode,
      city,
      phone,
      email,
    } = body;
    console.log(order);
    pool.query(
      'INSERT INTO orders (first_name, last_name, country,street,postal_code,city,phone,email) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING order_id',
      [firstName, lastName, country, street, postalCode, city, phone, email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results) {
          var orderId = parseInt(`${results.rows[0]['order_id']}`);
          console.log('OrderId: ' + `${orderId}`);
          order.forEach((element) => {
            console.log('elem:' + element);
            pool.query(
              'INSERT INTO orderitems (order_id,product_id,product_name, price, amount) VALUES ($1, $2, $3, $4, $5) RETURNING orderitems_id',
              [
                orderId,
                element.id,
                element.name,
                element.price,
                element.amount,
              ],
              (error, results) => {
                if (error) {
                  console.log(error);
                  reject(error);
                }
                if (results) {
                  console.log(
                    'OrderItemId: ' + `${results.rows[0]['orderitems_id']}`
                  );
                }
              }
            );
          });
        }
      }
    );
  });
};

module.exports = {
  addOrder,
};
