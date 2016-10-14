'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './wall.routes';

export class WallComponent {
  chatHistory = {};       //Store chat history of user
  id = '';                //Strore id of user
  userName = '';
  leftDiv=[];
  rightDiv=[];
  totalWalls=4;
  channels = [];
  /*@ngInject*/
  constructor(socket, $http, Auth, Notification) {
    this.socket = socket;  //This service is used to emit and receive socket
    this.Auth = Auth;      //This serevice contain auth related functions
    this.$http = $http;    //This service is used to send and retrieve data from server
    this.Notification=Notification;
  }

  $onInit(){
    this.Auth.getCurrentUser()
    .then(currentUser=>{
      this.id = currentUser._id;

      this.$http.get('/api/users/getPublicChannels/' + this.id)
      .then(response => {
        //console.log("Response:"+response.data);
        //Set user name
        this.userName = response.data.name;
        for (var i = 0; i < response.data.channels.length; i++) {
          if(this.rightDiv.length!=this.totalWalls){
            this.rightDiv.push({
              id:response.data.channels[i]._id,
              name:response.data.channels[i].name,
              teamName:response.data.channels[i].team.name
            });

            this.chatHistory[response.data.channels[i]._id]=response.data.channels[i].history;
            console.log(this.chatHistory);
            this.chatHistory[response.data.channels[i]._id].reverse();

          }
          else{
            this.leftDiv.push({
              id:response.data.channels[i]._id,
              name:response.data.channels[i].name,
              teamName:response.data.channels[i].team.name
            });
          }

          //Join room for each channelId
          //this.socket.room(response.data.channels[i]._id);

        }
        console.log("rightDiv:"+JSON.stringify(this.rightDiv));
        console.log("leftDiv:"+JSON.stringify(this.leftDiv));
      });

      this.$http.get('/api/users/getUserInfo/' + this.id)
      .then(response => {
        for (var i = 0; i < response.data.channels.length; i++) {
          this.channels.push(response.data.channels[i]._id);
          //Join room for each channelId
          this.socket.room(response.data.channels[i]._id);
        }
      });
    });

    //Updating chat messages when new message is set on the room
    this.socket.syncUpdatesChats(data => {
      this.chatHistory[data.room].unshift({
          user: data.user,
          message: data.message
        });
      this.Notification.primary('New Message on channel '+data.channelName);
    });
  }

  $onDestroy() {
    this.channels.forEach(channel =>{
      this.socket.leaveRoom(channel);
      alert("leaving channels : " + channel);
    });
  }

  channelClick(channel){
    console.log("channelClick:"+JSON.stringify(channel));
    //If length ==1  remove 0th channel from rightDiv
    if(this.rightDiv.length==this.totalWalls){
      //Add to leftDiv the removed channel
      this.leftDiv.push({
        id:this.rightDiv[0]['id'],
        name:this.rightDiv[0]['name'],
        teamName:this.rightDiv[0]['teamName']
      });

      //remove 0th index channel
      var cId=this.rightDiv[0]['id'];
      this.rightDiv.splice(0,1);
      //remove chatHistory
      delete(this.chatHistory[cId]);
    }
      //push the channel in rightDiv
      this.rightDiv.push({
        id:channel.id,
        name:channel.name,
        teamName:channel.teamName
      });
      //Hit the api to get chat history for current channel id
      this.$http.get('/api/users/getChannelInfo/' + this.id + "/" + channel.id)
      .then(response => {
        console.log(response.data);
        //Set history in the chatHistory array coming from the api for current channel
        this.chatHistory[channel.id]=response.data.history;
        this.chatHistory[channel.id].reverse();
      });

      //remove channel from leftDiv
      for(var index in this.leftDiv){
        var obj=this.leftDiv[index];
        if(obj.id==channel.id){
          this.leftDiv.splice(index,1);
          break;
        }
      }
  }

  closeWall(channel){
    console.log("closeWall:"+JSON.stringify(channel));
    //remove chatHistory
    delete(this.chatHistory[channel.id]);

    //remove Channel from rightDiv
    for (var index in this.rightDiv) {
      var obj=this.rightDiv[index];
      if(obj.id==channel.id){
        this.rightDiv.splice(index,1);
        break;
      }
    }
    //Add channel to leftDiv
    this.leftDiv.push({
      id:channel.id,
      name:channel.name,
      teamName:channel.teamName
    });

  }

  sendMessage(channel){
    //If the input field is not empty
    if (this.message[channel.id]) {
      var msg=this.message[channel.id];
      //Empty the input field
      this.message[channel.id] = '';
      //Hit api to update chat history in the db
      this.$http.post('/api/users/saveMessage/' + channel.id, {
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
            'room': channel.id,
            'channelName':channel.name
          })
        }else{
          alert("Message not sent");
        }

      });
    }
  }

}

export default angular.module('collabaApp.wall', [uiRouter,'ui-notification'])
  .config(routes)
  .component('wall', {
    template: require('./wall.html'),
    controller: WallComponent,
    controllerAs: 'wallCtrl'
  })
  .name;
