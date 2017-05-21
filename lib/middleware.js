'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _izz = require('izz');

var _izz2 = _interopRequireDefault(_izz);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _handle = require('./handle');

var _handle2 = _interopRequireDefault(_handle);

var _presets = require('./presets');

var _presets2 = _interopRequireDefault(_presets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var custom = arguments[1];


  // all handlers, the build-in and the custom...
  var handlers = _extends({}, _presets2.default, custom);

  return function (store) {
    return function (next) {
      return function (action) {
        // getting bus from action
        var busses = action.bus;
        delete action.bus;

        // bus object can be in action itself or in payload,
        // if action has .bus,
        // ignore that of the payload
        if (action.payload && action.payload.bus) {
          if (!busses) busses = action.payload.bus;
          delete action.payload.bus;
        }

        if (!busses) return next(action);

        return manageBusses(handlers, options, store, next, action, busses);
      };
    };
  };
};

function manageBusses(handlers, options, store, next, action, busses) {

  // ensure that busses is an array of objects ... [bus1, bus2,...]
  var parsedBusses = (0, _parse2.default)(busses);

  // if parsedBusses are not a real object.. no need to continue..
  if (!parsedBusses) return next(action);

  // getting the first bus that should be handeled here...
  var bus = parsedBusses.shift();

  // save the rest of bussess within the action for another calls
  if (parsedBusses.length) action.bus = parsedBusses;

  return manage(handlers, options, store, next, action, bus);
}

function manage(handlers, options, store, next, action, bus) {

  // ensure that bus is an object with data inside...
  if (_izz2.default.empty(bus) || _izz2.default.not.object(bus)) return next(action);

  var handlerName = bus.handler,
      command = bus.command,
      props = bus.props,
      _bus$params = bus.params,
      params = _bus$params === undefined ? [] : _bus$params;

  // getting the target handler function...

  var handler = handlers[handlerName];

  // ensure that handler is a function...
  if (_izz2.default.not.function(handler)) return next(action);

  var handlerOptions = void 0;

  if (options && _izz2.default.json(options)) handlerOptions = options[handlerName] || {};

  // getting store's state
  var state = store.getState() || {};

  // getting all bus queues from store..
  var busQueues = state.bus || {};

  // getting the target queue of the current handler...
  var handlerQueue = busQueues[handlerName] || {
    buffer: []
  };

  if (!handlerQueue.buffer) handlerQueue.buffer = [];
  // call the handler with all the specific data,
  // get the updated queue to be saved in the state..
  var newHanderQueue = handler.apply(undefined, [handlerOptions, store, next, action, handlerQueue, command, props].concat(_toConsumableArray(params)));

  // if the handler did not return a queue, ignore it
  if (!newHanderQueue) return;

  // dispatch this action with the new queue..
  var busAction = {
    type: '@@bus/UPDATE_QUEUE',
    payload: {
      handler: handlerName,
      queue: newHanderQueue
    }
  };
  store.dispatch(busAction);
}