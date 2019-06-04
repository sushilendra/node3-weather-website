const request = require('request')

const forecast = (latitude, longitude, callback) => {

    const url = 'https://api.darksky.net/forecast/b5e7a7dde601bba64ca3464746452337/' +
        latitude + ',' + longitude +
        '?units=si';

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service')
        } else if (body.error) {
            callback('Unable to find location')
        } else {
            callback(undefined, {
                summary: body.daily.data[0].summary,
                current_temperature: body.currently.temperature,
                current_rain_probability: body.currently.precipProbability
            })
        }
    })
}

module.exports = forecast