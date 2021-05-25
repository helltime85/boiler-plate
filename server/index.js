const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
//const bodyPasrser = require('body-parser');
const port = 5024;
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

require('dotenv').config();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(bodyPasrser.urlencoded({ extended : true }));
//app.use(bodyPasrser.json());


mongoose.connect(process.env.MONGO_DB_URI, {
    useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false,
}).then(() => {
    console.log('mongodb connected');
}).catch((err) => {
    console.error(err);
});


app.get('/', (req, res) => {
  res.send('Hello World!!!!!');
});

app.get('/api/hello', (req, res) => {
  res.send('hello axios');
})

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) {
      return res.json({ success: false, err });
    }  
    return res.status(200).json({ sucess: true });
  });
});

app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({ loginSucess: false, message: "not found userMail" });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) {
        return res.json({ loginSucess: false, message: "password wrong" });
      }

      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSucess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({ 
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: ""}, (err, user) => {
    if(err) return res.json({ success: false, err});
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});