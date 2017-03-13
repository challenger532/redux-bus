export default (store, next, action, queue=[], meta) => {

  let state = queue.shift()
  if (!state) state = {network: 'online'}

  let temp
  switch (meta.action) {
    case 'save':
      if (state.network == 'offline')
        queue.push(action)
      else if(state.network == 'online')
        next(action)
      break;

    case 'cancel-all':
      queue.buffer = []
      break
    case 'go-online':
      state.network = 'offline'
      while (queue.buffer.length > 0) {
        next(queue.buffer.shift())
      }
      break
    case 'go-offline':
      state.network = 'offline'
      break
  }


  queue.unshift(state)
  return queue
}
