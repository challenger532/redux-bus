'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options, store, next, action, queue, command, props) {
  var count = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;


  var buffer = queue.buffer;
  switch (command) {
    case 'pop-undo':
    case 'pop-cancel':
      for (var i = 0; i < count; i++) {
        buffer.pop();
      }break;

    case 'shift-undo':
    case 'shift-cancel':
      for (var _i = 0; _i < count; _i++) {
        buffer.shift();
      }break;

    case 'pop':
    case 'pop-do':
    case 'pop-dispatch':
      for (var _i2 = 0; _i2 < count; _i2++) {
        var _action = buffer.pop();
        if (_action) store.dispatch(_action);
      }
      break;

    case 'shift':
    case 'shift-do':
    case 'shift-dispatch':
      for (var _i3 = 0; _i3 < count; _i3++) {
        var _action2 = buffer.shift();
        if (_action2) store.dispatch(_action2);
      }
      break;

    case 'push':
      buffer.push(action);
      break;

    case 'unshift':
      buffer.unshift(action);
      break;

    case 'do-all':
    case 'dispatch-all':
      var length = buffer.length;
      for (var _i4 = 0; _i4 < length; _i4++) {
        var _action3 = buffer.pop();
        if (_action3) store.dispatch(_action3);
      }
      break;

    case 'cancel-all':
    case 'undo-all':
      // dispatch the buffered action
      queue.buffer = [];
      break;
  }

  // return the queue that must be saved
  return queue;
};