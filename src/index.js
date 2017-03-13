export {default as createBus} from './middleware'
export {default as reducer} from './reducer'
export {default as undoLastAction} from './presets/undoLastAction'
export {default as holdActions} from './presets/holdActions'
export {default as network} from './presets/network'
export default {
  reducer: exports.reducer,
  createBus: exports.createBus,
  holdActions: exports.holdActions,
  undoLastAction: exports.undoLastAction,
  network: exports.network,
}
