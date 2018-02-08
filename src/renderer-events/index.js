import { ipcMain } from 'electron'
import { readdir, readFile, writeFile, unlink } from 'fs'
import { join, basename } from 'path'

ipcMain.on('people--load', (event) => {
  const dir = join(__dirname, '..', 'people')
  readdir(dir, (err, people) => {
    const names = people.map((person) => {
      return basename(person).split('.json')[0]
    })
    event.sender.send('people--load:reply', names)
  })
})

ipcMain.on('person--load', (event, personId) => {
  const file = join(__dirname, '..', 'people', `${personId}.json`)
  readFile(file, 'utf8', (err, person) => {
    // console.log(JSON.stringify(person, null, 2))
    event.sender.send('person--load:reply', person)
  })
})

ipcMain.on('person--save', (event, personId, person) => {
  const file = join(__dirname, '..', 'people', `${personId}.json`)
  writeFile(file, person, 'utf8', (err) => {
    event.sender.send('person--save:reply', 'ok')
  })
})

ipcMain.on('person--delete', (event, personId, person) => {
  const file = join(__dirname, '..', 'people', `${personId}.json`)
  unlink(file, (err) => {
    if (err) event.sender.send('person--delete:reply', err)
    else event.sender.send('person--delete:reply', 'ok')
  })
})

ipcMain.on('person--create', (event, personId) => {
  const template = join(__dirname, '..', 'person', 'template.json')
  readFile(template, 'utf8', (err, person) => {
    const file = join(__dirname, '..', 'people', `${personId}.json`)
    writeFile(file, person, 'utf8', (err) => {
      event.sender.send('person--create:reply', person)
    })
  })
})
