# Redux Bus
### A middleware for redux that makes it easy to create buffers with handlers, every buffer has one handler, one potential use case for this is undoing actions.


[![npm version](https://img.shields.io/npm/v/redux-bus.svg?style=flat-square)](https://www.npmjs.com/package/redux-bus)
[![npm version](https://img.shields.io/npm/v/redux-bus.svg?style=flat-square)](https://www.npmjs.com/package/redux-bus)
[![npm downloads](https://img.shields.io/npm/dm/redux-bus.svg?style=flat-square)](https://www.npmjs.com/package/redux-bus)

## Installation

To install the stable version:

```
npm install --save redux-bus
```
or
```
npm  i -S redux-bus
```


## Usage

### Reducer
```js
// include the reducer while creating the store:
import {reducer as bus} from 'redux-bus'
const reducerss  = combineReducers({
     ..
     ..
     bus,
   })
```

### Create custome handler
```
// your_custome_handler.js
export default (store, next, action, queue, meta) => {
   // store, next, action are self explanatory.
   // **queue**: is the queue of the current handler
   // **meta**: is the object that dispatched within the action.
   // here you can write your logic, see the exmples below for more clarification
   
   // return the queue that must be saved
   return queue
}
```

### Create Middleware
```js
import {createBus} from 'redux-bus' 
import your_handler from './your_handler'

let handlers = {
  any_name: your_handler,
  ...// here you can use any sample check ()
}
// creating the bus middleware
const busMiddleware = createBus(handlers)
     
// add the middleware
const middlewares = applyMiddleware([...,busMiddleware,...])
```

### Use existing bus
```js
import {undoLastaction, holdActions, createBus} from 'redux-bus' 

let handlers = {
  any_name: your_handler,
  undo: undoLastaction,
  hold:  holdActions,
}
...

```


### Examples

* [Hold soome actions](https://github.com/challenger532/redux-bus/blob/master/src/samples/hold_actions.js) ([source](https://github.com/challenger532/redux-bus/blob/master/src/samples/hold_actions.js))
* [Undo or confirm last action ](https://github.com/challenger532/redux-bus/blob/master/src/samples/undo_lastaction.js) ([source](https://github.com/challenger532/redux-bus/blob/master/src/samples/undo_lastaction.js))


### Thanks

* [James](https://github.com/aretecode) for the great support
