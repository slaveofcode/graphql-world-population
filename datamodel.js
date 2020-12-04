const LowDB = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const countries = [
  {
    code: 'id',
    name: 'Indonesia'
  },
  {
    code: 'sg',
    name: 'Singapore'
  },
  {
    code: 'my',
    name: 'Malaysia'
  },
  {
    code: 'ph',
    name: 'Phillipine'
  },
  {
    code: 'usa',
    name: 'United States'
  }
]

const dbs = {}

for (const c of countries) {
  const adapter = new FileSync(`./db/world_populations/${c.code}.json`)
  dbs[c.code.toUpperCase()] = LowDB(adapter).read()
}

module.exports = {
  dbs,
  countries
}