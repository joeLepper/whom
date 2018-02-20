const PropTypes = require('prop-types')
const Guid = require('guid')

// The guid validator checks the length of the prop since the guid format is consistent.
// I can't think of a situation where we're trying to pass through a incorrect prop
// that's a string of 36 characters.

function chainedGuidChecker(isRequired) {
  return function(props, propName, componentName) {
    const guid = props[propName] || ''

    if (!guid && isRequired) {
      return new Error(
        `${propName} was empty. This is a required prop for ${componentName}`,
      )
    } else if (!Guid.isGuid(guid)) {
      return new Error(
        `${props[propName]} supplied to ${componentName}, expected a guid.`,
      )
    }
  }
}

const guid = chainedGuidChecker(false)
guid.isRequired = chainedGuidChecker(true)

// Node appears as a prop in most of the components. I believe this is created by
// d3 and is not a ReactNode, so it needs a custom PropType
const node = {
  children: PropTypes.array,
  data: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  id: guid.isRequired,
  parent: PropTypes.object,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
}

module.exports = {
  guid,
  node,
}
