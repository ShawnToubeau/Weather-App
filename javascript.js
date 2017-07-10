$(document).ready(function () {
  getLocation()
})

// var skycons = new Skycons()

function getLocation () {
  var location
  $.ajax({
    format: 'jsonp',
    dataType: 'jsonp',
    url: 'http://ip-api.com/json',
    success: function (data) {
      location = data.lat + ',' + data.lon
      $('#weather-location').html(data.city + ', ' + data.region)
      getURL(location)
    },
    error: function () {
      httpsLocation()
    },
    method: 'GET'
  })

  function httpsLocation () {
    if (navigator.geolocation) {
      var location
      navigator.geolocation.getCurrentPosition(passLocation)
    }
  }

  function passLocation (position) {
    location = position.coords.latitude + ', ' + position.coords.longitude
    setCity(location)
    getURL(location)
  }
}

function setCity (latLon) {
  var url =
    'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
    latLon +
    '&sensor=true'
  url = url.replace(/\s/g, '')

  $.ajax({
    format: 'json',
    dataType: 'json',
    url: url,
    success: function (data) {
      $('#weather-location').html(
        data.results[0].address_components[2].long_name +
          ', ' +
          data.results[0].address_components[6].short_name
      )
    },
    method: 'GET'
  })
}

function getURL (location, tempSetting) {
  var url =
    'https://api.darksky.net/forecast/866d02247b135a5df4d9493c83c9820a/' +
    location
  console.log(location)
  getJson(url)
}

function getJson (url) {
  $.ajax({
    format: 'jsonp',
    dataType: 'jsonp',
    url: url,
    success: function (json) {
      $('#weather-current').html(Math.round(json.currently.temperature) + '°F')
      $('#weather-apparent').html(
        'Feels like ' + Math.round(json.currently.apparentTemperature) + '°'
      )
      $('#weather-summary').html(json.currently.summary)
      $('#percipitation').html(
        'Precipitation: ' + json.currently.precipProbability + '%'
      )
      $('#humidity').html('Humidity: ' + json.currently.humidity)
      $('#wind-speed').html('Wind Speed: ' + json.currently.windSpeed + ' Mph')

      if (json.currently.icon) {
        setSkycon(json.currently.icon)
      }

      $('#weather-current').on('click', function () {
        console.log('clicked')
        var currentTemp = $('#weather-current').html().replace(/[°FC]/g, '')
        var tempType = $('#weather-current').html().replace(/[0-9°]/g, '')
        console.log(currentTemp)
        console.log(tempType)

        if (tempType === 'F') {
          console.log('True')
          $('#weather-current').html(toCelsius(currentTemp) + '°C')
          $('#weather-apparent').html(
            'Feels like ' + toCelsius(currentTemp) + '°'
          )
        } else if (tempType === 'C') {
          $('#weather-current').html(toFahrenheit(currentTemp) + '°F')
          $('#weather-apparent').html(
            'Feels like ' + toFahrenheit(currentTemp) + '°'
          )
        }
      })

      function toCelsius (num) {
        var newNum = (parseInt(num) - 32) * 5 / 9
        return Math.round(newNum)
      }

      function toFahrenheit (num) {
        var newNum = parseInt(num) * 9 / 5 + 32
        return Math.round(newNum)
      }
    }
  }).error(function (jpXHR, textStatus, errorThrown) {
    alert('error: ' + JSON.stringify(jpXHR))
  })
}

function setSkycon (weatherType) {
  var skycon = new Skycons({'color': 'pink'})
  switch (weatherType) {
    case 'clear-day':
      skycon = Skycons.CLEAR_DAY
      break
    case 'clear-night':
      skycon = Skycons.CLEAR_NIGHT
      break
    case 'rain':
      skycon = Skycons.RAIN
      break
    case 'snow':
      skycon = Skycons.SNOW
      break
    case 'sleet':
      skycon = Skycons.SLEET
      break
    case 'wind':
      skycon = Skycons.WIND
      break
    case 'fog':
      skycon = Skycons.FOG
      break
    case 'cloudy':
      skycon = Skycons.CLOUDY
      break
    case 'partly-cloudy-day':
      skycon = Skycons.PARTLY_CLOUDY_DAY
      break
    case 'partly-cloudy-night':
      skycon = Skycons.PARTLY_CLOUDY_NIGHT
      break
  }

  if (skycon !== null) {
    skycons.set('icon', skycon)
    skycons.play()
  }
}
