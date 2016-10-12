'use strict';

import angular from 'angular';
import signupOrganisationController from './signupOrganisation.controller';

export default angular.module('collabaApp.main.signupOrganisation', [])
  .controller('SignupOrganisationController', signupOrganisationController)
  .name;
