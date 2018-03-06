const level = require('level')
const { remote } = require('electron')
const { join } = require('path')

// get the system-specific user data directory
const userData = remote.app.getPath('userData')

// which we combine with our namespace
const dbPath = join(userData, 'whom')

// so that we can set up an instance of levelDB
module.exports = level(dbPath, { valueEncoding: 'json' })
