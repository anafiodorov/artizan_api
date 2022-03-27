const express = require('express');
const app = express();
const port = 3001;
const product_model = require('./model/product_model');
const brand_model = require('./model/brand_model');

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers, Authorization'
  );
  next();
});
app.get('/products', (req, res) => {
  product_model
    .getProducts()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});
app.get('/brands', (req, res) => {
  brand_model
    .getBrands()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});
