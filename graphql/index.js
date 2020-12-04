const {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLID,
} = require('graphql')
const getCountries = require('../usecases/get_countries')
const getCountryPopulations = require('../usecases/get_country_populations')
const getYearPopulations = require('../usecases/get_year_population')

const Indicator = new GraphQLObjectType({
  name: 'Indicator',
  fields:() => ({
    id: { type: GraphQLString },
    value: { type: GraphQLString }
  })
})

const Country = new GraphQLObjectType({
  name: 'Country',
  fields: () => ({
    id: { type: GraphQLString },
    value: { type: GraphQLString }
  })
})

const CountryInfo = new GraphQLObjectType({
  name: 'CountryInfo',
  fields: () => ({
    indicator: { type: Indicator },
    country: { type: Country },
    countryiso3code: { type: GraphQLString },
    date: { type: GraphQLString },
    value: { type: GraphQLInt },
    unit: { type: GraphQLString },
    obs_status: { type: GraphQLString },
    decimal: { type: GraphQLFloat },
  })
})

const PageInfo = new GraphQLObjectType({
  name: 'PageInfo',
  fields: () => ({
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    per_page: { type: GraphQLInt },
    total: { type: GraphQLInt },
    sourceid: { type: GraphQLString },
    lastupdated: { type: GraphQLString }
  })
})

const CountryResult = new GraphQLObjectType({
  name: "CountryResult",
  fields: () => ({
    info: { type: PageInfo },
    data: { type: new GraphQLList(CountryInfo) }
  })
})

const CountryItem = new GraphQLObjectType({
  name: 'CountryItem',
  fields: () => ({
    code: { type: GraphQLID },
    name: { type: GraphQLString },
  })
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      CountryList: {
        type: new GraphQLList(CountryItem),
        resolve: () => {
          return getCountries()
        }
      },
      CountryResult: {
        type: CountryResult,
        args: {
          code: { type: GraphQLString }
        },
        resolve: (source, args, context, info) => {
        console.log("source, args, context, info", source, args, context, info)
          if (args.code) {
            return getCountryPopulations(args.code)
          }
          return getCountryPopulations()
        }
      },
      YearPopulation: {
        type: new GraphQLList(CountryInfo),
        args: {
          code: { type: GraphQLString },
          year: { type: GraphQLString },
        },
        resolve: (_, { code, year }) => {
          if (code && year) {
            const { data } = getYearPopulations(code, year)
            return [data]
          }

          if (code) {
            const { data } = getCountryPopulations(code)
            const years = data.map(item => item.date)
            const allYearPopulations = []
            for (const y of years) {
              allYearPopulations.push(getYearPopulations(code, y).data)
            }
            return allYearPopulations
          }

          const countryCodes = getCountries().map(item => item.code)
          const allYearPopulations = []
          for (const cc of countryCodes) {
            if (year) {
              allYearPopulations.push(getYearPopulations(cc, year).data)
            } else {
              const { data: countryPopulations } = getCountryPopulations(cc)

              for (const item of countryPopulations) {
                allYearPopulations.push(getYearPopulations(cc, item.date).data)
              }
            }
          }

          return allYearPopulations
        }
      }
    }
  })
})

module.exports = schema