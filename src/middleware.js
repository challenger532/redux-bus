export default middlewares => store => next => action => {
  // location of handlers may change later..
  if (!action.handler)
    return next(action)

  const {handler} = action

  let middleware = middlewares[handler]

  if (middleware) {
    // bus is not initialized, so it must be validated..
    let bus = store.getState().bus || {}

    // queue is an object
    // so it can has properties
    // other that just buffer
    // for future possible features..
    let queue = bus[handler] || {buffer: []}

    // the handler is attached and passed along
    // so we take it out of the action
    action = Object.assign({}, action)
    delete action.handler

    // this middleware will take a queue and must return a queue
    queue =  middleware(store, next, action, queue)

    // add validation that the return of the middleware is queue
    if (!queue.buffer && !queue.buffer.length) return

    // actions to update the buffer
    action = {
      type: 'UPDATE_QUEUE',
      payload: {
        queue,
        handler,
      },
    }
    store.dispatch(action)
  }
  return next(action)
}
