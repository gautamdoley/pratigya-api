const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config');


const Users = require('../../models/users/users');

router.post('/register',(req,res, next)=>{
 
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const users = new Users({
        _id: new mongoose.Types.ObjectId(),
        username : req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    users.save().then(result=>{
        // console.log(result);
        var token = jwt.sign({ id: users._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
        res.status(201).json({
            isSuccess:true,
            message: 'User registered',
            users: users,
            auth: true, 
            token: token
        });
    }).catch(err => console.log(err));
});

router.get('/me', function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      Users.findById(decoded.id, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!users) return res.status(404).send("No user found.");
        res.status(200).send({ 
          isSuccess:true,
          user:users,
          auth: true,
          token: token
         });
        // res.status(200).send(user);
        // next(users);
      });
    });
  });

  // add the middleware function
router.use(function (users, req, res, next) {
    res.status(200).send(users);
});

router.post('/login', function(req, res, next) {

    Users.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send({
        isSuccess: false,
        message:"No user found."
      });
      
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      
      var token = jwt.sign({ id: user._id }, config.secret, {
        
        expiresIn: 86400 // expires in 24 hours
      });
      
      res.status(200).send({ 
        isSuccess:true,
        user:user,
        auth: true, 
        token: token
       });
    });
    
  });

  router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });

module.exports = router;
