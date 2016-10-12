'use strict';

var express = require('express');
import * as controller from './organisation.controller';
import * as auth from '../../auth/auth.service';


var router = express.Router();

router.get('/', controller.index);
router.get('/requests', auth.hasRole('admin'), controller.sendPendingRequests);
router.put('/:id/updateStatus', auth.hasRole('admin'), controller.updateStatus);
router.get('/:id/get', auth.isAuthenticatedOrg(), controller.me);
router.put('/:id/password', auth.isAuthenticatedOrg(), controller.changePassword);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
router.get('/:id/details', controller.getDetails);
router.post('/sendmails', controller.sendmails);
router.post('/admin', controller.makeAdmin);
module.exports = router;
