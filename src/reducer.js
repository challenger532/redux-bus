export default (state = {}, action) => {
  switch (action.type) {
    case '@@bus/UPDATE_QUEUE': {
      return updateQueue(state, action)
    }
    default: return state
  }
}

function updateQueue(bus = {}, {payload: {queue, handler}}) {
  return {
    ...bus,
    [handler]: queue,
  }
}
