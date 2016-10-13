/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/organisations              ->  index
 * POST    /api/organisations              ->  create
 * GET     /api/organisations/:id          ->  show
 * PUT     /api/organisations/:id          ->  upsert
 * PATCH   /api/organisations/:id          ->  patch
 * DELETE  /api/organisations/:id          ->  destroy
 */

'use strict';

import nodemailer from 'nodemailer';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import jsonpatch from 'fast-json-patch';
import Organisation from './organisation.model';


//TODO: Use XOauth 2.0 in nodemailer
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: config.email,
    pass: config.password
  }
});

function sendMail(to, subject, body) {
  transporter.sendMail({
    from: config.email,
    to: to,
    subject: subject,
    html: body
  }, function (error, info) {
    if (error) {
      console.log('-------------' + error + '------------');
    } else {
      console.log('Message sent');
    }
  });

}

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

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode)
        .json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204)
            .end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404)
        .end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode)
      .send(err);
  };
}

// Gets a list of Organisations
export function index(req, res) {
  console.log('Inside index');
  return Organisation.find()
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function sendPendingRequests(req, res) {
  console.log('Inside sendPedingRequests');
  return Organisation.find({
      status: 'pending'
    })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Organisation from the DB
export function show(req, res) {
  return Organisation.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Organisation in the DB
export function create(req, res) {
  var newOrganisation = new Organisation(req.body);
  newOrganisation.status = 'pending';
  Organisation.find(req.body.email)
  newOrganisation.save()
    .then(function (user) {
      res.send('user')
    })
    .catch(validationError(res));
}

export function updateStatus(req, res) {
  return Organisation.findById(req.params.id)
    .exec()
    .then(organisation => {
      organisation.status = req.body.status;

      return organisation.save()
        .then(() => {
          switch (organisation.status) {
          case 'rejected':
            sendMail(organisation.email, 'Request rejected', 'Sorry, Your request has been rejected');
            break;
          case 'approved':
            sendMail(organisation.email, 'Request approved', 'Congrulations, Your request has been approved');
            break;
          case 'on hold':
            sendMail(organisation.email, 'Request has been put on hold', 'Your request have been put on hold and you shall be intimidated within 1 week.<br/> Thanks.')

          }
          res.status(204)
            .end();
        })
        .catch(validationError(res));
    })
}



// Upserts the given Organisation in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Organisation.findOneAndUpdate({
      _id: req.params.id
    }, req.body, {
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    })
    .exec()

  .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Organisation in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Organisation.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Organisation from the DB
export function destroy(req, res) {
  return Organisation.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
