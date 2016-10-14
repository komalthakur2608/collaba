/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import Organisation from '../api/organisation/organisation.model';
import Team from '../components/models/team.model';
import Channel from '../components/models/channel.model';

//Admin User (SaaS Owner)
var admin = new User({
  provider: 'local',
  role: 'admin',
  name: 'Admin',
  email: 'admin@example.com',
  password: 'admin',
  designation: 'admin',
  department: 'admin',
  organisationName: '',
  teamName: ''
});

//Users (in total 11)
var mohini = new User({
  provider: 'local',
  name: 'Mohini Agarwal',
  email: 'mohini@gmail.com',
  password: 'mohini',
  designation: 'mohini',
  department: 'mohini',
});
var aarushi = new User({
  provider: 'local',
  name: 'Aarushi Gupta',
  email: 'aarushi@gmail.com',
  password: 'aarushi',
  designation: 'aarushi',
  department: 'aarushi',
});
var shubhanshu = new User({
  provider: 'local',
  name: 'Shubhanshu Aggarwal',
  email: 'shubhanshu@gmail.com',
  password: 'shubhanshu',
  designation: 'shubhanshu',
  department: 'shubhanshu',
});
var ankita = new User({
  provider: 'local',
  name: 'Ankita Rustagi',
  email: 'ankita@gmail.com',
  password: 'ankita',
  designation: 'ankita',
  department: 'ankita',
});
var komal = new User({
  provider: 'local',
  name: 'Komal Thakur',
  email: 'komal@gmail.com',
  password: 'komal',
  designation: 'komal',
  department: 'komal',
});
var parveen = new User({
  provider: 'local',
  name: 'Parveen Arya',
  email: 'parveen@gmail.com',
  password: 'parveen',
  designation: 'parveen',
  department: 'parveen',
});
var yogita = new User({
  provider: 'local',
  name: 'Yogita Nain',
  email: 'yogita@gmail.com',
  password: 'yogita',
  designation: 'yogita',
  department: 'yogita',
});
var gaurav = new User({
  provider: 'local',
  name: 'Gaurav Kishore',
  email: 'gaurav@gmail.com',
  password: 'gaurav',
  designation: 'gaurav',
  department: 'gaurav',
});
var nikesh = new User({
  provider: 'local',
  name: 'Nikesh Patel',
  email: 'nikesh@gmail.com',
  password: 'nikesh',
  designation: 'nikesh',
  department: 'nikesh',
});
var divya = new User({
  provider: 'local',
  name: 'Divya Garg',
  email: 'divya@gmail.com',
  password: 'divya',
  designation: 'divya',
  department: 'divya',
});
var priyanka = new User({
  provider: 'local',
  name: 'Priyanka Gupta',
  email: 'priyanka@gmail.com',
  password: 'priyanka',
  designation: 'priyanka',
  department: 'priyanka',
});
var ahmar = new User({
  provider: 'local',
  name: 'Ahmar Suhail',
  email: 'ahmar@gmail.com',
  password: 'ahmar',
  designation: 'ahmar',
  department: 'ahmar',
});
var luv = new User({
  provider: 'local',
  name: 'Luv Karakoti',
  email: 'luv@gmail.com',
  password: 'luv',
  designation: 'luv',
  department: 'luv',
});

//Organisations (in total 2)
var niit = new Organisation({
  name: 'NIIT Technologies',
  email: 'niit@gmail.com',
  password: 'niit',
  website: 'www.niit-tech.com',
  about: 'about',
  address: 'address',
  phone: 'phone',
  domainName: 'NIIT-tech.com',
  status: 'approved'
});

var collaba = new Organisation({
  name: 'Collaba',
  email: 'collaba@gmail.com',
  password: 'collaba',
  website: 'www.collaba.com',
  about: 'about',
  address: 'address',
  phone: 'phone',
  domainName: 'collaba.com',
  status: 'approved'
});

//Pushing members to organisations
niit.members.push(luv._id, divya._id, priyanka._id, gaurav._id, nikesh._id, yogita._id);
collaba.members.push(parveen._id, mohini._id, shubhanshu._id, ankita._id, aarushi._id, komal._id, ahmar._id);

//Pushing organisation in user
luv.organisation = niit._id;
divya.organisation = niit._id;
priyanka.organisation = niit._id;
gaurav.organisation = niit._id;
nikesh.organisation = niit._id;
yogita.organisation = niit._id;

parveen.organisation = collaba._id;
mohini.organisation = collaba._id;
shubhanshu.organisation = collaba._id;
ankita.organisation = collaba._id;
aarushi.organisation = collaba._id;
komal.organisation = collaba._id;
ahmar.organisation = collaba._id;

//Channels, each team have 3 channel, one is general channel for the team, other is public channel open to the whole organisation, third is private channel that is private to channel members
var aTeamGeneral = new Channel({
  name: 'general',
  status: 'private',
  members: [shubhanshu._id, mohini._id, ankita._id, parveen._id]
});

