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
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            var weatherIcon = data.weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/"+ weatherIcon +"@2x.png";
            var iconImg = $(`<img>`);
            iconImg.attr('src', iconUrl);
            currentCity.text(data.name + ' ' + currentDate + ' ');
            currentCity.append(iconImg);

            var tempReading = data.main.temp;
            currentTemp.text('Temperature:' + ' ' + Math.floor(tempReading) + '℉');

            var windReading = data.wind.speed;
            currentWS.text('Wind:' + ' ' + windReading + ' ' + 'MPH');

            var humReading = data.main.humidity;
            currentHumidity.text('Humidity:' + ' ' + Math.floor(humReading) + '%');

            getUVIndex(data.coord.lat, data.coord.lon);



        })

};

function getUVIndex(lat, lon) {
    var uviUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude={minutely,hourly,daily}&appid=' + apiKey;

    fetch(uviUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('----One Call Data----');
            console.log(data);

            var UVIreadingData = data.current.uvi;
            var UVIreadingNumb = parseFloat(UVIreadingData);
            UVdisplay = $(`<span class="py-2 px-4 rounded">${UVIreadingNumb}</span>`);
            currentUV.text('UV Index:' + ' ');
            currentUV.append(UVdisplay);
            
            if (UVIreadingNumb <= 2.0 ) {
                UVdisplay.addClass('bg-success text-white');
            } else if (UVIreadingNumb > 2.1 && UVIreadingNumb < 5.9 ) {
                UVdisplay.addClass('bg-warning text-dark');
            } else if (UVIreadingNumb > 6.0  && UVIreadingNumb < 7.9 ) {
                UVdisplay.css({'background-color': 'orange', 'color': 'black'});
            } else if (UVIreadingNumb > 8.0 && UVIreadingNumb < 10.9 ) {
                UVdisplay.addClass('bg-danger text-white');
            } else {
                UVdisplay.css({'background-color': 'purple', 'color': 'white'})
            };

            
        })
}

searchButton.click(displayWeather);



