'use strict';

var window = require('@adobe/reactor-window');

/**
 * The types of events that can be dispatched
 */
var EVENT_TYPES = Object.freeze({
  Link: 'LINK',
  Load: 'LOAD'
});

var trackLoad = function(data) {
  window._satellite.track('LegacyDDL:LOAD', data);
};
var trackLink = function(data) {
  window._satellite.track('LegacyDDL:LINK', data);
};

// This is the replacement fn for window.NCIDataLayer.push,
// which will dispatch the events. NOTE: the signature for
// push is arr.push(element1[, ...[, elementN]]) meaning
// that push can be called with multipe elements.
var pusher = function() {
  // Get all the arguments, as push takes in n number of arguments.
  for (var i = 0; i < arguments.length; i++) {
    var evtType = arguments[i].type;
    var evtData = arguments[i].data;

    if (!evtType) {
      turbine.logger.error("Dumb Data Layer: 'type' is missing from Event object");
      continue;
    }
    if (!evtData) {
      turbine.logger.error("Dumb Data Layer: 'data' is missing from Event object");
      continue;
    }

    if (evtType === EVENT_TYPES.Load) {
      trackLoad(evtData);
    } else if (evtType === EVENT_TYPES.Link) {
      trackLink(evtData);
    } else {
      turbine.logger.error('Dumb Data Layer: unknown event type ' + evtType);
    }
  }
};

// We will name our Event-driven Data Layer (EDDL)
// NCIDataLayer to ensure that it does not conflict
// with any future changes.
turbine.logger.debug('Begin Dumb Datalayer Initialization');


// Make sure the data layer exists
window.dumbDataLayer = window.dumbDataLayer || [];

// Set our pusher if it is not already set
// this should avoid accidental re-initializations
if (window.dumbDataLayer.push !== pusher) {
  // Process all the existing items until the queue is
  // empty.
  var existingItem;
  // eslint-disable-next-line no-cond-assign, no-undefined
  while ((existingItem = window.dumbDataLayer.shift()) !== undefined) {
    pusher({
      type: existingItem.type,
      data: existingItem.data
    });
  }
  window.dumbDataLayer.push = pusher;
}
