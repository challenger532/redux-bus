export default (options, store, next, action, queue, command, props) => {

  // life time of any action is 5 minutes
  let ms = 1000
  let timeout = 5 * 60 * 60 * ms

  if (typeof options.timeout == 'number')
    timeout = options.timeout * ms

  if (props && typeof props.timeout == 'number')
    timeout = props.timeout * ms

  let now = new Date().getTime()

  let buffer = queue.buffer

  if (!queue.mode) queue.mode = (options.mode || 'online')

  switch (command) {
    case 'go-offline':
      queue.mode = 'offline'
      break;
    case 'go-online':
      queue.mode = 'online'
    case 'update-all':
      let length = buffer.length
      for (let i=0; i < length; i++) {
        let cachedAction = buffer.pop()
        let {timeout, action} = cachedAction
        if (timeout > now)
          store.dispatch(action)
      }
      break;

    case 'cancel-all':
      queue.buffer = []
      break;
    case 'save':
      if (queue.mode == 'offline')
        buffer.push({
          timeout: now + timeout,
          action,
        })
      else if (queue.mode == 'online'){
        next(action)
      }
  }


  // return the queue that must be saved
  return queue
}