var aTeamPublic = new Channel({
  name: 'A_TEAM_PUBLIC',
  status: 'public',
  members: [shubhanshu._id, mohini._id, ankita._id, parveen._id, komal._id, ahmar._id, aarushi._id]
});

var aTeamPrivate = new Channel({
  name: 'A_TEAM_PRIVATE',
  status: 'private',
  members: [mohini._id, ankita._id, parveen._id]
});

var bTeamGeneral = new Channel({
  name: 'general',
  status: 'private',
  members: [komal._id, ahmar._id, aarushi._id, ankita._id]
});

var bTeamPublic = new Channel({
  name: 'B_TEAM_PUBLIC',
  status: 'public',
  members: [shubhanshu._id, mohini._id, ankita._id, parveen._id, komal._id, ahmar._id, aarushi._id]
});

var bTeamPrivate = new Channel({
  name: 'B_TEAM_PRIVATE',
  status: 'private',
  members: [komal._id, ahmar._id, aarushi._id]
});

var cTeamGeneral = new Channel({
  name: 'general',
  status: 'private',
  members: [luv._id, divya._id, priyanka._id, gaurav._id]
});

var cTeamPublic = new Channel({
  name: 'C_TEAM_PUBLIC',
  status: 'public',
  members: [luv._id, divya._id, priyanka._id, gaurav._id, nikesh._id, yogita._id]
});

var cTeamPrivate = new Channel({
  name: 'C_TEAM_PRIVATE',
  status: 'private',
  members: [luv._id, divya._id, priyanka._id]
});


var dTeamGeneral = new Channel({
  name: 'general',
  status: 'private',
  members: [gaurav._id, nikesh._id, yogita._id]
});

var dTeamPublic = new Channel({
  name: 'D_TEAM_PUBLIC',
  status: 'public',
  members: [gaurav._id, nikesh._id, yogita._id, luv._id, divya._id, priyanka._id]
});

var dTeamPrivate = new Channel({
  name: 'D_TEAM_PRIVATE',
  status: 'private',
  members: [gaurav._id, yogita._id]
});

//Teams (in total 4, 2 for each organisation)
var aTeam = new Team({
  name: 'A-Team',
  organisation: collaba._id,
  general: aTeamGeneral._id,
  members: [{
    member: shubhanshu._id,
    role: 'team_admin'
  }, {
    member: mohini._id,
    role: 'user'
  }, {
    member: ankita._id,
    role: 'user'
  }, {
    member: parveen._id,
    role: 'user'
  }]
});

var bTeam = new Team({
  name: 'B-Team',
  organisation: collaba._id,
  general: bTeamGeneral._id,
  members: [{
    member: komal._id,
    role: 'team_admin'
  }, {
    member: ahmar._id,
    role: 'user'
  }, {
    member: aarushi._id,
    role: 'user'
  }, {
    member: ankita._id,
    role: 'user'
  }]
});

var cTeam = new Team({
  name: 'C-Team',
  organisation: niit._id,
  general: cTeamGeneral._id,
  members: [{
    member: luv._id,
    role: 'team_admin'
  }, {
    member: divya._id,
    role: 'user'
  }, {
    member: priyanka._id,
    role: 'user'
  }, {
    member: gaurav._id,
    role: 'user'
  }]
});

var dTeam = new Team({
  name: 'D-Team',
  organisation: niit._id,
  general: dTeamGeneral._id,
  members: [{
    member: gaurav._id,
    role: 'team_admin'
  }, {
    member: nikesh._id,
    role: 'user'
  }, {
    member: yogita._id,
    role: 'user'
  }]
});

//Pushing teams to organisation
collaba.teams.push(aTeam._id);
collaba.teams.push(bTeam._id);

niit.teams.push(cTeam._id);
niit.teams.push(dTeam._id);

//Pushing public channels to organisations
collaba.public.push(aTeamPublic._id);
collaba.public.push(bTeamPublic._id);

niit.public.push(cTeamPublic._id);
niit.public.push(dTeamPublic._id);



//Pushing channels to teams
aTeam.channels.push(aTeamGeneral._id);
aTeam.channels.push(aTeamPublic._id);
aTeam.channels.push(aTeamPrivate._id);

bTeam.channels.push(bTeamGeneral._id);
bTeam.channels.push(bTeamPublic._id);
bTeam.channels.push(bTeamPrivate._id);

cTeam.channels.push(cTeamGeneral._id);
cTeam.channels.push(cTeamPublic._id);
cTeam.channels.push(cTeamPrivate._id);

dTeam.channels.push(dTeamGeneral._id);
dTeam.channels.push(dTeamPublic._id);
dTeam.channels.push(dTeamPrivate._id);


