const store = require('../store')
const freshStory = require('./template.json')

const create = (id) => save(id, freshStory)
const load = (id) => store.get(id)
const save = (id, story) => store.put(id, story)
const destroy = (id) => store.del(id)

const list = () => {
  return new Promise((resolve, reject) => {
    const keys = []
    store
      .createKeyStream()
      .on('data', (key) => keys.push(key))
      .on('error', reject)
      .on('end', () => {
        resolve(keys)
      })
  })
}

Object.assign(exports, {
  create,
  destroy,
  list,
  load,
  save,
})
