'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (handlers, options, store, next, action, current) {
  var name = current.handler;

  var handler = handlers[name];
  var handlerOptions = options[name];

  if (handler) {
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

    // this handler will take a queue and must return a queue
    queue = handler(handlerOptions, store, next, action, queue, current);

    // add validation that the return of the handler is queue
    if (!queue.buffer || !queue.buffer.length) return;

    // actions to update the buffer
    action = {
      type: '@@bus/UPDATE_QUEUE',
      payload: {
        queue: queue,
        handler: handler
      }
    };
    store.dispatch(action);
  } else next(action);
};