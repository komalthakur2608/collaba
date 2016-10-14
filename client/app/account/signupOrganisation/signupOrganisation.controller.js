'use strict';

import angular from 'angular';

export default class signupOrganisationController {

  organisation = {
    name: '',
    email: '',
    domainName: '',
    website: '',
    about: '',
    address: '',
    phone: ''
  };

  errors = {};
  submitted = false;

  /*@ngInject*/
  constructor(Auth, $state, $scope) {
    console.log('Inside Controller');
    this.Auth = Auth;
    this.$state = $state;
    this.$scope=$scope;
  }

  setDomain(){
    console.log(this.organisation);
    this.organisation.domainName=this.organisation.email.split('@')[1];
  }

  register(form) {
    console.log('Inside register');
    // console.log(this.organisation);
    this.submitted = true;
    if (form.$valid) {
      return this.Auth.createOrganisation({
          name: this.organisation.name,
          email: this.organisation.email,
          domainName: this.organisation.domainName,
          website: this.organisation.website,
          about: this.organisation.about,
          address: this.organisation.address,
          phone: this.organisation.phone
        })
        .then(() => {
          // Account created, redirect to home
          // TODO: "send request sent message to user"
          this.$state.go('main');
        })
        .catch(err => {
          err = err.data;
          this.errors = {};


          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    }
  }
}
