'use strict';

import angular from 'angular';
import LoginOrganisationController from './LoginOrganisation.controller';

export default angular.module('collabaApp.loginOrganisation', [])
  .controller('LoginOrganisationController', LoginOrganisationController)
  .name;
