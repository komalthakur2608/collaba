'use strict';

import angular from 'angular';

export default class SignupController {
  user = {
    name: '',
    organisation: '',
    email: '',
    team: '',
    password: '',
    designation: '',
    department: ''
  };
  errors = {};
  submitted = false;
  isreadonly = undefined;

  /*@ngInject*/
  constructor(Auth, $state, $stateParams, User) {
    this.Auth = Auth;
    this.$state = $state;

    this.User = User;
    //checking if the user already exists
    this.User.alreadyUser({}, {
        email: $stateParams.email,
        team: $stateParams.teamId
      })
      .$promise.then(data => {
        if (data.registered)
          this.$state.go('login');
      });


    //changing the readonly status of email based on url so that the form is same for invited and random user
    console.log($stateParams.email);
    if ($stateParams.email == '') {
      this.isreadonly = false;
      // console.log(this.isreadonly);

    } else {
      this.isreadonly = true;
      // console.log(this.isreadonly);
      this.user.email = $stateParams.email;
    }

    // get the organisation
    this.user.organisation = $stateParams.organisationId;
    //get the team name
    this.user.team = $stateParams.teamId;
  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      return this.Auth.createUser({
          name: this.user.name,
          organisation: this.user.organisation,
          teams: this.user.team,
          email: this.user.email,
          password: this.user.password,
          designation: this.user.designation,
          department: this.user.department
        })
        .then(() => {
          // Account created, redirect to home
          //message to show request status
          var msg = 'Registered in Organisation: ' + this.user.organisation + ' in team: ' + this.user.team + '.';
          this.$state.go('main', {
            message: msg
          });
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
