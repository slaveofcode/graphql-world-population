const { dbs } = require('../datamodel')

module.exports = (code, year) => {
  const db = dbs[code.toUpperCase()]

  if (!db) {
    return null
  }

  const data = db.get('data').find({ date: year }).value()

  return { data }
}