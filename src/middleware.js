import is from 'izz'
import parse from './parse'
import handle from './handle'

import presets from './presets'

export default (options = {}, custom) => {

  // all handlers, the build-in and the custom...
  let handlers = {
    ...presets,
    ...custom,
  }

  return store => next => action => {
    // getting bus from action
    let busses = action.bus
    delete action.bus

    // bus object can be in action itself or in payload,
    // if action has .bus,
    // ignore that of the payload
    if (action.payload && action.payload.bus) {
      if (!busses) busses = action.payload.bus
      delete action.payload.bus
    }

    if (!busses) return next(action)

    return manageBusses(handlers, options, store, next, action, busses)
  }
}

function manageBusses(handlers, options, store, next, action, busses) {

  // ensure that busses is an array of objects ... [bus1, bus2,...]
  let parsedBusses = parse(busses)

  // if parsedBusses are not a real object.. no need to continue..
  if (!parsedBusses) return next(action)

  // getting the first bus that should be handeled here...
  let bus = parsedBusses.shift()

  // save the rest of bussess within the action for another calls
  if (parsedBusses.length) action.bus = parsedBusses

  return manage(handlers, options, store, next, action, bus)
}

function manage(handlers, options, store, next, action, bus) {

  // ensure that bus is an object with data inside...
  if (is.empty(bus) || is.not.object(bus)) return next(action)

  let {handler: handlerName, command, props, params = []} = bus

  // getting the target handler function...
  let handler = handlers[handlerName]

  // ensure that handler is a function...
  if (is.not.function(handler)) return next(action)

  let handlerOptions

  if (options && is.json(options))
    handlerOptions = options[handlerName] || {}

  // getting store's state
  let state = store.getState() || {}

  // getting all bus queues from store..
  let busQueues = state.bus || {}

  // getting the target queue of the current handler...
  let handlerQueue = busQueues[handlerName] || {
      buffer: [],
    }

  if (!handlerQueue.buffer) handlerQueue.buffer = []
  // call the handler with all the specific data,
  // get the updated queue to be saved in the state..
  let newHanderQueue = handler(handlerOptions, store, next, action, handlerQueue, command, props, ...params)

  // if the handler did not return a queue, ignore it
  if (!newHanderQueue) return

  // dispatch this action with the new queue..
  let busAction = {
    type: '@@bus/UPDATE_QUEUE',
    payload: {
      handler: handlerName,
      queue: newHanderQueue,
    }
  }
  store.dispatch(busAction)
}
