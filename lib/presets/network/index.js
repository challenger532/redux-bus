'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options, store, next, action, queue, command, props) {

  // life time of any action is 5 minutes
  var ms = 1000;
  var timeout = 5 * 60 * 60 * ms;

  if (typeof options.timeout == 'number') timeout = options.timeout * ms;

  if (props && typeof props.timeout == 'number') timeout = props.timeout * ms;

  var now = new Date().getTime();

  var buffer = queue.buffer;

  if (!queue.state) queue.state = options.state || 'online';

  switch (command) {
    case 'go-offline':
      queue.state = 'offline';
      break;
    case 'go-online':
      queue.state = 'online';
    case 'fetch':
      var length = buffer.length;
      for (var i = 0; i < length; i++) {
        var cachedAction = buffer.pop();
        var _timeout = cachedAction.timeout,
            _action = cachedAction.action;

        if (_timeout > now) store.dispatch(_action);
      }
      break;

    case 'cancel.all':
      queue.buffer = [];
      break;
    case 'save':
      if (queue.state == 'offline') buffer.push({
        timeout: now + timeout,
        action: action
      });else if (queue.state == 'online') {
        next(action);
      }
  }

  // return the queue that must be saved
  return queue;
};