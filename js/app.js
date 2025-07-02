// const now = new Date();
//   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//   document.querySelector('.location-info p').innerHTML = `<i class="fas fa-calendar-alt"></i> ${now.toLocaleDateString('en-US', options)}`;


'use strict';

import { fetchData, url } from "./api.js";
import * as module from "./module.js";


// add event listeners on multiple elements
const addEventOnElements = function(elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
}

// Toggle search container

const searchContainer = document.querySelector("[data-search-container]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchContainer.classList.toggle("active");
addEventOnElements(searchTogglers, 'click', toggleSearch);



// Search Integration

const searchInput = document.querySelector("[data-search-input]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchInput.addEventListener('input', () => {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (searchInput.value)
  {
    searchResult.classList.remove('active');
    searchResult.innerHTML = "";
    searchInput.classList.remove("searching");
  }else{
    searchInput.classList.add('searching');
  }


  if (searchInput.value)
  {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchInput.value),function(locations){
        searchInput.classList.remove('searching');
        searchResult.classList.add('active');
        searchResult.innerHTML = `
          <ul class="search-list" data-search-list>
              <li class="search-item"></li>
          </ul>
        `;

        const items = [];

        for (const {name, lat, lon, country, state} of locations){
          const searchItem = document.createElement('li');
          searchItem.classList.add("search-item");

          searchItem.innerHTML = `
            <i class="fa-solid fa-location-pin"></i>
                  <div>
                      <p class="item-title">${name}</p>
                      <p class="label-2 item-subtitle">${state || ""}, ${country}</p>
                </div>                       
              <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
          `;

          searchResult.querySelector("[data-search-list]").appendChild(searchItem);
          items.push(searchItem.querySelector("[data-search-toggler]"));
        }
        addEventOnElements(items, 'click', () => {
          toggleSearch();
          searchResult.classList.remove('active');
        })
      });
    }, searchTimeoutDuration);
  }


})


const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");

const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");




