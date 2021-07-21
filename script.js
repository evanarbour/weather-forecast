var apiKey = 'd90d02d7459753cd08a60263334493bf';
var searchButton = $('#search-btn')
var searchCity = $('#search-city');
var currentCity = $('#current-city');
var currentTemp = $('#current-temp');
var currentHumidity = $('#current-humidity');
var currentWS = $('#current-WS');
var currentUV = $('#current-UV');
var currentDate = (moment().format('l'));
var city = '';



function displayWeather(event) {
    event.preventDefault();
    if(searchCity.val().trim()!=='') {
        city = searchCity.val().trim();
        currentWeather(city);
    }
    
};


function currentWeather(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            var weatherIcon = data.weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/"+ weatherIcon +"@2x.png";
            $(currentCity).text(data.name + ' ' + currentDate + ' ' + `<img src="${iconUrl}">`);
        })

}

searchButton.click(displayWeather);



