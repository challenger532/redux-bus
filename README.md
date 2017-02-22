# Redux Bus
## A middleware for redux that makes it easy to create buffers with handlers, every buffer has one handler, one potential use case for this is undoing actions.


[![npm version](https://img.shields.io/npm/v/redux-bus.svg?style=flat-square)](https://www.npmjs.com/package/redux-bus)
[![npm version](https://img.shields.io/npm/v/redux-bus.svg?style=flat-square)](https://www.npmjs.com/package/redux-bus)
[![npm downloads](https://img.shields.io/npm/dm/redux-bus.svg?style=flat-square)](https://www.npmjs.com/package/redux-bus)

### Installation

To install the stable version:

```
npm install --save redux-bus
```
or
```
npm  i -S redux-bus
```
### Usage
```js
// include the reducer while creating the store:
import {reducer as bus} from 'redux-bus'
const reducerss  = combineReducers({
     ..
     ..
     bus,
   }, ...)```

// apply this middleware, undoLaastaction and holdActions are just predefined samples, use can create you custome:
import {undoLastaction, holdActions, createBus} from 'redux-bus' 
let handlersMiddleware = {
      undo: undoLastaction,
      hold: holdActions,
     }
const middlewares = applyMiddleware([...,handlersMiddleware,...])
const reducerss  = combineReducers({
     ..
     ..
     bus,
   }, ..., middleware)``     
// to create custome your custome handler:
### Documentation

* [Introduction]
* [Basics]

### Introducation

### Basics

### Examples

* [Hold soome actions](https://github.com/challenger532/redux-bus/blob/master/src/samples/hold_actions.js) ([source](https://github.com/challenger532/redux-bus/blob/master/src/samples/hold_actions.js))
* [Undo or confirm last action ](https://github.com/challenger532/redux-bus/blob/master/src/samples/undo_lastaction.js) ([source](https://github.com/challenger532/redux-bus/blob/master/src/samples/undo_lastaction.js))


### Thanks

* [James](https://github.com/aretecode) for a great support
