'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import Channel from '../../components/models/channel.model';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode)
      .json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode)
      .send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password')
    .exec()
    .then(users => {
      res.status(200)
        .json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  console.log(newUser);
  newUser.save()
    .then(function (user) {
      var token = jwt.sign({
        _id: user._id
      }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({
        token
      });
    })
    .catch(validationError(res));
}

export function getUserInfo(req, res, next) {
  var userId = req.params.id;
  console.log("Id::" + userId);
  return User.findOne({_id: userId})
    .populate('organisation channels teams')
    .exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        console.log('user not found');
        return res.status(401)
          .end();
      }
      console.log(user);
      res.json(user);
    })
    .catch(err => next(err));
}

export function getChannelInfo(req, res, next) {
  var userId = req.params.id;
  var channelId = req.params.channelId;
  console.log("Id::" + userId);
  return Channel.findOne({
      _id: channelId
    })
    .exec()
    .then(channel => { // don't ever give out the password or salt
      if (!channel) {
        return res.status(401)
          .end();
      }
      res.json(channel);
    })
    .catch(err => next(err));
}

export function saveMessage(req, res) {
  var channelId = req.params.channelId;
  console.log("Save message:" + JSON.stringify(req.body));
  return Channel.findOne({
      _id: channelId
    })
    .exec()
    .then(channel => { // don't ever give out the password or salt
      if (!channel) {
        return res.status(401)
          .end();
      }
      var message = {
        user: req.body.data.user,
        message: req.body.data.message,
        messageType: req.body.data.type
      };
      channel.history.push(message);
      channel.save();
      res.send("Data saved");
    });
}

//checking for existing user
export function alreadyUser(req, res) {
  // console.log('Inside user')
  //  console.log()
  return User.findOne({
      email: req.body.email
    })
    .exec()
    .then(data => {
      // console.log(req.body.email);
      // console.log(data);
      if (data)
        return res.status(200)
          .json({
            registered: true
          });
      else return res.status(200)
        .json({
          registered: false
        });
    });
}
/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId)
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404)
          .end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id)
    .exec()
    .then(function () {
      res.status(204)
        .end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId)
    .exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204)
              .end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403)
          .end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({
      _id: userId
    }, '-salt -password')
    .exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401)
          .end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
