'use strict';

const apiKey = '27f51f7056bd92545dc7d0c1cd3a6f51';

// Fetch data from the Server
export const fetchData = function(URL, callback) {
    fetch(`${URL}&appid=${apiKey}`).then(res => res.json()).then(data => callback(data));
}


export const url  = {
    currentWeather(lat, lon) {
        return `https://pro.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
    },
    forecast(lat, lon){
        return `https://pro.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
    },

    airPollution(lat, lon){
        return `https://pro.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
    },

    reverseGeo(lat, lon)
    {
        return `https://pro.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
    },
    geo(query) {
        return `https://pro.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;

    }
}