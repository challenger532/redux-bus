export default (state = {}, action) => {
  switch (action.type) {
    case '@@bus/UPDATE_QUEUE': {
      return updateQueue(state, action)
    }
    default: return state
  }
}

function updateQueue(state = {}, {payload: {queue, handler}}) {
  return {
    ...state,
    [handler]: queue,
  }
}
