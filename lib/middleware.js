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