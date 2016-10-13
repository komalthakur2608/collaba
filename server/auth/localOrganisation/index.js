'use strict';

import express from 'express';
import passport from 'passport';
import {signTokenOrg} from '../auth.service';

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('localOrg', function(err, organisation, info) {
    var error = err || info;
    if(error) {
      return res.status(401).json(error);
    }
    if(!organisation) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    console.log(organisation.id + "    " + organisation.email)
    var token = signTokenOrg(organisation._id, organisation.email);
    res.json({ token : token, org : organisation });
  })(req, res, next);
});

export default router;
