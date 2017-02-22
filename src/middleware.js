export default middlewares => store => next => action => {

  // getting meta from action
  let meta = action.meta
  // meta object can be in action itself or in payload, if action has meta, ignore that of the payload
  if (!meta) {
    if (action.payload && action.payload.meta) {
      meta = action.payload.meta
    }
  }

  // ignore normal actions with no meta
  if (!meta)
    return next(action)

  const {handler} = meta

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
    queue =  middleware(store, next, action, queue, meta)

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
