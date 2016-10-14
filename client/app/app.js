'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import uiNotification from 'angular-ui-notification';

// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import organisation from './organisation';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import chat from './chat/chat.component';
import wall from './wall/wall.component';
import channel from './channel/channel.component';
import ngFileUpload from 'ng-file-upload';


import './app.css';

angular.module('collabaApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', uiRouter, ngFileUpload,
    uiBootstrap, uiNotification, _Auth, account, organisation, admin, navbar, footer, main, constants, socket, util, chat, channel, wall
  ])
  .config(routeConfig)
  .run(function ($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function (event, next) {
      // console.log('isLoggedin: ' + Auth.isLoggedInSync());
      // console.log('isOrgansationLoggedin: ' + Auth.isLoggedInOrgSync());
      if (Auth.isLoggedInSync() || Auth.isLoggedInOrgSync()) {
        // console.log('Inside if');
      } else {
        // console.log('Inside else')
        if (next.authenticate) {
          $location.path('/');
        }
      }
      // Auth.isLoggedInSync(function (loggedIn) {
      //   if (next.authenticate && !loggedIn) {
      //     Auth.isLoggedInOrgSync(function(loggedIn){
      //       if(next.authenticate && !loggedIn)
      //       $location.path('/');
      //     })
      //   }
      // });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['collabaApp'], {
      strictDi: true
    });
  });
