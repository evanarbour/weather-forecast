var apiKey = 'd90d02d7459753cd08a60263334493bf';
var searchColumn = $('#search-column');
var dashboard = $('#dashboard-info');
var searchButton = $('#search-btn');
var historyButton = $('#history-btn');
var searchHistory = $('#search-history');
var searchCity = $('#search-city');
var currentCity = $('#current-city');
var currentTemp = $('#current-temp');
var currentHumidity = $('#current-humidity');
var currentWS = $('#current-WS');
var currentUV = $('#current-UV');
var currentDay = $('#current-day')
var weatherDescr = $('#weather-descr');
var cardBody = $('#card-body');
var city = '';



function displayWeather(event) {
    event.preventDefault();
    searchColumn.removeClass('centered');
    dashboard.removeClass('hide');
    if(searchCity.val().trim()!=='') {
        city = searchCity.val().trim();
        currentWeather(city);
        displaySearchHistory();
    } else {
        alert('Please enter a valid city name')
    };
    
};


function currentWeather(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('----Data by City Name----')
            console.log(data)

            var weatherIcon = data.weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/"+ weatherIcon +"@2x.png";
            var iconImg = $(`<img>`);
            iconImg.attr('src', iconUrl);
            currentCity.text(data.name + ' ');
            currentCity.append(iconImg);

            var weatherDescription = data.weather[0].description;
            weatherDescr.text(weatherDescription);
            weatherDescr.css('font-style', 'italic');

            currentDay.text(moment().format('dddd, l'));
            currentDay.css('font-weight', 'bold');

            var tempReading = data.main.temp;
            currentTemp.text('Temperature:' + ' ' + Math.floor(tempReading) + '℉');

            var windReading = data.wind.speed;
            currentWS.text('Wind:' + ' ' + windReading + ' ' + 'MPH');

            var humReading = data.main.humidity;
            currentHumidity.text('Humidity:' + ' ' + Math.floor(humReading) + '%');

            getUVIndex(data.coord.lat, data.coord.lon);
            getFiveDayForecast(data.name);


        })

};

function getUVIndex(lat, lon) {
    var uviUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude={minutely,hourly,daily}&appid=' + apiKey;

    fetch(uviUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('----Data for UV Index----');
            console.log(data);

            var UVreadingData = data.current.uvi;
            var UVreadingNumb = parseFloat(UVreadingData);
            UVdisplay = $(`<span class="py-2 px-4 rounded">${UVreadingNumb}</span>`);
            currentUV.text('UV Index:' + ' ');
            currentUV.append(UVdisplay);
            
            if (UVreadingNumb <= 2.0 ) {
                UVdisplay.addClass('bg-success text-white');
            } else if (UVreadingNumb > 2.1 && UVreadingNumb < 5.9 ) {
                UVdisplay.addClass('bg-warning text-dark');
            } else if (UVreadingNumb > 6.0  && UVreadingNumb < 7.9 ) {
                UVdisplay.css({'background-color': 'orange', 'color': 'black'});
            } else if (UVreadingNumb > 8.0 && UVreadingNumb < 10.9 ) {
                UVdisplay.addClass('bg-danger text-white');
            } else {
                UVdisplay.css({'background-color': 'purple', 'color': 'white'})
            };

            
        });
}

function getFiveDayForecast(city) {
    var fiveDayUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial' + '&appid=' + apiKey;

    fetch(fiveDayUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('----Five Day Forecast----');
            console.log(data);

            var fiveDayArray = data.list;
            for (i = 0; i < fiveDayArray.length; i++) {
                var dataDate = data.list[(i * 8) + 1].dt_txt;
                var formatDate = moment(dataDate).format('dddd, MM / DD');
                $(`#fDate${i}`).text(formatDate);

                var icon = data.list[(i * 8) + 1].weather[0].icon;
                var iconfUrl = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";
                var iconfImg = $(`<img>`);
                iconfImg.attr('src', iconfUrl);
                $(`#fIcon${i}`).html(iconfImg);
                
                var temp = data.list[(i * 8) + 1].main.temp;
                $(`#fTemp${i}`).text('Temp:' + ' ' + Math.floor(temp) + '℉');

                var wind = data.list[(i * 8) + 1].wind.speed;
                $(`#fWind${i}`).text('Wind:' + ' ' + Math.floor(wind) + ' ' + 'MPH');

                var humidity = data.list[(i * 8) + 1].main.humidity;
                $(`#fHumid${i}`).text('Humidity:' + ' ' + Math.floor(humidity) + '%');

            };
        });
};

function displaySearchHistory() {
    historyButton = $(`<li><button id='history-btn' data-city='${city}' class='btn btn-outline-secondary' type='button'>${city}</button>`);
    searchHistory.append(historyButton);

    $(`button.btn.btn-outline-secondary`).click(function(){

        var buttonData = $(this).data('city');

        currentWeather(buttonData);
    })
}

  



searchButton.click(displayWeather);



