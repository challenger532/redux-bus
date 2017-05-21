### Create your handler
-**queue**: is the queue of the current handler

-**bus**: is the object that dispatched within the action.

```js
// your-magic-handler.js
export default (store, next, action, queue, bus) => {
   // here you can write your logic,
   // see the examples below for more clarification
   // return the queue that must be saved
   return queue
}
```

### Create Middleware
```js
import {createBus} from 'redux-bus'
import yourHandler from './path.to.yourHandler'

let handlers = {
  // the name of the handler to be used later in action.bus
  // example: let's say instead of sending http request
  //          every time user click increment button,
  //          we save the action in a queue, and we send one
  //          http request for every five clicks.

  remoteIncrement: yourHandler,
}

// creating the bus middleware
const busMiddleware = createBus(handlers)

// add the middleware alongside the rest of your middleware
const middlewares = applyMiddleware([..., busMiddleware, ...])
```

