module.exports = function ({ person }) {
  return {
    buttonDelete: require('./button-delete')(person),
    editChange: require('./edit-change')(person),
    linkAdd: require('./link-add')(person),
    messageAdd: require('./message-add')(person),
    messageDelete: require('./message-delete')(person),
  }
}
