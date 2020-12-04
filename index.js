const Express = require('express')
const { graphqlHTTP } = require('express-graphql')

const app = Express()

const getCountries = require('./usecases/get_countries')
const getCountryPopulations = require('./usecases/get_country_populations')
const getYearPopulation = require('./usecases/get_year_population')

app.get("/", (_, res) => {
  return res.json({ alive: true })
})

app.get("/countries", (_, res) => {
  return res.json(getCountries())
})

app.get("/countries/:code", (req, res) => {
  const { code } = req.params
  return res.json(getCountryPopulations(code))
})

app.get("/countries/:code/:year", (req, res) => {
  const { code, year } = req.params

  return res.json(getYearPopulation(code, year))
})

app.use('/', graphqlHTTP({
  schema: require('./graphql'),
  graphiql: process.env.NODE_ENV !== 'production'
}))

app.listen(7878, () => {
  console.log("server started at :7878")
})