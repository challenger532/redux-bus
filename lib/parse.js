'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _izz = require('izz');

var _izz2 = _interopRequireDefault(_izz);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (busses) {
  if (!busses) return;

  if (_izz2.default.string(busses)) {
    var bussesArray = toArray(busses);
    if (_izz2.default.empty(bussesArray)) return;
    return bussesArray;
  }

  if (_izz2.default.array(busses)) {
    if (_izz2.default.empty(busses)) return;
    return busses;
  }

  if (_izz2.default.object(busses)) {
    if (_izz2.default.empty(busses)) return;
    return [busses];
  }
};

function toArray(bussesString) {
  var bussesStringArray = bussesString.trim().split('|');
  return bussesStringArray.reduce(function (result, busString) {
    var busObject = toBusObject(busString);
    if (busObject) result.push(busObject);
    return result;
  }, []);
}

function toBusObject(busString) {
  busString = busString.trim();
  if (!busString.length) return;

  var busContent = busString.match(/\S+/g);
  var busObject = {};

  var handler = busContent.shift();
  if (handler) busObject.handler = handler;

  var command = busContent.shift();
  if (command) busObject.command = command;

  var _retrieveAdditions = retrieveAdditions(busContent),
      props = _retrieveAdditions.props,
      params = _retrieveAdditions.params;

  if (props && _izz2.default.not.empty(props)) busObject.props = props;

  if (params && _izz2.default.not.empty(params)) busObject.params = params;

  if (_izz2.default.empty(busObject)) return;

  return busObject;
}

function retrieveAdditions(additions) {
  return additions.reduce(function (result, addition) {
    if (_izz2.default.string(addition) && addition.indexOf(':') > 0) {
      var _addition$split = addition.split(':'),
          _addition$split2 = _slicedToArray(_addition$split, 2),
          key = _addition$split2[0],
          value = _addition$split2[1];

      result.props[key] = JSON.parse(value);
    } else {
      result.params.push(JSON.parse(addition));
    }
    return result;
  }, {
    props: {},
    params: []
  });
}