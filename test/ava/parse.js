import test from 'ava'
import parse from '../../lib/parse'


let networkBus = [{
  handler: 'network',
  command: 'push',
}]

let networkPropsBus = [{
  handler: 'network',
  command: 'push',
  props: {
    timeout: 4,
  },
}]

let networkParamsBus = [{
  handler: 'network',
  command: 'push',
  params: [4],
}]

let holdBus = [{
  handler: 'hold',
  command: 'popall',
}]

let doubleBus = [...networkBus, ...holdBus]

test('simple parse', t => {
  t.deepEqual(parse('network push'), networkBus)
  t.deepEqual(parse('network push'), networkBus)
  t.deepEqual(parse('network push   '), networkBus)
  t.notDeepEqual(parse('network1 push '), networkBus)
})

test('double parse', t => {
  t.deepEqual(parse('network push | hold popall'), doubleBus)
  t.deepEqual(parse('network push || hold popall'), doubleBus)
})

test('double parse with props', t => {
  t.deepEqual(parse('network push timeout:4'), networkPropsBus)
})

test('double parse with params', t => {
  t.deepEqual(parse('network push 4'), networkParamsBus )
})

test('parse with empty bus', t => {
  t.deepEqual(parse('network push '), networkBus )
})

test('parse with empty object', t => {
  t.deepEqual(parse({}), undefined )
})

test('parse with array with empty', t => {
  t.deepEqual(parse([{}]), [{}] )
})

test('parse with object to array', t => {
  t.deepEqual(parse({handler: 'test'}), [{handler: 'test'}] )
})

test('parse with object to array', t => {
  t.deepEqual(parse([{handler: 'test'}]), [{handler: 'test'}] )
})

