'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('channel', {
      url: '/channel/:teamId',
      template: '<channel></channel>'
    });
}
