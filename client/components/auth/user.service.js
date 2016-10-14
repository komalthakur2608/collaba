'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    alreadyUser: {
      method: 'POST',
      params: {
        controller: 'alreadyUser'
      }
    },
    findOrg: {
      method: 'POST',
      params: {
        controller: 'findOrg'
      }
    }
  });
}
