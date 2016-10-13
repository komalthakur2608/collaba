'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('orgSignUp', {
      url: '/orgSignUp',
      template: '<org-sign-up></org-sign-up>'
    });
}