export const updateWeather = function (lat, lon) {
  loading.style.display = "grid";
  container.style.overflowY = 'hidden';
  container.classList.remove('fade-in');

  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector("[data-current-weather]");
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection =  document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = ""
  highlightSection.innerHTML = ""
  hourlySection.innerHTML = ""
  forecastSection.innerHTML = ""

  if(window.location.hash === "#/current-location")
  {
    currentLocationBtn.setAttribute("disabled", "");
  }else{
    currentLocationBtn.removeAttribute("disabled")
  }


  // Current weather section. 

  fetchData(url.currentWeather(lat, lon), function(currentWeather) {
    const {
      weather,
      dt: dateUnix,
      sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
      main: { temp, feels_like, pressure, humidity},
      visibility,
      timezone
    } = currentWeather

    const [{ description, icon}] = weather;

    const card = document.createElement('div');
    card.classList.add("card", "card-lg", "current-weather-card")

    card.innerHTML = `
        <h2 class="title-2 card-title">Today</h2>
        <div class="wrapper">
            <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
            <img  src="https://openweathermap.org/img/wn/${icon}@2x.png" width="84" height="84" alt="${description}" class="weather-icon">
        </div>
        <p class="body-3">${description}</p>

        <ul class="meta-list">

            <li class="meta-item">
                <i class="fa-solid fa-calendar-day"></i>

                <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
            </li>
            <li class="meta-item">
                <i class="fa-solid fa-location-pin"></i>

                <p class="title-3 meta-text" data-location></p>
            </li>

        </ul>
        `;

        fetchData(url.reverseGeo(lat, lon), function([{name, country}]){
          card.querySelector('[data-location]').innerHTML = `${name}, ${country}`
        });
        currentWeatherSection.appendChild(card);



        // Todays highlights
        fetchData(url.airPollution(lat, lon), function(airPollution) {

          const [{
            main: {aqi},
            components: {no2, o3, so2, pm2_5}
          }] = airPollution.list;

          const card = document.createElement('div');
          card.classList.add("card", "card-lg");

          card.innerHTML = `
          <h2 class="title-2" id="highlights-label">Today's Highlights</h2>

          <div class="highlight-list">

              <div class="card card-sm highlight-card one">

                  <h3 class="title-3">Air Quality Index</h3>

                  <div class="wrapper">

                      <i class="fa-solid fa-wind"></i>

                      <ul class="card-list">

                          <li class="card-item">
                              <p class="title-1">${pm2_5.toPrecision(3)}</p>

                              <p class="label-1">PM <sub>2.5</sub></p>
                          </li>

                          <li class="card-item">

                              <p class="title-1">${so2.toPrecision(3)}</p>

                              <p class="label-1">SO<sub>2</sub></p>
                          </li>

                          <li class="card-item">
                              <p class="title-1">${no2.toPrecision(3)}</p>
                              <p class="label-1">NO<sub>2</sub></p>
                          </li>

                          <li class="card-item">

                              <p class="title-1">${o3.toPrecision(3)}</p>
                              <p class="label-1">O<sub>3</sub></p>
                          </li>

                      </ul>


                  </div>

                  <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}">
                     ${module.aqiText[aqi].level}
                  </span>

              </div>

              <div class="card card-sm highlight-card two">
                  <h3 class="title-3">Sunrise & Sunset</h3>

                  <div class="card-list">

                      <div class="card-item">
                          <i class="fa-solid fa-sun"></i>

                          <div>
                              <p class="label-1">Sunrise</p>
                              <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>

                          </div>
                      </div>

                      <div class="card-item">
                          <i class="fa-solid fa-moon"></i>

                          <div>
                              <p class="label-1">Sunset</p>
                              <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>

                          </div>
                      </div>

                  </div>


              </div>

              <div class="card card-sm highlight-card">

                  <h3 class="title-3">Humidity</h3>

                  <div class="wrapper">
                      <i class="fas fa-tint"></i>

                      <p class="title-1">${humidity}<sup>%</sup></p>

                  </div>


              </div>

              <div class="card card-sm highlight-card">

                  <h3 class="title-3">Pressure</h3>

                  <div class="wrapper">
                      <i class="fas fa-compress-alt"></i>

                      <p class="title-1">${pressure}<sup>hPa</sup></p>

                  </div>


              </div>

              <div class="card card-sm highlight-card">

                  <h3 class="title-3">Visibility</h3>

                  <div class="wrapper">
                      <i class="fa-solid fa-eye"></i>

                      <p class="title-1">${visibility / 1000}<sub>km</sub></p>

                  </div>


              </div>

              <div class="card card-sm highlight-card">

                  <h3 class="title-3">Feels Like</h3>

                  <div class="wrapper">
                      <i class="fas fa-temperature-high"></i>

                      <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>

                  </div>


              </div>

          </div>
          `;

          highlightSection.appendChild(card);
        });


  });

  // 24HR Forecast section

  fetchData(url.forecast(lat, lon), function (forecast){
    const {
      list: forecastList,
      city: {timezone}
    } = forecast;

    hourlySection.innerHTML = `
    <h2 class="title-2">Today at</h2>

    <div class="slider-container">
        <ul class="slider-list" data-temp>
        </ul>

        <ul class="slider-list" data-wind>
        </ul>
    </div>

    `;

    for (const [index, data] of forecastList.entries()) {
      if (index > 7) break;

      const {
        dt: dateTimeUnix,
        main: { temp },
        weather,
        wind: {deg: windDirection, speed: windSpeed }
      } = data;
      const [{icon, description}] = weather;

      const temoLi = document.createElement('li');
      temoLi.classList.add("slider-item");

      temoLi.innerHTML = `
        <div class="card card-sm slider-card">
          <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" loading="lazy" width="48" height="48" alt="${description}" class="weather-icon" title="${description}">
          <p class="body-3">${parseInt(temp)}&deg;</p>
        </div>

      `;

      hourlySection.querySelector("[data-temp]").appendChild(temoLi);
      const windLi = document.createElement('li');
      windLi.classList.add('slider-item');

      windLi.innerHTML = `
        <div class="card card-sm slider-card">
          <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
          <i class="fa-solid fa-location-arrow weather-icon" style="transform: rotate(${windDirection - 180}deg)"></i>
          
          <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
      </div>
      `;

      hourlySection.querySelector("[data-wind]").appendChild(windLi)


      
    };


    // 5 day forecast section;

    forecastSection.innerHTML = `
      <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>
                          
      <div class="card card-lg forecast-card">
          <ul date-forecast-list>

          </ul>
      </div>
    `;

    for(let i = 7, len = forecastList.length; i < len; i += 8){
      const { main: {temp_max}, weather, dt_txt} = forecastList[i];
      const [{icon, description}] = weather;
      const date = new Date(dt_txt);

      const li = document.createElement('li');

      li.classList.add('card-item');

      li.innerHTML = `
      <div class="icon-wrapper">
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="weather-icon" alt="${description}" title="${description}">
          <span class="span">
          <p class="title-2">${parseInt(temp_max)}&deg;</p>
          </span>
      </div>

      <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
      <p class="label-1">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>
      
      `;

      forecastSection.querySelector("[date-forecast-list]").appendChild(li)
    };

    loading.style.display = "none";
  container.style.overflowY = 'auto';
  container.classList.add('fade-in');

  });


};

export const error404 = function ()
{

  errorContent.style.display = 'flex';
  
}

