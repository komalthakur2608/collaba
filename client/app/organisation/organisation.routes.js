

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('organisation', {
    url: '/organisation',
    template: require('./organisation.html'),
    controller: 'OrgController',
    params: {org : null},
    controllerAs: 'org'/*,
    authenticate: 'org'*/
  });
}
