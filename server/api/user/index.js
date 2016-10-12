'use strict';

import {
  Router
} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.post('/alreadyUser', controller.alreadyUser);
router.get('/getUserInfo/:id', controller.getUserInfo);
router.get('/getChannelInfo/:id/:channelId', controller.getChannelInfo);
router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/saveMessage/:channelId', controller.saveMessage);
router.post('/', controller.create);

module.exports = router;
