const { dbs } = require('../datamodel')


module.exports = (code) => {
  if (!code) {
    return null
  }

  const db = dbs[code.toUpperCase()]

  if (!db) {
    return null
  }

  return {
    info: db.get('info').value(),
    data: db.get('data').value(),
  }
}