'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import Channel from '../../components/models/channel.model';
import Organisation from '../organisation/organisation.model';
import Team from '../../components/models/team.model';
import path from 'path';
import fs from 'fs';
import BusBoy from 'busboy';

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
  //searching the organisation to which the user belongs
  Organisation.findOne({
    _id: req.body.organisation
  })
  .exec()
  .then(data => {
    //  console.log("--------------"+data.public.length);
    //to insert the public channel in each user
    for(var i=0;i<data.public.length;i++){
      newUser.channels.push(data.public[i]);
      newUser.save();
      console.log("-----------"+data.public[i]);
      Channel.findById(data.public[i]).exec()
      .then(channeldata=>{
        //saving the user in the public channels
        channeldata.members.push(newUser._id);
        channeldata.save();
      })
    }
    //Save the user id to the organisation
    data.members.push(newUser._id);
    data.save();
  })
  //If a new user is invited to a team
  if (req.body.teams != undefined) {
    Team.findOne({
      _id: req.body.teams
    })
    .exec()
    .then(teamdata => {
      //pushing the user to the team schema
      teamdata.members.push({
        member: newUser._id,
        role: "user"
      });
      //pushing the general channel id to the User schema
      newUser.channels.push(teamdata.general);
      teamdata.save();
      //searching the general channel to push the user in its schema
      Channel.findById(teamdata.general).exec()
      .then(channel=>
        {
          //Pushing the user to the general channel
          channel.members.push(newUser._id);
          channel.save();
        })
      })
    }
    //saving the new user to the db
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
    return User.findOne({_id: userId},'-salt -password')
      .populate({
       path:'organisation',
       populate:{path:'public'}
      })
      .populate({
        path: 'teams',
        populate: {path: 'members.member channels'}
       })
      .populate({
        path: 'channels',
        populate: {path: 'team'}
      })
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

  //get public channels for the wall
  export function getPublicChannels(req,res,next){
   var userId = req.params.id;
   console.log("Id::" + userId);
   return User.findOne({_id: userId},'-salt -password')
     .populate('organisation')
     .populate('teams')
     .populate({
       path:'channels',
       match: { status:'public'},
       populate:{path:'team'}
     })
     .exec()
     .then(user => {
       if (!user) {
         console.log('user not found');
         return res.status(401)
           .end();
       }
       res.json(user);
     })
     .catch(err => next(err));
  }

  export function getChannelInfo(req, res) {
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
        res.send("Success");
      });
  }

export function uploadFile(req, res) {
  console.log('---------File being recieved');
  console.log('-----------Request Headers: ' + JSON.stringify(req.headers));
  var busboy = new BusBoy({
    headers: req.headers
  });
  req.pipe(busboy);
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('-----Saving file');
    var saveTo = path.join('./server/uploads/', path.basename(filename));
    console.log('++++++++++File being saved to: ' + saveTo);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on('finish', function () {
    res.writeHead(200, {
      'Connection': 'close'
    });
    res.end("That's all folks!");
  });
}

//searching for the custom user
//via his domainName
//whether or not an organisation with that domain
//exists or not
export function findOrg(req, res) {
  //Searching the organisation with domain name
  //as specified by the custom user
  return Organisation.findOne({
    domainName: req.body.domain
  })
  .exec()
  .then(data => {
    console.log(data);
    //checking the data recieved and if their checking
    //its status whether or not the organisation
    //has been approved or not
    if (data && data.status != "pending")
    return res.status(200)
    .json({
      registered: true,
      organisationName: data.name,
      organisationId: data._id
    });
    else {
      return res.status(200)
      .json({
        registered: false
      });
    }
  })
}

//checking for existing user
export function alreadyUser(req, res) {
  // console.log('Inside user')
  //checking is user exits
  return User.findOne({
    email: req.body.email
  })
  .exec()
  .then(data => {
    if (data) {
      //check if the user already registered if same team
      return Team.findById(req.body.teamId)
      .exec()
      .then(teamdata => {
        // checking if user not already added in that team
        if(data.teams.indexOf(teamdata._id)==-1){
          //push the team id in that user details
          data.teams.push(req.body.teamId);
          data.save();
          //  teamdata.organisation.members.push(data._id);
          //teamdata.organisation.save();
          console.log("--------------------------" + data);
          console.log("team----" + teamdata);
          //pushing the user in the team schema
          teamdata.members.push({
            member: data.id,
            role: "user"
          });
          teamdata.save();

          return res.status(200)
          .json({
            registered: true
          });
        }
        //if user already present in that team send this
        else {
          return res.status(200)
          .json({
            registered: false,
            message: "already exists in team"
          });
        }
      })

    }
    //If user doesnot exist then return the details for the input fields
    else return Team.findById(req.body.teamId)
    .populate("organisation")
    .exec()
    .then(data => {
      return res.status(200)
      .json({
        //return team Name
        teamName: data.name,
        //return organisationis
        organisationId: data.organisation._id,
        //return organisation name
        organisationName: data.organisation.name,
        registered: false
      });
    })
  });
}/**
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

export function createPublicChannel(req, res, next){
  var teamId = req.params.teamId;
  var channelName = req.params.name;
  console.log(teamId + " " + channelName);

    var newChannel = new Channel({name : channelName, status : 'public', team : teamId, members : []});
    Team.findById(teamId).exec()
      .then(team =>{
        team.channels.push(newChannel._id);
        team.save().then(()=>{
          Organisation.findById(team.organisation).exec()
          .then(org =>{
            org.public.push(newChannel._id);
            org.save();
            org.members.forEach(member =>{
              User.findById(member).exec()
                .then(user=> {
                  user.channels.push(newChannel._id);
                  user.save();
                });
            });
            newChannel.members = org.members;
            newChannel.save();
          });
        });

      })
    res.json({result:'passed'});
}

//creating a private team by team admin
export function createPrivateChannel(req, res) {
  console.log(req.body);
  var members = req.body.members;
  var teamId = req.body.teamId;
  var channelName = req.body.channelName;
  var newChannel = new Channel({name : channelName, team : teamId , members : members});
  newChannel.save();
  Team.findById(teamId).exec()
    .then(team=>{
      team.channels.push(newChannel._id);
      team.save();
    });
  members.forEach(member =>{
    User.findById(member).exec()
      .then(user=>{
        user.channels.push(newChannel._id);
        user.save();
      });
  });
  res.send("done");
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}


export function getPublicChannelNames(req, res){
  var teamId = req.params.teamId;
  var channelName = [];
  Team.findById(teamId).populate(
  {
      path: 'organisation',
      populate: {path: 'public'}
  }).exec()
    .then(team=>{
      console.log(team);
      team.organisation.public.forEach(channel=>{
        channelName.push(channel.name);
      })
      res.json({channelNameArray : channelName})
    })
}
