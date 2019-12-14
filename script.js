function enterPressed(e, inputId){
	if (e.keyCode == 13) {
		findCity(inputId);
  	}
}

function findCity(inputId){
	if(document.getElementById(inputId).value != ""){
		var xmlhttp = new XMLHttpRequest();
		var url = "https://api.openweathermap.org/data/2.5/weather?q="+document.getElementById(inputId).value+"&units=metric&APPID=a2724447315635ff1cd798e063ff7a58";
		document.getElementById(inputId).value = "";

		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById(inputId+"-alert").style = "display: none;"
				var weatherResponse = JSON.parse(this.responseText);
				writeWeather(weatherResponse);
			}else if(this.status == 404){
				document.getElementById(inputId+"-alert").innerHTML = "City not found!"
				document.getElementById(inputId+"-alert").style = "display: block;"
			}else{
				document.getElementById(inputId+"-alert").innerHTML = "Something went wrong, try again later!"
				document.getElementById(inputId+"-alert").style = "display: block;"
			}
		};

		xmlhttp.open("GET", url, true);
		xmlhttp.send();
    }
}

var d = new Date();
var timeOffset = d.getTimezoneOffset()
timeOffset = timeOffset * (-60); 

function writeWeather(weatherResponse){
	console.log('My object: ', weatherResponse);

	setBackground(weatherResponse);

	document.getElementById("Search-div").style = "display: none;"
	document.getElementById("Weather-div").style = "display: block;"

	document.getElementById("CityName").innerHTML = weatherResponse.name+", "+weatherResponse.sys.country;

	document.getElementById("Time").innerHTML = getLocationTime(weatherResponse);

	document.getElementById("Coordinates").innerHTML = getCoordinates(weatherResponse);

	document.getElementById("Temperature").innerHTML = weatherResponse.main.temp+ " °C";

	document.getElementById("WeatherImg").src = "http://openweathermap.org/img/wn/"+weatherResponse.weather[0].icon+"@2x.png";
	document.getElementById("Description").innerHTML = weatherResponse.weather[0].description;

	document.getElementById("Wind").innerHTML = weatherResponse.wind.speed+" m/s";

	document.getElementById("Sunrise-set").innerHTML = "Sunrise "+getSunriseTime(weatherResponse)+"<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Sunset "+getSunsetTime(weatherResponse);
}

function setBackground(weatherResponse){
	if(weatherResponse.weather[0].icon[2] == 'n'){
		document.body.style = "background-image: url('img/night.jpg');"
	}else if(weatherResponse.weather[0].description == 'clear sky' || weatherResponse.weather[0].description == 'few clouds' || weatherResponse.weather[0].description == 'light rain'){
		document.body.style = "background-image: url('img/clear_sky.jpg');"
	}else{
		document.body.style = "background-image: url('img/clouds.jpg');"
	}
}

function getLocationTime(weatherResponse){
	var currentDate = new Date((weatherResponse.dt + weatherResponse.timezone - timeOffset)*1000);
	var hours = currentDate.getHours();
	var minutes = "0" + currentDate.getMinutes();
	var currentTime = hours + ':' + minutes.substr(-2);

	return currentTime;
}

function getSunriseTime(weatherResponse){
	var date = new Date((weatherResponse.sys.sunrise + weatherResponse.timezone - timeOffset)*1000);
	hours = date.getHours();
	minutes = "0" + date.getMinutes();
	sunrise = hours + ':' + minutes.substr(-2);

	return sunrise;
}

function getSunsetTime(weatherResponse){
	date = new Date((weatherResponse.sys.sunset + weatherResponse.timezone - timeOffset)*1000);
	hours = date.getHours();
	minutes = "0" + date.getMinutes();
	var sunset = hours + ':' + minutes.substr(-2);

	return sunset;
}

function getCoordinates(weatherResponse){
	var y = weatherResponse.coord.lat;
	if(y < 0){
		y = y+" S";
		y = y.slice(1);
	}else{
		y = y+" N";
	}
	var x = weatherResponse.coord.lon;
	if(x < 0){
		x = x+" W";
		x = x.slice(1);
	}else{
		x = x+" E";
	}
	var coordinates = y+"&nbsp;&nbsp;&nbsp;"+x;

	return coordinates;
}