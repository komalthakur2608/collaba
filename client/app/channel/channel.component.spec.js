'use strict';

describe('Component: ChannelComponent', function() {
  // load the controller's module
  beforeEach(module('channel'));

  var ChannelComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ChannelComponent = $componentController('channel', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
