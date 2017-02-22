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

### Create your handler
```js
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
  any_name: your_handler, // the name of the handler to be used later in action.meta
  ...// here you can use any sample check ()
}
// creating the bus middleware
const busMiddleware = createBus(handlers)
     
// add the middleware
const middlewares = applyMiddleware([...,busMiddleware,...])
```

### Dispatch Actions
```js
let action = {
  type:'any_type', // you can use any action type, this type will be useful before the handler dispatch the action again.
  payload:
    {
      ... , // any data
      meta:{
        handler:'any_name', // the name of the handler
        action:'DO'
      }
    }
}
dispatch(action)
```



## Use existing handlers
### Add the handlers
```js
import {undoLastaction, holdActions, createBus} from 'redux-bus' 

let handlers = {
  any_name: your_handler,
  undo: undoLastaction,
  hold:  holdActions,
}
...
```
### Use the *undoLastaction* handler
In this handler only one action is buffered, if new action pushed without doing the existing action, it will be ignored,
four meta actions can be used:

1-**PUSH**

2-**UNDO**

3-**DO**

4-**DO_PUSH**

```js
// to PUSH new action
// if an action existed in the buffer it will be removed as if clicking indo
let action = {
  type:'any_type', // you can use any action type,
  payload:
    {
      ... ,// any data here
      meta:{
        handler:'undo',
        action:'PUSH'
      }
    }
}
dispatch(action)

// to UNDO the last buffered action
// if an action existed in the buffer it will be removed
let action = {
  type:'any_type', // you can use any action type,
  payload:
    {
      ... ,// any data here
      meta:{
        handler:'undo',
        action:'UNDO'
      }
    }
}
dispatch(action)

// to DO the last buffered action
// if an action existed in the buffer it will be removed
let action = {
  type:'any_type', // you can use any action type,
  payload:
    {
      meta:{
        handler:'undo',
        action:'DO'
      }
    }
}
dispatch(action)

// to DO the last buffered action and PUSH  new one
let action = {
  type:'any_type', // you can use any action type,
  payload:
    {
      ... , // any data
      meta:{
        handler:'undo',
        action:'DO_PUSH'
      }
    }
}
dispatch(action)

```
### Use the *holdActions* handler
In this handler any actoin can't be dispatched alone, it holds the actions until more than four actions in the buffer, then four actions are dispatched at once
three meta actions can be used:

1-**PUSHH**

2-**CLEAR**

3-**POP_AlL**

```js
// to PUSH new action
let action = {
  type:'any_type', // you can use any action type,
  payload:
    {
      ... ,// any data here
      meta:{
        handler:'hold',
        action:'PUSH'
      }
    }
}
dispatch(action)

// to UNDO or CLEAR all the buffered actions
let action = {
  type:'any_type', // you can use any action type,
  payload:
    {
      ... ,// any data here
      meta:{
        handler:'hold',
        action:'CLEAR'
      }
    }
}
dispatch(action)

// to DO or DISPATCH all the buffered actions, must be four or less.
let action = {
  type:'any_type', // you can use any action type,
  payload:
    {
      meta:{
        handler:'hold',
        action:'POP_ALL'
      }
    }
}
dispatch(action)
```
### TODO
- [x] create one size action handler, that can undo last dispatched action
- [ ] create pre defined handler for saving offline dispatched actions
- [ ] create pre defined handler for delaying actions for specific period
- [ ] add some docs about usage with redux-ack
- [ ] create action generator that simplify the module

### Examples

* [Hold soome actions](https://github.com/challenger532/redux-bus/blob/master/src/samples/hold_actions.js) ([source](https://github.com/challenger532/redux-bus/blob/master/src/samples/hold_actions.js))
* [Undo or confirm last action ](https://github.com/challenger532/redux-bus/blob/master/src/samples/undo_lastaction.js) ([source](https://github.com/challenger532/redux-bus/blob/master/src/samples/undo_lastaction.js))


### Thanks

* [James](https://github.com/aretecode) for the great support
