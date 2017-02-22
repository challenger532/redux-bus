const HOLD_COUNT = 4

export default (store, next, action, queue, meta) => {
  let temp
  switch (meta.action) {
    case 'PUSH':
      // push new action, if any action is saved it will be ignored
      queue.buffer.push(action)
      break
    case 'CLEAR':
      // remove all buffered actions
      queue.buffer = []
      break
    case 'POP_ALL':
      // do all the actions
      while (queue.buffer.length > 0) {
        next(queue.buffer.shift())
      }
      break
  }

  // in this example the buffer should contains only one item
  // if you pushed an action before doing the existing one, it will be ignored
  if (queue.buffer.length > HOLD_COUNT) {
    for(var i = 0; i < HOLD_COUNT; i++) {
      temp = queue.buffer.shift()
      if(temp) next(temp)
    }
  }

  // return the queue that must be saved
  return queue
}
