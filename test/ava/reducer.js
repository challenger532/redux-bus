import test from 'ava'
import reducer from '../../lib/reducer'

test('reducer: ', t => {
  [



    [
      // name of function from ava
      'deepEqual',

      // state before
      {
        any: 'test',
        network: ['any data here'],
      },

      // action
      {
        type: '@@bus/UPDATE_QUEUE',
        payload: {
          queue: ['test'],
          handler: 'network'
        }
      },

      // state after to be returned
      {
        any: 'test',
        network:['test'],
      }
    ],




    [
      'notDeepEqual',
      {
        any: 'before',
        network: ['any data here'],
      },
      {
        type: '@@bus/UPDATE_QUEUE',
        payload: {
          queue: ['test'],
          handler: 'network'
        }
      },
      {
        any: 'any',
        network:['test'],
      }
    ],



    [
      'deepEqual',
      {
        any: 'test',
        hold: [],
        network: [],
      },
      {
        type: '@@bus/UPDATE_QUEUE',
        payload: {
          queue: ['hello', {}],
          handler: 'network'
        }
      },
      {
        any: 'test',
        hold: [],
        network:['hello', {}],
      }
    ],




  ]
    .forEach(([compare, state, actions, expected], i) => {
      t[compare](reducer(state,actions), expected)
    })
})
