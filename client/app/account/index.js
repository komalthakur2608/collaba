'use strict';

import angular from 'angular';

import uiRouter from 'angular-ui-router';

import routing from './account.routes';
import login from './login';
import loginOrganisation from './loginOrganisation'
import settings from './settings';
import settingsOrganisation from './settingsOrganisation';
import signup from './signup';
import signupOrganisation from './signupOrganisation';
import oauthButtons from '../../components/oauth-buttons';

export default angular.module('collabaApp.account', [uiRouter, login, loginOrganisation, settings, settingsOrganisation, signup, signupOrganisation,
    oauthButtons
  ])
  .config(routing)
  .run(function ($rootScope) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
      if ((next.name == 'logout' || next.name == 'logoutOrganisation') && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  })
  .name;