//Setting team to channels
aTeamGeneral.team = aTeam._id;
bTeamGeneral.team = bTeam._id;
cTeamGeneral.team = cTeam._id;
dTeamGeneral.team = dTeam._id;
aTeamPublic.team = aTeam._id;
bTeamPublic.team = bTeam._id;
cTeamPublic.team = cTeam._id;
dTeamPublic.team = dTeam._id;
aTeamPrivate.team = aTeam._id;
bTeamPrivate.team = bTeam._id;
cTeamPrivate.team = cTeam._id;
dTeamPrivate.team = dTeam._id;

//Pushing channels to user
shubhanshu.channels.push(aTeamPublic._id);
mohini.channels.push(aTeamPublic._id);
ankita.channels.push(aTeamPublic._id);
parveen.channels.push(aTeamPublic._id);
komal.channels.push(aTeamPublic._id);
ahmar.channels.push(aTeamPublic._id);
aarushi.channels.push(aTeamPublic._id);
shubhanshu.channels.push(bTeamPublic._id);
mohini.channels.push(bTeamPublic._id);
ankita.channels.push(bTeamPublic._id);
parveen.channels.push(bTeamPublic._id);
komal.channels.push(bTeamPublic._id);
ahmar.channels.push(bTeamPublic._id);
aarushi.channels.push(bTeamPublic._id);

luv.channels.push(cTeamPublic._id);
divya.channels.push(cTeamPublic._id);
priyanka.channels.push(cTeamPublic._id);
gaurav.channels.push(cTeamPublic._id);
nikesh.channels.push(cTeamPublic._id);
yogita.channels.push(cTeamPublic._id);
luv.channels.push(dTeamPublic._id);
divya.channels.push(dTeamPublic._id);
priyanka.channels.push(dTeamPublic._id);
gaurav.channels.push(dTeamPublic._id);
nikesh.channels.push(dTeamPublic._id);
yogita.channels.push(dTeamPublic._id);

shubhanshu.channels.push(aTeamGeneral._id);
mohini.channels.push(aTeamGeneral._id);
ankita.channels.push(aTeamGeneral._id);
parveen.channels.push(aTeamGeneral._id);
komal.channels.push(bTeamGeneral._id);
ahmar.channels.push(bTeamGeneral._id);
aarushi.channels.push(bTeamGeneral._id);
ankita.channels.push(bTeamGeneral._id);

luv.channels.push(cTeamGeneral._id);
divya.channels.push(cTeamGeneral._id);
priyanka.channels.push(cTeamGeneral._id);
gaurav.channels.push(cTeamGeneral._id);
gaurav.channels.push(dTeamGeneral._id);
nikesh.channels.push(dTeamGeneral._id);
yogita.channels.push(dTeamGeneral._id);

mohini.channels.push(aTeamPrivate._id);
ankita.channels.push(aTeamPrivate._id);
parveen.channels.push(aTeamPrivate._id);

komal.channels.push(bTeamPrivate._id);
aarushi.channels.push(bTeamPrivate._id);
ahmar.channels.push(bTeamPrivate._id);

luv.channels.push(cTeamPrivate._id);
divya.channels.push(cTeamPrivate._id);
priyanka.channels.push(cTeamPrivate._id);

gaurav.channels.push(dTeamPrivate._id);
yogita.channels.push(dTeamPrivate._id);

//Pushing teams to users
shubhanshu.teams.push(aTeam._id);
mohini.teams.push(aTeam._id);
ankita.teams.push(aTeam._id);
parveen.teams.push(aTeam._id);
komal.teams.push(bTeam._id);
ahmar.teams.push(bTeam._id);
aarushi.teams.push(bTeam._id);
ankita.teams.push(bTeam._id);

luv.teams.push(cTeam._id);
divya.teams.push(cTeam._id);
priyanka.teams.push(cTeam._id);
gaurav.teams.push(cTeam._id);
gaurav.teams.push(dTeam._id);
nikesh.teams.push(dTeam._id);
yogita.teams.push(dTeam._id);



User.find({})
  .remove()
  .then(() => {
    Organisation.find({})
      .remove()
      .then(() => {
        Team.find({})
          .remove()
          .then(() => {
            Channel.find({})
              .remove()
              .then(() => {
                //Add new data here
                User.create(admin, parveen, mohini, komal, aarushi, ankita, shubhanshu, yogita, gaurav, nikesh, ahmar, luv);
                Organisation.create(niit, collaba);
                Team.create(aTeam, bTeam, cTeam, dTeam);
                Channel.create(aTeamGeneral, bTeamGeneral, cTeamGeneral, dTeamGeneral, aTeamPublic, bTeamPublic, cTeamPublic, dTeamPublic, aTeamPrivate, bTeamPrivate, cTeamPrivate, dTeamPrivate);
              });
          });
      });
  });
