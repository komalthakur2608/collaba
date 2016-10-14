export default class OrgController {

  members = [];
  teams = [];
  details = {};
  sent_request = '';
  org_id = '';
  isEmployeeCollapsed = false;
  isTeamCollapsed = false;
  isTeamDetailCollapsed = false;
  constructor(Auth, $stateParams, Organisation) {
    'ngInject';
    this.Auth=Auth;
    this.details;
    this.Organisation = Organisation;
    this.org_id = this.Auth.getCurrentOrgSync()._id;
    this.getDetails(this.org_id);
  }

  getDetails(id) {
    this.Organisation.getOrgDetail({id : id}).$promise.then(data => {
      this.details=data;
      this.members = this.details.members;
      this.teams = this.details.teams;
    });
  }

  sendRequest(form){
    console.log(this.emails);
    this.Organisation.sendRequests({}, {emails : this.emails, team : this.team, orgId :this.org_id}).$promise.then(res => {
      console.log(res);
      if(res.result == 'done') {
        this.getDetails(this.org_id);
        this.sent_request = "invites sent";
        this.emails = '';
        this.team = '';
      }
      else {
          this.sent_request = " team name should be unique";
      }

    })

  }

  joinCurrentTeam(form, orgId, teamId){
    console.log(this.joinTeamEmails);
    console.log(orgId + "  " + teamId);

    this.Organisation.sendRequests({}, {emails : this.joinTeamEmails, teamId : teamId, orgId :this.org_id}).$promise.then(res => {
      console.log(res);
      if(res.result == 'done') {
        alert("request sent");
        this.joinTeamEmails = '';
      }
    })

  }

  isAdmin(member) {
     if(member.role == 'team_admin'){
      return true;
    }
    return false;
  }

  makeAdmin(teamId, teamMemberId){
    console.log("team id "+teamId);
    console.log("team member id "+teamMemberId);
    this.Organisation.makeAdmin({}, { teamId : teamId, teamMemberId :teamMemberId}).$promise.then(res =>{
      this.getDetails(this.org_id);
    })
  }
}
