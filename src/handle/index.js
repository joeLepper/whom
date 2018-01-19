module.exports = function ({ person }) {
  return {
    buttonAdd: require('./button-add')(person),
    buttonChange: require('./button-change')(person),
    buttonDelete: require('./button-delete')(person),
    editChange: require('./edit-change')(person),
    linkAdd: require('./link-add')(person),
    messageAdd: require('./message-add')(person),
    messageChange: require('./message-change')(person),
    messageDelete: require('./message-delete')(person),
    resize: require('./resize'),
  }
}
