const d3 = require('d3-hierarchy')
const Guid = require('guid')

class StoryManager {
  constructor({ storyRecord, storyId, onSave }) {
    this.storyRecord = storyRecord
    this.storyId = storyId
    this.stratifier = d3.stratify().parentId((d) => {
      const parents = this.storyRecord.filter(
        (node) =>
          node.children && node.children.some((child) => child === d.id),
      )
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
    this.save = onSave

    this.update()
  }
  parseAdditionalLinks() {
    this.data.additionalLinks = this.storyRecord
      .filter(({ type }) => type === 'link')
      .map(({ childId, parentId, optionText }) => {
        const source = this.data.nodes.find((node) => {
          return node.data.id === parentId
        })
        const target = this.data.nodes.find((node) => {
          return node.data.id === childId
        })
        const result = { source, target, optionText }
        return result
      })
  }
  parseNaturalLinks() {
    this.data.links = this.tree(this.dimensions).links()
  }
  tree() {
    const layout = d3.tree().size([this.dimensions.w, this.dimensions.h])
    const stratified = this.stratifier(
      this.storyRecord.filter(({ type }) => type === 'node'),
    )
    return layout(stratified)
  }
  parseNodes() {
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
  update() {
    this.dimensions = {
      w: window.innerWidth,
      h: window.innerHeight,
    }
    this.parseNodes()
    this.parseNaturalLinks()
    this.parseAdditionalLinks()
  }
  buttonAdd(newNodeId, currentNodeId) {
    this.storyRecord.forEach((node, i) => {
      if (currentNodeId === node.id) {
        node.children.push(newNodeId)
        this.storyRecord[i] = node
      }
    })
    this.storyRecord.push({
      optionText: 'fresh button',
      id: newNodeId,
      fontSize: 32,
      messages: ['fresh page'],
      children: [],
      type: 'node',
    })
    this.save(this.storyId, this.storyRecord)
  }
  buttonChange(nodeId, optionText) {
    this.storyRecord.forEach((node, i) => {
      if (nodeId === node.id) {
        node.optionText = optionText
        this.storyRecord[i] = node
      }
    })
    this.save(this.storyId, this.storyRecord)
  }
  buttonDelete(nodeId) {
    let deleteIndex
    this.storyRecord.forEach((node, i) => {
      if (nodeId === node.id) deleteIndex = i
    })
    this.storyRecord.splice(deleteIndex, 1)
    this.save(this.storyId, this.storyRecord)
  }
  linkAdd(parentId, childId) {
    this.storyRecord.push({
      type: 'link',
      id: Guid.raw(),
      title: 'adoption',
      optionText: 'fresh adoption',
      parentId,
      childId,
    })
    this.save(this.storyId, this.storyRecord)
  }
  messageAdd(nodeId) {
    this.storyRecord.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages.push('fresh message')
        this.storyRecord[i] = node
      }
    })
  }
  messageChange(nodeId, messageIndex, message) {
    this.storyRecord.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages[messageIndex] = message
        this.storyRecord[i] = node
      }
    })
    this.save(this.storyId, this.storyRecord)
  }
  messageDelete(nodeId, messageIndex) {
    this.storyRecord.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages = node.messages.filter((_, i) => i !== messageIndex)
        this.storyRecord[i] = node
      }
    })
  }
}

module.exports = StoryManager
