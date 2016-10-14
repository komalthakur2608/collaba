'use strict';

import angular from 'angular';
export default class SignupController {

//Model design

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
  orgid = null;
  orgname = null;


  /*@ngInject*/
  constructor(Auth, $state, $stateParams, User) {
    this.Auth = Auth;
    this.$state = $state;
    this.User = User;
    this.$stateParams = $stateParams;

    //changing the readonly status of email based
    //on url so that the form is same for invited and random user

    console.log($stateParams.email);

    //checking whether a custom user
    //or invited via link

    if ($stateParams.email == '') {

      //If custom user then he/she can enter email

      this.isreadonly = false;

    } else {

      //checking if the user invited via link already exists
      //so that he/she doesnot register again

      this.User.alreadyUser({}, {
        email: $stateParams.email,
        teamId: $stateParams.teamId
      })
      .$promise.then(data => {

        //user is registerd and pushed in corresponding team
        //and hence send to login

        if (data.registered)
        this.$state.go('login');

        //if user already exist in that team

        else if(data.message=="already exists in team")
        {
          this.$state.go('main');
        }

        //New user to register

        else {
          this.orgid = data.organisationId;

          // get the organisation
          //set organisation field in the form

          this.user.organisation = data.organisationName;
          this.orgname = data.organisationName;

          //get the team name
          //setting the team name in the registeration form

          this.user.team = data.teamName;
        }
      });
      //Making email readonly when invited via link
      this.isreadonly = true;
      // console.log(this.isreadonly);

      //setting the email field in the registeration form

      this.user.email = $stateParams.email;
    }
  }

  //For new cutom user checking whether
  //the domain with which he is registering,
  //organisation with that domain exists or not

  findOrg = function () {

    console.log("in signup controller findorg");

//If the orgname is not set in controller
//i.e the user is not invited via link

    if (this.orgname == null && this.user.email!= '') {
      console.log(this.user.email.split('@')[1]);

      //Sending the domain enter by user

      this.User.findOrg({}, {
        domain: this.user.email.split('@')[1]
      })
      .$promise.then(data => {

        //If organisation with domain exists

        if (data.registered) {

          //setting the organisation name field in the registeration form

          this.user.organisation = data.organisationName;

        //  this.orgname = data.organisationName;

          this.orgid = data.organisationId;

          //setting orgname null so that if the custom re-enter
          //email

          this.orgname = null;
        } else {

          //When the organisation is nto registered

          this.$state.go('main');
        }
      })

    }

  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {

      //Custom user registeration

      if (this.user.team == '') {
        return this.Auth.createUser({
          name: this.user.name,
          organisation: this.orgid,
          email: this.user.email,
          password: this.user.password,
          designation: this.user.designation,
          department: this.user.department
        })
        .then(() => {

          // Account created, redirect to home
          //message to show request status

          var msg = 'Registered';
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

      //Saving the Invited user

      else {
        return this.Auth.createUser({
          name: this.user.name,
          organisation: this.orgid,
          teams: this.$stateParams.teamId,
          email: this.user.email,
          password: this.user.password,
          designation: this.user.designation,
          department: this.user.department
        })
        .then(() => {

          // Account created, redirect to home
          //message to show request status

          var msg = 'Registered in Organisation: ' + this.user.organisation + ' in team: ' + this.user.team + '.';
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
}
