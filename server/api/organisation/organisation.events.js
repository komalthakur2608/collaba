/**
 * Organisation model events
 */

'use strict';

import {EventEmitter} from 'events';
import Organisation from './organisation.model';
var OrganisationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OrganisationEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Organisation.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    OrganisationEvents.emit(event + ':' + doc._id, doc);
    OrganisationEvents.emit(event, doc);
  };
}

export default OrganisationEvents;
