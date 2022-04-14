const express = require('express');
const app = express();
const port = 3001;
const product_model = require('./model/product_model');
const brand_model = require('./model/brand_model');
const user_model = require('./model/user_model');
const bcrypt = require('bcrypt');
const config = require('./auth.config.js');
const jwt = require('jsonwebtoken');

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
app.get('/categories', (req, res) => {
  product_model
    .getCategories()
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
app.get('/products', (req, res) => {
  product_model
    .getProducts(req.query.category)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});
app.post('/signup', (req, res) => {
  console.log('reqBody' + req);
  user_model
    .addUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      city: req.body.city,
      street: req.body.street,
      postalCode: req.body.postalCode,
    })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
      console.log('Eroare : ' + error);
    });
});
app.post('/login', (req, res) => {
  user_model
    .getUserbyEmail({
      email: req.body.email,
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      var token = jwt.sign({ id: user.clientid }, config.secret, {
        expiresIn: 20, // 24 hours
      });
      res.status(200).send({
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        street: user.street,
        postalCode: user.postal_code,
        city: user.city,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
});