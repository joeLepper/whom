const d3 = require('d3-hierarchy')
const Guid = require('guid')
const route = require('../route')
const { ipcRenderer } = require('electron')

class Person {
  constructor ({ personId, ee, baseZoom }) {
    const { update, read } = route(ee)
    this.route = { update, read }

    this.personId = personId
    this.baseZoom = baseZoom

    this.stratifier = d3.stratify().parentId((d) => {
      const parents = this.person.filter((node) => (
        node.children && node.children.some((child) => child === d.id)
      ))
      const parent = parents[0]
      if (parent) return parent.id
      return undefined
    })
    this.additionalLinks = this.additionalLinks.bind(this)
    this.naturalLinks = this.naturalLinks.bind(this)
    this.tree = this.tree.bind(this)
    this.parseNodes = this.parseNodes.bind(this)
    this.update = this.update.bind(this)
    this.buttonAdd = this.buttonAdd.bind(this)
    this.buttonChange = this.buttonChange.bind(this)
    this.buttonDelete = this.buttonDelete.bind(this)
    this.linkAdd = this.linkAdd.bind(this)
    this.messageAdd = this.messageAdd.bind(this)
    this.messageChange = this.messageChange.bind(this)
    this.messageDelete = this.messageDelete.bind(this)
    this.editChange = this.editChange.bind(this)
  }
  get nodes () {
    return this.person.filter(({ type }) => type === 'node')
  }
  additionalLinks ({ w, h }) {
    const { nodes } = this.parseNodes({ w, h })
    return this.person.filter(({ type }) => {
      return type === 'link'
    }).map(({ childId, parentId, optionText }) => {
      const source = nodes.filter((node) => node.data.id === parentId)[0]
      const target = nodes.filter((node) => node.data.id === childId)[0]
      const result = { source, target, optionText }
      return result
    })
  }
  naturalLinks ({ w, h }) {
    return this.tree({ w, h }).links()
  }
  tree ({ w, h }) {
    const layout = d3.tree().size([w, h])
    return layout(this.stratifier(this.nodes))
  }
  parseNodes ({ w, h, selectedId }) {
    const nodes = []
    let maxZoomX = 0
    let maxZoomY = 0
    let selected = null
    const tree = this.tree({ w, h })
    tree.each((node) => {
      maxZoomX = Math.max(node.height, maxZoomX)
      maxZoomY = Math.max(node.depth, maxZoomY)
      if (selectedId === node.data.id) {
        selected = node
        selectedId = node.data.id
      }
      nodes.push(node)
    })
    if (selected === null) {
      selected = nodes.filter(({ parent }) => (
        parent === null
      ))[0]
      selectedId = selected.data.id
    }
    return {
      nodes,
      selected,
      selectedId,
      maxZoomY,
      maxZoomX
    }
  }
  update ({ selectedId, zoom }, updatePath = true) {
    const newState = {
      zoom,
      w: window.innerWidth,
      h: window.innerHeight,
      maxZoomX: 0,
      maxZoomY: 0,
    }
    if (!newState.zoom || newState.zoom.x === undefined) newState.zoom = { x: this.baseZoom, y: this.baseZoom }

    const parsedNodes = this.parseNodes({
      w: newState.w,
      h: newState.h,
      selectedId,
    })
    if (updatePath) this.route.update(this.personId, parsedNodes.selectedId, '')
    newState.nodes = parsedNodes.nodes
    newState.selected = parsedNodes.selected
    newState.selectedId = parsedNodes.selectedId
    newState.maxZoomY = parsedNodes.maxZoomY
    newState.maxZoomX = parsedNodes.maxZoomX
    newState.links = this.naturalLinks({ w: newState.w, h: newState.h })
    newState.additionalLinks = this.additionalLinks({ w: newState.w, h: newState.h })
    return newState
  }
  buttonAdd (newNodeId, currentNodeId) {
    this.person.forEach((node, i) => {
      if (currentNodeId === node.id) {
        node.children.push(newNodeId)
        this.person[i] = node
      }
    })
    this.person.push({
      optionText: 'fresh button',
      id: newNodeId,
      fontSize: 32,
      messages: ['fresh page'],
      children: [],
      type: 'node',
    })
  }
  buttonChange (nodeId, optionText) {
    console.log('===============', nodeId)
    this.person.forEach((node, i) => {
      if (nodeId === node.id) {
        node.optionText = optionText
        this.person[i] = node
      }
    })
  }
  buttonDelete (nodeId) {
    let deleteIndex
    this.person.forEach((node, i) => {
      if (nodeId === node.id) deleteIndex = i
    })
    this.person.splice(deleteIndex, 1)
  }
  linkAdd (parentId, childId) {
    this.person.push({
      type: 'link',
      id: Guid.raw(),
      title: 'adoption',
      optionText: 'fresh adoption',
      parentId,
      childId,
    })
  }
  messageAdd (nodeId) {
    this.person.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages.push('fresh message')
        this.person[i] = node
      }
    })
  }
  messageChange (nodeId, messageIndex, message) {
    this.person.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages[messageIndex] = message
        this.person[i] = node
      }
    })
  }
  messageDelete () {
    this.person.forEach((node, i) => {
      if (nodeId === node.id) {
        node.messages = node.messages.filter((_, i) => i !== messageIndex)
        this.person[i] = node
      }
    })
  }
  editChange (newEditingState) {
    if (!newEditingState) this.save()
  }
  load (cb) {
    ipcRenderer.on('person--load:reply', (_, person) => {
      console.log('----')
      this.person = JSON.parse(person)
      cb(this.person)
    })
    ipcRenderer.send('person--load', this.personId)
  }
  save () {
    ipcRenderer.on('person--save:reply', (_, status) => console.log(status))
    ipcRenderer.send('person--save', this.person)
  }
}

module.exports = Person
