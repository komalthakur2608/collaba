'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './chat.routes';

export class ChatComponent {
  teams = [];             //Store list of teams in which this user is a member
  channelId = '';         //User is active in which channel
  channelName = '';       //Store channel name
  chatHistory = [];       //Store chat history of user
  id = '';                //Strore id of user
  userName = '';          //store name of user
  teamChannels = {};      // To store channel for each team
  publicChannels=[];      //To store channel whose status is public
  channels = [];          //to store all channel ids
  /*@ngInject*/
  constructor(socket, $http, $scope, Auth, Notification) {
    this.socket = socket;  //This service is used to emit and receive socket
    this.Auth = Auth;      //This serevice contain auth related functions
    this.$http = $http;    //This service is used to send and retrieve data from server
    this.Notification=Notification;
  }

  //On intializing the controller
  $onInit() {

    this.Auth.getCurrentUser()
    .then(currentUser => {
      this.id = currentUser._id;
      //Get user Info, Organisations, Teams and channels
      this.$http.get('/api/users/getUserInfo/' + this.id)
      .then(response => {
        //Set user name
        this.userName = response.data.name;
        console.log("response data: "+JSON.stringify(response.data));
        //Set all teams in array
        this.teams = response.data.teams;


        //Creating teamChannels, publicChannels and setting teamRoles for particular user
        for (var i = 0; i < response.data.teams.length; i++) {
          //create teamChannels object as:
           /*
              {
                teamid:[array of channels]
            }

           */
          this.teamChannels[response.data.teams[i]._id] = [];
          //Set Team Role of the user for each team
          var teamrole="";
          for (var j = 0; j < response.data.teams[i].members.length; j++) {
              if(this.id==response.data.teams[i].members[j].member._id){
                teamrole=response.data.teams[i].members[j].role;
              }
          }
          this.teams[i]['teamRole']=teamrole;


          //Create public channels
          for (var j = 0; j < response.data.organisation.public.length; j++) {
            //if teamId in teams equal to public.team
            if(response.data.teams[i]._id==response.data.organisation.public[j].team){
              this.publicChannels.push(response.data.organisation.public[j]);
            }
            this.channels.push(response.data.organisation.public[j]._id);
            //Join room for each channelId
            this.socket.room(response.data.organisation.public[j]._id);
          }
        }
        console.log(JSON.stringify(this.teams));

        //push channels to corresponding team id
        for (var i = 0; i < response.data.channels.length; i++) {
          if(response.data.channels[i].status=="private"){
            this.teamChannels[response.data.channels[i].team._id].push(response.data.channels[i]);
            this.channels.push(response.data.channels[i]._id);
            //Join room for each channelId
            this.socket.room(response.data.channels[i]._id);
          }
        }




        //Get teamId for 1st team in teams array
        var tempId = response.data.teams[0]._id;
        //Set channelId and channelName default
        this.channelId = this.teamChannels[tempId][0]._id;
        this.channelName = this.teamChannels[tempId][0].name;

        //Set history in the chatHistory array coming from the api for the first channel
        for (var i = 0; i < response.data.channels.length; i++) {
          if(response.data.channels[i]._id==this.channelId){
            if (response.data.channels[i].history.length != 0) {
              for (var j = 0; j < response.data.channels[i].history.length; j++) {
                this.chatHistory.unshift({
                  sender: response.data.channels[i].history[j].user,
                  message: response.data.channels[i].history[j].message
                });
              }
            }
          }

        }

      });

      //Updating chat messages when new message is set on the room
      this.socket.syncUpdatesChats(data => {
        if(data.room==this.channelId){
          this.chatHistory.unshift({
            sender: data.user,
            message: data.message
          });
        }else{
          this.Notification.primary('New Message on channel '+data.channelName);
        }

      });
    });
  }

  $onDestroy() {
    this.channels.forEach(channel =>{
      this.socket.leaveRoom(channel);
      alert("leaving channels : " + channel);
    });
  }


  // On changing channel, click method
  channelClick(channel) {
    //Empty the chat history
    this.chatHistory = [];
    //Set new channelId in the current scope
    this.channelId = channel._id;
    this.channelName = channel.name;
    console.log("channel: " + this.channelId);
    console.log("channel Nmae: " + this.channelName);
    //Hit the api to get chat history for current channel id
    this.$http.get('/api/users/getChannelInfo/' + this.id + "/" + this.channelId)
    .then(response => {

      console.log(response.data);
      //Set history in the chatHistory array coming from the api for current channel
      if (response.data.history.length != 0) {
        for (var i = 0; i < response.data.history.length; i++) {
          this.chatHistory.unshift({
            sender: response.data.history[i].user,
            message: response.data.history[i].message
          });
        }
      }
    });
  }

  sendMessage() {
    //If the input field is not empty
    if (this.message) {
      var msg=this.message;
      //Empty the input field
      this.message = '';
      //Hit api to update chat history in the db
      this.$http.post('/api/users/saveMessage/' + this.channelId, {
        data: {
          'user': this.userName,
          'message': msg,
          'type': 'text'
        }
      })
      .then(response => {
        console.log(response.data);
        if(response.data=='Success'){
           //Emit the socket with senderName, message and channelId
          this.socket.sendMessage({
            'user': this.userName,
            'message': msg,
            'room': this.channelId,
            'channelName':this.channelName
          })
        }else{
          alert("Message not sent");
        }

      });
    }
  }

}

export default angular.module('yoCollabaApp.chat', [uiRouter,'ui-notification'])
.config(routes)
.component('chat', {
  template: require('./chat.html'),
  controller: ChatComponent,
  controllerAs: 'chatCtrl'
})
.name;