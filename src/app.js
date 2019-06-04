const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// console.log(__dirname)
// console.log(__filename)

// Define path for Express Config
const publicDirPath = path.join(__dirname, '../public/');
const viewsDirPath = path.join(__dirname, '../templates/views')
const partialsDirPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsDirPath)
hbs.registerPartials(partialsDirPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Andrew Mead'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Andrew Mead'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Andrew Mead'
    })
})

app.get('/weather', (req, res) => {

    const address = req.query.address

    if (!address) {
        return res.send({
            error: 'Please enter an address'
        })
    }

    geocode(address, (geocodeError, { latitude, longitude, location } = {}) => {

        if (geocodeError) {
            return res.send({
                error: geocodeError
            })
        }

        forecast(latitude, longitude, (forecastError, { summary, current_temperature, current_rain_probability }) => {
            if (forecastError) {
                return res.send({
                    error: forecastError
                })
            }

            res.send({
                latitude,
                longitude,
                location,
                summary,
                current_temperature,
                current_rain_probability
            })
            
        })
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        name: 'Andrew Mead',
        errorText: 'Help topic not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorText: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up and running on port : 3000')
})

