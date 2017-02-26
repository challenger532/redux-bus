(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ReduxBus = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _middleware = require('./middleware');

Object.defineProperty(exports, 'createBus', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_middleware).default;
  }
});

var _reducer = require('./reducer');

Object.defineProperty(exports, 'reducer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_reducer).default;
  }
});

var _undoLastAction = require('./presets/undoLastAction');

Object.defineProperty(exports, 'undoLastAction', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_undoLastAction).default;
  }
});

var _holdActions = require('./presets/holdActions');

Object.defineProperty(exports, 'holdActions', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_holdActions).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  reducer: exports.reducer,
  createBus: exports.createBus,
  holdActions: exports.holdActions,
  undoLastAction: exports.undoLastAction
};
},{"./middleware":2,"./presets/holdActions":3,"./presets/undoLastAction":4,"./reducer":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (middlewares) {
  return function (store) {
    return function (next) {
      return function (action) {
        // getting meta from action
        var meta = action.meta;

        // meta object can be in action itself or in payload,
        // if action has .meta,
        // ignore that of the payload
        if (!meta) {
          if (action.payload && action.payload.meta) {
            meta = action.payload.meta;
          }
        }

        meta = metaParser(meta);

        // ignore normal actions with no .meta
        if (!meta) return next(action);
        var _meta = meta,
            handler = _meta.handler;

        var middleware = middlewares[handler];

        if (middleware) {
          // bus has not been initialized, so it must be validated..
          var bus = store.getState().bus || {};

          // queue is an object
          // so it can has properties
          // other that just buffer
          // for future possible features..
          var queue = bus[handler] || { buffer: [] };

          // the handler is attached and passed along
          // so we take it out of the action
          action = Object.assign({}, action);
          delete action.meta;
          delete action.payload.meta;

          // this middleware will take a queue and must return a queue
          queue = middleware(store, next, action, queue, meta);

          // add validation that the return of the middleware is queue
          if (!queue.buffer && !queue.buffer.length) return;

          // actions to update the buffer
          action = {
            type: '@@bus/UPDATE_QUEUE',
            payload: {
              queue: queue,
              handler: handler
            }
          };
          store.dispatch(action);
        }
        return next(action);
      };
    };
  };
};

// fix .meta,
// allowing actions to be dispatch with .meta as string value
// @example:
// `meta: 'undoLasaction UNDO'`


var metaParser = function metaParser(meta) {
  if (!meta) return;

  if (typeof meta === 'string') {
    var content = meta.split(' ');
    var length = content.length;
    var result = {
      handler: length > 0 ? content[0] || '' : '',
      action: length > 1 ? content[1] || '' : ''
    };
    return result;
  }

  return meta;
};
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var HOLD_COUNT = 4;

exports.default = function (store, next, action, queue, meta) {
  var temp = void 0;
  switch (meta.action) {
    case 'PUSH':
      // push new action, if any action is saved, it will be ignored
      queue.buffer.push(action);
      break;
    case 'CLEAR':
      // remove all buffered actions
      queue.buffer = [];
      break;
    case 'POP_ALL':
      // do all the actions
      while (queue.buffer.length > 0) {
        next(queue.buffer.shift());
      }
      break;
  }

  // in this example the buffer should contains only one item
  // if you pushed an action before doing the existing one, it will be ignored
  if (queue.buffer.length > HOLD_COUNT) {
    for (var i = 0; i < HOLD_COUNT; i++) {
      temp = queue.buffer.shift();
      if (temp) next(temp);
    }
  }

  // return the queue that must be saved
  return queue;
};
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (store, next, action, queue, meta) {
  var temp = void 0;
  switch (meta.action) {
    case 'UNDO':
      queue.buffer.pop();
      break;
    case 'PUSH':
      // save new action, if any action is saved it will be ignored
      queue.buffer.push(action);
      break;
    case 'DO':
      // dispatch the buffered action
      temp = queue.buffer.shift();
      if (temp) next(temp);
      break;
    case 'DO_PUSH':
      // save new action
      temp = queue.buffer.shift();
      if (temp) next(temp);
      queue.buffer.push(action);
      break;
  }

  // in this example, the buffer should contain only one item
  // if you pushed an action before completing the existing one,
  // it will be ignored
  if (queue.buffer.length > 1) queue.buffer.shift();

  // return the queue that must be saved
  return queue;
};
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case '@@bus/UPDATE_QUEUE':
      {
        return updateQueue(state, action);
      }
    default:
      return state;
  }
};

function updateQueue() {
  var bus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref = arguments[1];
  var _ref$payload = _ref.payload,
      queue = _ref$payload.queue,
      handler = _ref$payload.handler;

  return _extends({}, bus, _defineProperty({}, handler, queue));
}
},{}]},{},[1])(1)
});