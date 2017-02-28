# Redux Bus
[![NPM](https://nodei.co/npm/redux-bus.png?downloads=true)](https://nodei.co/npm/redux-bus/)

### Redux middleware that makes it easy to create buffers with handlers.


[![npm version](https://img.shields.io/npm/v/redux-bus.svg?style=flat-square)](https://www.npmjs.com/package/redux-bus)
[![npm version](https://img.shields.io/npm/v/redux-bus.svg?style=flat-square)](https://www.npmjs.com/package/redux-bus)
[![MIT License][license-image]][license-url] 
[![npm downloads](https://img.shields.io/npm/dm/redux-bus.svg?style=flat-square)](https://www.npmjs.com/package/redux-bus)


## [Index](#index)
* [What is Redux Bus?](#what-is-redux-bus)
* [Installation](#installation)
* [Usage](#usage)
  - [Reducer](#reducer)
  - [Create your handler](#create-your-handler)
  - [Create middleware](#create-middleware)
  - [Dispatch Actions](#dispatch-actions)
* [Presets](#presets)
  - [Add the handlers](#add-the-handler)
  - [Use the undoLastAction handler](#use-the-undolastaction-handler)
  - [Use the holdActions handler](#use-the-holdactions-handler)
 * [TODO](#todo)
 * [Examples](#examples)
 * [Resources](#resources)
 * [Thanks](#thanks)

## What is Redux Bus
redux middleware that allows using buffers for undoable actions, and potentially much more.

## Installation

To install the stable version:

```bash
npm install --save redux-bus
```


## Usage

### Reducer
```js
// include the reducer while creating the store:
import {reducer as bus} from 'redux-bus'
const reducers = combineReducers({
   ...
   ...
   bus,
 })
```

### Create your handler
-**queue**: is the queue of the current handler
-**meta**: is the object that dispatched within the action.

```js
// your-magic-handler.js
export default (store, next, action, queue, meta) => {
   // here you can write your logic,
   // see the examples below for more clarification
   // return the queue that must be saved
   return queue
}
```

### Create Middleware
```js
import {createBus} from 'redux-bus'
import yourHandler from './yourHandler'

let handlers = {
  // the name of the handler to be used later in action.meta
  // can be anything
  chooseYourOwnAdventure: yourHandler,
  // here you can use any sample check ()
  // ...
}

// creating the bus middleware
const busMiddleware = createBus(handlers)

// add the middleware alongside the rest of your middleware
const middlewares = applyMiddleware([..., busMiddleware, ...])
```

### Dispatch Actions

#### shorthand
```js
let action = {
  // @NOTE:
  // you can use any action type.
  type: 'chooseYourOwnAdventure',
  payload: {
    // ... any other data in your payload
    meta: 'anyHandlerName ACTION_NAME',
  },
}
dispatch(action)
```

#### longhand
```js
let action = {
  // @NOTE:
  // you can use any action type.
  meta: {
    // the name of the handler
    handler: 'chooseYourOwnAdventure',

    // @example: DO, UNDO, PUSH, POP, CANCEL_ALL
    action: 'ACTION_NAME',
  },
}
dispatch(action)

```

## Presets
### Add the handlers
```js
import {undoLastAction, holdActions, createBus} from 'redux-bus'

let handlers = {
  chooseYourOwnAdventure: yourHandlerHere,
  undo: undoLastAction,
  hold: holdActions,
}
```


### Use the *undoLastAction* handler
In this handler, only one action is buffered, if new action pushed without doing the existing action, it will be ignored,
four meta actions can be used:

1-**PUSH**

2-**UNDO**

3-**DO**

4-**DO_PUSH**

```js
// to PUSH a new action
// if an action already exists in the buffer, it will be removed, as if clicking undo
let action = {
  type: 'chooseYourOwnAdventure',
  payload: {
    meta: 'undo PUSH'
  }
  // @note: you can set the payload here, out of the payload.
  //        which is very useful when an action has no payload.
}
dispatch(action)

// to UNDO the last buffered action
// if an action existed in the buffer it will be removed
let action = {
  type: 'chooseYourOwnAdventure',
  meta: 'undo UNDO',
}
dispatch(action)

// to DO the last buffered action
// if an action existed in the buffer it will be removed
let action = {
  type: 'chooseYourOwnAdventure',
  meta: 'undo DO',
}
dispatch(action)

// to DO the last buffered action and PUSH new one
let action = {
  type: 'chooseYourOwnAdventure',
  payload: {
    // @NOTE: meta can be a child of an action
    meta: 'undo DO_PUSH',
  },
}
dispatch(action)

let action = {
  type: 'chooseYourOwnAdventure',
  payload: {
    meta: 'anyHandlerName DO'
  }
}
dispatch(action)
```


### Use the *holdActions* handler
In this handler, action can't be dispatched by themselves. Actions are held until more than four actions in the buffer. When there are more than four, all held actions are dispatched at once.

three meta actions can be used:

1-**PUSH**

2-**CLEAR**

3-**POP_ALL**

```js
// to PUSH new action
let action = {
  type: 'chooseYourOwnAdventure',
  payload: {
    meta: 'hold PUSH'
  },
}
dispatch(action)

// to UNDO or CLEAR all the buffered actions
let action = {
  type: 'chooseYourOwnAdventure',
  meta: 'hold CLEAR',
}
dispatch(action)

// to DO or DISPATCH all the buffered actions,
// must be four or less.
let action = {
  type: 'chooseYourOwnAdventure',
  meta: 'hold POP_ALL',
}
dispatch(action)
```

### TODO
- [x] create one size action handler, that can undo last dispatched action
- [ ] create pre defined handler for saving offline dispatched actions
- [ ] create pre defined handler for delaying actions for specific period
- [ ] add some docs about usage with redux-ack
- [ ] create action generator that simplify the module
- [ ] add tests

### Examples

* [Hold some actions](https://github.com/challenger532/redux-bus/blob/master/src/presets/holdActions.js) ([source](https://github.com/challenger532/redux-bus/blob/master/src/presets/holdActions.js))
* [Undo or confirm last action ](https://github.com/challenger532/redux-bus/blob/master/src/presets/undoLastAction.js) ([source](https://github.com/challenger532/redux-bus/blob/master/src/presets/undoLastAction.js))


### Resources
- http://redux.js.org/docs/advanced/Middleware.html
- https://medium.com/@meagle/understanding-87566abcfb7a
- https://github.com/gaearon/redux-thunk

### Thanks

* [James](https://github.com/aretecode) for the great support                                                                                        
