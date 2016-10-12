'use strict';

export default class AdminController {
  /*@ngInject*/
  constructor(Organisation) {

    // Use the User $resource to fetch all organisations
    this.Organisation = Organisation;
    this.organisations = Organisation.fetchPendingRequests();
  }

  updateStatus(organisation, status) {
    if (status != 'on hold')
      this.organisations.splice(this.organisations.indexOf(organisation, 1));
    this.Organisation.updateStatus({
      id: organisation._id
    }, {
      status: status
    });

  }

}
