import { ipcMain } from 'electron'
import { readdir, readFile, writeFile, unlink } from 'fs'
import { join, basename, extname } from 'path'

ipcMain.on('people--load', (event) => {
  const dir = join(__dirname, '..', 'people')
  readdir(dir, (err, people) => {
    const names = people.filter((person) => {
      return extname(person) === '.json'
    }).map((person) => {
      return basename(person, '.json')
    })
    event.sender.send('people--load:reply', names)
  })
})

ipcMain.on('person--load', (event, personId) => {
  const file = join(__dirname, '..', 'people', `${personId}.json`)
  readFile(file, 'utf8', (err, person) => {
    event.sender.send('person--load:reply', personId, person)
  })
})

ipcMain.on('person--save', (event, personId, person) => {
  const file = join(__dirname, '..', 'people', `${personId}.json`)
  writeFile(file, person, 'utf8', (err) => {
    event.sender.send('person--save:reply', personId, JSON.stringify(person, null, 2))
  })
})

ipcMain.on('person--delete', (event, personId, person) => {
  const file = join(__dirname, '..', 'people', `${personId}.json`)
  unlink(file, (err) => {
    if (err) event.sender.send('person--delete:reply', err)
    else event.sender.send('person--delete:reply', personId)
  })
})

ipcMain.on('person--create', (event, personId) => {
  const template = join(__dirname, '..', 'person', 'template.json')
  readFile(template, 'utf8', (err, person) => {
    const file = join(__dirname, '..', 'people', `${personId}.json`)
    writeFile(file, person, 'utf8', (err) => {
      event.sender.send('person--create:reply', personId, person)
    })
  })
})
