import is from 'izz'

export default busses => {
  if (!busses) return

  if (is.string(busses)) {
    let bussesArray = toArray(busses)
    if (is.empty(bussesArray)) return
    return bussesArray
  }

  if (is.array(busses)) {
    if (is.empty(busses)) return
    return busses
  }

  if (is.object(busses)) {
    if (is.empty(busses)) return
    return [busses]
  }
}

function toArray(bussesString) {
  let bussesStringArray = bussesString.trim().split('|')
  return bussesStringArray.reduce((result, busString) => {
    let busObject = toBusObject(busString)
    if (busObject) result.push(busObject)
    return result
  }, [])
}

function toBusObject(busString) {
  busString = busString.trim()
  if (!busString.length) return

  let busContent = busString.match(/\S+/g)
  let busObject = {}

  let handler = busContent.shift()
  if (handler) busObject.handler = handler

  let command = busContent.shift()
  if (command) busObject.command = command

  let {props, params} = retrieveAdditions(busContent)

  if (props && is.not.empty(props))
    busObject.props = props

  if (params && is.not.empty(params))
    busObject.params = params

  if (is.empty(busObject)) return

  return busObject
}

function retrieveAdditions(additions) {
  return additions.reduce((result, addition) => {
    if (is.string(addition) && addition.indexOf(':') > 0) {
      let [key, value] = addition.split(':')
      result.props[key] = JSON.parse(value)
    } else {
      result.params.push(JSON.parse(addition))
    }
    return result
  }, {
    props: {},
    params: [],
  })
}
