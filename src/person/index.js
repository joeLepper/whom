const d3 = require('d3-hierarchy')
const Guid = require('guid')
const { ipcRenderer } = require('electron')

class Person {
  constructor ({ person, id }) {
    this.raw = person
    this.id = id
    this.stratifier = d3.stratify().parentId((d) => {
      const parents = this.raw.filter((node) => (
        node.children && node.children.some((child) => child === d.id)
      ))
      const parent = parents[0]
      if (parent) return parent.id
      return undefined
    })

    this.data = {}

    // for creating the layout itself
    this.parseAdditionalLinks = this.parseAdditionalLinks.bind(this)
    this.parseNaturalLinks = this.parseNaturalLinks.bind(this)
    this.tree = this.tree.bind(this)
    this.parseNodes = this.parseNodes.bind(this)
    this.update = this.update.bind(this)

    // adding to the saved representation
    this.buttonAdd = this.buttonAdd.bind(this)
    this.buttonChange = this.buttonChange.bind(this)
    this.buttonDelete = this.buttonDelete.bind(this)
    this.linkAdd = this.linkAdd.bind(this)
    this.messageAdd = this.messageAdd.bind(this)
    this.messageChange = this.messageChange.bind(this)
    this.messageDelete = this.messageDelete.bind(this)
    this.save = this.save.bind(this)

    this.update()
  }
  parseAdditionalLinks () {
    this.data.additionalLinks = this.raw.filter(({ type }) => {
      return type === 'link'
    }).map(({ childId, parentId, optionText }) => {
      const source = this.data.nodes.filter((node) => node.data.id === parentId)[0]
      const target = this.data.nodes.filter((node) => node.data.id === childId)[0]
      const result = { source, target, optionText }
      return result
    })
  }
  parseNaturalLinks () {
    this.data.links = this.tree(this.dimensions).links()
  }
  tree () {
    const layout = d3.tree().size([this.dimensions.w, this.dimensions.h])
    return layout(this.stratifier(this.raw.filter(({ type }) => type === 'node')))
  }
  parseNodes () {
    const nodes = []
    let maxZoomX = 0
    let maxZoomY = 0

    const tree = this.tree()
    tree.each((node) => {
      maxZoomX = Math.max(node.height, maxZoomX)
      maxZoomY = Math.max(node.depth, maxZoomY)
      nodes.push(node)
    })

    this.data.nodes = nodes
    this.data.maxZoomX = maxZoomX
    this.data.maxZoomY = maxZoomY
  }
  update () {
    this.dimensions = {
      w: window.innerWidth,
      h: window.innerHeight
    }
    this.parseNodes()
    this.parseNaturalLinks()
    this.parseAdditionalLinks()
  }
  buttonAdd (newNodeId, currentNodeId) {
    this.raw.forEach((node, i) => {
      if (currentNodeId === node.id) {
        node.children.push(newNodeId)
        this.raw[i] = node
      }
    })
    this.raw.push({
      optionText: 'fresh button',
      id: newNodeId,
      fontSize: 32,
      messages: ['fresh page'],
      children: [],
      type: 'node',
    })
    this.save(this.id)
  }
  buttonChange (nodeId, optionText) {
    this.raw.forEach((node, i) => {
      if (nodeId === node.id) {
        node.optionText = optionText
        this.raw[i] = node
      }
    })
    this.save(this.id)
  }
  buttonDelete (nodeId) {
    let deleteIndex
    this.raw.forEach((node, i) => {
      if (nodeId === node.id) deleteIndex = i
    })
    this.raw.splice(deleteIndex, 1)
    this.save(this.id)
  }
  linkAdd (parentId, childId) {
    this.raw.push({
      type: 'link',
      id: Guid.raw(),
      title: 'adoption',
      optionText: 'fresh adoption',
      parentId,
      childId,
    })
  }
  messageAdd (nodeId) {
    this.raw.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages.push('fresh message')
        this.raw[i] = node
      }
    })
  }
  messageChange (nodeId, messageIndex, message) {
    this.raw.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages[messageIndex] = message
        this.raw[i] = node
      }
    })
    this.save(this.id)
  }
  messageDelete () {
    this.raw.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages = node.messages.filter((_, i) => i !== messageIndex)
        this.raw[i] = node
      }
    })
  }
  save (id) {
    ipcRenderer.send('person--save', id, JSON.stringify(this.raw, null, 2))
  }
}

module.exports = Person
