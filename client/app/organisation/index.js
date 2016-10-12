
import angular from 'angular';
import routes from './organisation.routes';
import OrgController from './organisation.controller';

export default angular.module('collabaApp.org', ['collabaApp.auth', 'ui.router', 'ui.bootstrap'])
  .config(routes)
  .controller('OrgController', OrgController)
  .name;
