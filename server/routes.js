/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function (app) {
  // Insert routes below
  app.use('/api/organisations', require('./api/organisation'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth')
    .default);

  //Enabling file download route
  app.route('/uploads/:fileName')
    .get((req, res) => {
      console.log('-------------------------Inside route------------------');
      console.log(path.resolve('./server/uploads/' + req.params.fileName));
      res.sendFile(path.resolve('./server/uploads/'+req.params.fileName));
    })

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
