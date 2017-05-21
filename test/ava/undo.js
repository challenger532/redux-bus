import undo from '../../lib/presets/undo/index'
import test from 'ava'

test('undo:1:', t => {
  () => {
    t.deepEqual(
      undo(
        {},
        {},
        () => {},
        {},
        {buffer: []}, 'push'),
      {buffer: [{test:'hi'}]})
  }
})

test('undo:2:', t => {
  () => {
    t.deepEqual(
      undo(
        {},
        {},
        () => {},
        {},
        {
          buffer: [],
        },//
        'push')
      ,
      {
        buffer:
        [
          {
            test: 'hi',
          }
        ]
      }
    )
  }
})
