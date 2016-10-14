'use strict';

export function OrganisationResource($resource) {
  'ngInject';

  return $resource('/api/organisations/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    fetchPendingRequests: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'requests'
      }
    },
    updateStatus: {
      method: 'PUT',
      params: {
        controller: 'updateStatus'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me',
      }
    },
    getOrgDetail: {
      method: 'GET',
      params: {
        id: '@id',
        controller: 'details'
      }
    },
    sendRequests: {
      method: 'POST',
      params: {
        controller: 'sendmails'
      }
    },
    makeAdmin: {
      method: 'POST',
      params: {
        controller: 'admin'
      }
    }
  });
}
