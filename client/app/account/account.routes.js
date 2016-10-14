'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
      url: '/login',
      template: require('./login/login.html'),
      controller: 'LoginController',
      controllerAs: 'vm'
    })
    .state('loginOrganisation', {
      url: '/login/organisation',
      template: require('./loginOrganisation/loginOrganisation.html'),
      controller: 'LoginOrganisationController',
      controllerAs: 'vm'
    })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'main',
      template: '',
      controller($state, Auth) {
        'ngInject';
        var referrer = $state.params.referrer || $state.current.referrer || 'main';
        Auth.logout();
        $state.go(referrer);
      }
    })
    .state('logoutOrganisation', {
      url: '/logoutOrganisation?referrer',
      referrer: 'main',
      template: '',
      controller($state, Auth) {
        'ngInject';
        var referrer = 'main';
        Auth.logoutOrganisation();
        $state.go(referrer);
      }
    })
    .state('signup', {
      url: '/signup/:email/:teamId',
      //  url: '/signup',
      template: require('./signup/signup.html'),
      controller: 'SignupController',
      controllerAs: 'vm'
    })
    .state('signupOrganisation', {
      url: '/signup/organisation',
      template: require('./signupOrganisation/signupOrganisation.html'),
      controller: 'SignupOrganisationController',
      controllerAs: 'vm'
    })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.html'),
      controller: 'SettingsController',
      controllerAs: 'vm',
      authenticate: true
    })
    .state('settingsOrganisation', {
      url: '/settings/organisation',
      template: require('./settingsOrganisation/settingsOrganisation.html'),
      controller: 'SettingsOrganisationController',
      controllerAs: 'vm',
      authenticate: false
    });
}
