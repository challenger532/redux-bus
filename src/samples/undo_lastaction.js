export default (store, next, action, queue) => {
  if (queue.buffer.length > 0) {
    switch (action.type) {
      case 'UNDO':
        queue.buffer.pop()
      case 'DO':
        next(queue.buffer.shift())
      default:
        next(queue.buffer.shift())
    }
    return queue
  }
  // push the action to the buffer
  if (action) queue.buffer.push(action)

  // in this example the buffer should contains only one item
  if (queue.buffer.length > 1) queue.buffer.shift()

  // return the queue that must be saved
  return queue
}
