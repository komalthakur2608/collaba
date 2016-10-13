'use strict';

describe('Component: WallComponent', function() {
  // load the controller's module
  beforeEach(module('collabaApp.wall'));

  var WallComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    WallComponent = $componentController('wall', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
