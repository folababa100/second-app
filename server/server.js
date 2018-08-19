require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
// const {mongoose} = require('./db/mongoose');
// const {Posts} = require('./model/posts')

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server has started at ${port}`)
})
