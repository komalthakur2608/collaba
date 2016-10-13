'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('wall', {
      url: '/wall',
      template: '<wall></wall>'
    });
}
