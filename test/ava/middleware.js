import test from 'ava'
import middlewareFactory from '../../lib/middleware'

test('middlware', t => {

  let middleware = middlewareFactory(
    // options...
    {
      network: {
        timeout: 4,
      }
    },

    // custome handlers...
    {
      network: (options, store, next, action) => {
        t.deepEqual(options, {timeout:4})
        t.notDeepEqual(store, {})
        t.deepEqual(store.getState(), {name: 'wassim'})
        t.deepEqual(action, {
          type: 'increment',
          bus: [{
            handler: 'hold',
            command: 'push'
          }]
        })
        next(action)
      }
    })

  let store = {
    getState: () => ({
      name: 'wassim',
    }),

    dispatch: (action) => {
      t.deepEqual(action.type, 'increment')
      t.notDeepEqual(action.bus, undefined)
    }
  }

  let action = {
    type: 'increment',
    bus: 'network push | hold push'
  }

  let next = store.dispatch

  let result = middleware(store)(next)(action)
})
