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