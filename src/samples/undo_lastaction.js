export default (store, next, action, queue, meta) => {
  let temp
  switch (meta.action) {
    case 'UNDO':
      queue.buffer.pop()
      break;
    case 'PUSH':
      // save new action, if any action is saved it will be ignored
      queue.buffer.push(action)
      break;
    case 'DO':
      // dispatch the buffered action
      temp = queue.buffer.shift()
      if(temp) next(temp)
    case 'DO_PUSH':
      // save new action
      temp = queue.buffer.shift()
      if(temp) next(temp)
      queue.buffer.push(action)
  }

  // in this example the buffer should contains only one item
  // if you pushed an action before doing the existing one, it will be ignored
  if (queue.buffer.length > 1) queue.buffer.shift()

  // return the queue that must be saved
  return queue
}
