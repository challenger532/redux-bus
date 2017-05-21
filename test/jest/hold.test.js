import undo from '../../lib/presets/undo/index'


test(
  'test empty buffer',
  () => {
    expect(
      undo({}, {}, () => {}, {}, {buffer: []}, 'push')
    ).toBe(
      {buffer: [{test:'hi'}]}
    )
  }
)
