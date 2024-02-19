let imgBg = document.getElementById("bg_image")
let weather = document.getElementById("weather")
let temperature = document.getElementById("temperature")
let cityInput = document.getElementById("location")

const APIKEY = "ae12ddd9f08245b80a8eb291958a8b6a"

async function fetchWeatherInfo(city, latitude, longitude) {
    console.log(city, latitude, longitude)

    let currentWeather
    let tempInFahrenheit
    let tempInCelsius

    await fetch(`https://geocode.maps.co/search?q=${city || "New York"}&api_key=65d0be7209187423628947ebx624404`)
    .then(response => response.json())
    .then(data => {
        const lat = latitude || data[0].lat
        const lon = longitude || data[0].lon

        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`);
    })
    .then(response => response.json())
    .then(data => {
        currentWeather = data.weather[0].main;
        tempInFahrenheit = (parseFloat(data.main.temp - 273.15) * 9/5 + 32).toFixed(1);
        tempInCelsius = (parseFloat(data.main.temp - 273.15)).toFixed(1);

        cityInput.value = data.name
    })

    return {
        currentWeather: currentWeather,
        tempInFahrenheit: tempInFahrenheit,
        tempInCelsius: tempInCelsius
    }
}

function toggleLoader(enabled) {
    const loaders = document.getElementsByClassName("loader")
    for (let i = 0; i < loaders.length; i++) {
        const loader = loaders[i];
        enabled ? loader.classList.remove("hidden") : loader.classList.add("hidden")
    }

    enabled ? weather.classList.add("hidden") : weather.classList.remove("hidden")
    enabled ? temperature.classList.add("hidden") : temperature.classList.remove("hidden")
}

function updateImage(currentWeather) {
    if (currentWeather == "Clear") {
        imgBg.src = "https://i.pinimg.com/originals/e1/3a/4d/e13a4d737425141353603f7a3edb73cd.jpg"
    } else if (currentWeather == "Clouds") {
        imgBg.src = "https://media.istockphoto.com/id/598222542/photo/sky-background.jpg?s=612x612&w=0&k=20&c=WBAiCExAztT4SzWh4hIgmQwTG7VMJ5o9oObXHszmm8A="
    } else if (currentWeather == "Rain") {
        imgBg.src = "https://media.istockphoto.com/id/1476189983/photo/summer-rain-raindrops-bad-weather-depression.webp?b=1&s=170667a&w=0&k=20&c=pD_fkxyEOROx1zXxuABfciV7cAKpxrb5JWB63VDM4Rw="
    } else if (currentWeather == "Snow") {
        imgBg.src = "https://www.highcountryweather.com/wp-content/uploads/2016/11/2016-november-03-how-snowy.jpg"
    } else if (currentWeather == "Thunderstorm") {
        imgBg.src = "https://as2.ftcdn.net/v2/jpg/00/55/04/21/1000_F_55042102_SvrCFUO6eYd4rPSF5ik2P2b8sgC1EDwW.jpg"
    } else if (currentWeather == "Haze") {
        imgBg.src = "https://d2h8hramu3xqoh.cloudfront.net/blog/wp-content/uploads/2022/08/Hazy-Skies-scaled.webp"
    } else if (currentWeather == "Mist") {
        imgBg.src = "https://images.caxton.co.za/wp-content/uploads/sites/28/2018/06/mist-1.jpg"
    } else {
        imgBg.src = "https://cdn.shecodes.io/uploads/07777ac8-eb90-42f9-ba6e-0153130b6c07/57.png"
    }
}

function updateWeather(city, latitude, longitude) {
    city = city ? city : cityInput.value

    if (city != "" || latitude) {
        toggleLoader(true)

        fetchWeatherInfo(city, latitude, longitude).then(data => {
            weather.innerHTML = data.currentWeather
            temperature.innerHTML = `${data.tempInFahrenheit} Fº / ${data.tempInCelsius} Cº`

            toggleLoader(false)
            updateImage(data.currentWeather)

            imgBg.classList.remove("img_hidden")
        })
        .catch(err => {
            weather.innerHTML = "N/A"
            temperature.innerHTML = "N/A"
            toggleLoader(false)
        })
    }
}

function geolocate() {
    function showPosition(position) {
        updateWeather(null, position.coords.latitude, position.coords.longitude)
      }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported on your device.")
    }
}