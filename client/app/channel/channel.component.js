'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');
const ngSanitize = require('angular-sanitize');
const ngAnimate = require('angular-animate');
import routes from './channel.routes';

export class ChannelComponent {

  // ID of team in which teamAdmin is created channels
  teamId = '';
// ID of current user
  id = '';
  members = [];
  memberList = [];
  memberListObj = [];
  teams = [];

  /*@ngInject*/
  constructor($http, Auth, $stateParams, $state) {
    this.$http = $http;
    this.Auth = Auth;
    this.$state = $state;
    this.$stateParams = $stateParams;
  }

  $onInit(){
    this.Auth.getCurrentUser()
    .then(currentUser => {
      this.id = currentUser._id;
      //Get user Info, Organisations, Teams and channels
      this.$http.get('/api/users/getUserInfo/' + this.id)
      .then(response => {
        this.teams = response.data.teams;
        console.log("response of team " + JSON.stringify(response.data.teams));
        this.teams.forEach(teamData => {
          if(teamData._id == this.$stateParams.teamId){
            //console.log("teamData: "+JSON.stringify(teamData));
            teamData.members.forEach(memberData => {
              //console.log("member data: "+JSON.stringify(memberData));
                if(memberData.member._id != this.id) 
                  this.members.push(memberData.member);
                  });
                  console.log("---------------team members:  "+JSON.stringify(this.members));
            }
        });
      });
    });
  }
  addMember(member){
    console.log("button clicked");
    console.log("member: "+JSON.stringify(member));
    for (var i = 0; i < this.members.length; i++) {
      if(this.members[i]._id == member._id){
        this.members.splice(i,1);
        this.memberList.push(member._id);
        this.memberListObj.push(member);
        this.customSelected = '';
        return;
      }
    }
    alert("not a valid emailId");
  }

  createPrivateChannel(){
    var flag = 0;
    if(this.memberList == null || this.channelName == null){
     alert("invalid ChannelName or EmailId");
    }
    else{
      this.teams.forEach(team =>{
        if(team._id == this.$stateParams.teamId) {
          team.channels.forEach(channel=>{
            if(channel.name == this.channelName){
              alert("This channel name already exists");
              flag = 1;
            }
          });
          if(flag == 0){
            this.memberList.push(this.id);
            this.$http.post("/api/users/createPrivateChannel", { 
              members : this.memberList,
              teamId : this.$stateParams.teamId,
              channelName : this.channelName
            }).then(res => {
              alert("return after creating channel");
              this.$state.go('chat');   
            })
          }
          else {
            this.$state.go('chat');
          }
        }
      });
    }
  }

  createPublicChannel(form) {

    this.$http.get('/api/users/publicChannelNames/'+ this.$stateParams.teamId)
      .then(res => {
        alert("channelNames : " + res.data.channelNameArray);
        if(res.data.channelNameArray.indexOf(this.publicChannel) < 0){
          this.$http.post('/api/users/createPublicChannel/' + this.$stateParams.teamId + "/" + this.publicChannel)
          .then(res => {
            this.$state.go('chat');
          })
        }
        else {
          alert("channel name should be unique");
        }
      })
  }
}

export default angular.module('channel', [uiRouter,uiBootstrap,ngAnimate,ngSanitize])
.config(routes)
.component('channel', {
  template: require('./channel.html'),
  controller: ChannelComponent,
  controllerAs: 'channelCtrl'
})
.name;
