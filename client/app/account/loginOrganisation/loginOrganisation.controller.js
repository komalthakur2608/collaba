'use strict';

export default class LoginOrganisationController {
  organisation = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.loginOrganisation({
        email: this.organisation.email,
        password: this.organisation.password
      })
        .then(org => {
          console.log(JSON.stringify(org));
          this.$state.go('organisation', {org : org});
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
