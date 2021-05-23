const express = require('express');
const app = express();
const port = 5024;

require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI, {
    useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false,
}).then(() => {
    console.log('mongodb connected');
}).catch((err) => {
    console.error(err);
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});