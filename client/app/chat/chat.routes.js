'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('chat', {
      url: '/chat',
      template: '<chat></chat>'
    });
}
