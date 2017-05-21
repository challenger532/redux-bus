export default (options, store, next, action, queue, command, props, count = 1) => {

  let buffer = queue.buffer
  switch (command) {
    case 'pop-undo':
    case 'pop-cancel':
      for (let i=0; i < count; i++) buffer.pop()
      break;

    case 'shift-undo':
    case 'shift-cancel':
      for (let i=0; i < count; i++) buffer.shift()
      break;

    case 'pop':
    case 'pop-do':
    case 'pop-dispatch':
      for (let i=0; i < count; i++) {
        let action = buffer.pop()
        if (action) store.dispatch(action)
      }
      break;

    case 'shift':
    case 'shift-do':
    case 'shift-dispatch':
      for (let i=0; i < count; i++) {
        let action = buffer.shift()
        if (action) store.dispatch(action)
      }
      break;

    case 'push':
      buffer.push(action)
      break;

    case 'unshift':
      buffer.unshift(action)
      break;

    case 'do-all':
    case 'dispatch-all':
      let length = buffer.length
      for (let i=0; i < length; i++) {
        let action = buffer.pop()
        if (action) store.dispatch(action)
      }
      break;

    case 'cancel-all':
    case 'undo-all':
      // dispatch the buffered action
      queue.buffer = []
      break;
  }


  // return the queue that must be saved
  return queue
}
