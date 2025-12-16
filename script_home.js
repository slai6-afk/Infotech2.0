//locate cities by coords & information database
var cityData = {
    "tokyo": {
        coords: { latitude: 35.6895, longitude: 139.6917 },
        name: "Tokyo",
        location: "Tokyo is one of the world's largest metropolitan areas, famous for its efficient public transport system and the iconic Shibuya crossing, where tradition and modernity blend.",
        hardFact: "Tokyo Bay is an important fishing and shipping hub on the western Pacific coast. The city's electricity supply relies heavily on thermal power generation.",
    },
    "newyork": {
        coords: { latitude: 40.7128, longitude: -74.0060 },
        name: "New York",
        location: "Known as the 'Crossroads of the World,' New York features iconic landmarks like the Statue of Liberty and Central Park, serving as a global center for finance, culture, and media.",
        hardFact: "New York City faces risks of coastal flooding due to climate change and operates one of the world's busiest subway systems, carrying millions of passengers daily.",
    },
    "paris": {
        coords: { latitude: 48.8566, longitude: 2.3522 },
        name: "Paris",
        location: "Paris, the famous 'City of Light' and fashion capital, attracts global tourists with the Eiffel Tower, the Louvre, and the romantic atmosphere along the Seine River.",
        hardFact: "Paris is actively promoting bicycle transit to reduce urban pollution. It also has a complex system of ancient catacombs beneath the city.",
    },
    "london": {
        coords: { latitude: 51.5074, longitude: 0.1278 },
        name: "London",
        location: "London boasts a long history, is the seat of the British monarchy, and features iconic sites like Big Ben and the Tower of London, running along the River Thames.",
        hardFact: "The Thames Estuary in London is constantly subject to tidal influences, requiring the use of the massive Thames Barrier to protect the city from flooding.",
    },
    "beijing": {
        coords: { latitude: 39.9042, longitude: 116.4074 },
        name: "Beijing",
        location: "Beijing, the capital of China, is home to World Heritage Sites like the Forbidden City and the Great Wall, representing a blend of historical culture and modern development.",
        hardFact: "Beijing faces tight water resources, with many reservoirs located in the suburbs. The city has recently focused on air pollution control to improve air quality.",
    },
    "sydney": {
        coords: { latitude: -33.8688, longitude: 151.2093 },
        name: "Sydney",
        location: "Sydney is Australia's largest city, famous for the Sydney Opera House and Harbour Bridge, and enjoys a unique beach lifestyle.",
        hardFact: "Sydney's natural environment is close to bushland, facing the threat of bushfires during the summer. Drinking water primarily relies on reservoirs.",
    }
};

//setting for chosen and unchosen cities
function updateCity(selectedCity) {
    var allCities = document.getElementsByClassName("city");

    for (var i = 0; i < allCities.length; i++) {
        var locationImg = allCities[i].getElementsByTagName("img")[0];
        locationImg.src = "assets/location.png";
    }

    var selectedImg = document.querySelector('.city[data-city="' + selectedCity + '"]').getElementsByTagName("img")[0];
    selectedImg.src = "assets/selected.png";
}

//onclick activity to update the chosnen and unchosen icon & load the associated information
function selectCity(cityKey) {
    updateCity(cityKey);
    changeCity(cityKey);
}

//setting of automatically showing Tokyo when enter the page(find tokyo in city and return)
var urlParams = new URLSearchParams(window.location.search);
var initialCity = urlParams.get('city') || 'tokyo';
updateCity(initialCity);
changeCity(initialCity);

//get currrent weather information & settings for defining the weather
function getWeatherConditionInfo(currentData) {
    var rain = currentData.rain;
    var snowfall = currentData.snowfall; 
    var windSpeed = currentData.wind_speed_10m; 
    var cloudCover = currentData.cloud_cover;

    if (snowfall > 0.1) {
        return 'Snowy'; 
    }

    if (rain > 0.5) {
        return 'Rainy'; 
    }
    
    if (windSpeed > 30) {
        return 'Windy'; 
    }

    if (cloudCover < 20) {
        return 'Clear Sky'; 
    } else if (cloudCover >= 80) {
        return 'Overcast'; 
    } 
}

//return the chosen city name, status and temperature for the top left box
function topLeftWeather(currentData, cityName) {
    var temperature = currentData.temperature_2m;
    var unit = '°C';
    var weatherCondition = getWeatherConditionInfo(currentData);
    var weatherContent = "";
    weatherContent += '<p>' + cityName + '</p>';
    weatherContent += '<p>Current Status: ' + weatherCondition + '</p>';
    weatherContent += '<p>Current Temp: ' + temperature + unit + '</p>';
    
    return weatherContent;
}

//same logic based on getWeatherConditionInfo to return the background visual image of the weather
function getWeatherBackground(currentData) {
    var rain = currentData.rain; 
    var snowfall = currentData.snowfall; 
    var windSpeed = currentData.wind_speed_10m;
    var cloudCover = currentData.cloud_cover;

    if (snowfall > 0.1) {
        return 'assets/snowy.png';
    }

    if (rain > 0.5) {
        return 'assets/rainy.png';
    }
    
    if (windSpeed > 30) {
        return 'assets/windy.png';
    }

    if (cloudCover < 20) {
        return 'assets/sunny.png';
    } else if (cloudCover >= 80) {
        return 'assets/cloudy.png';
    } 
}

//return tree visual image based on temperature & defining the weather
function getTreeImage(temperature) {
    if (temperature >= 25) {
        return 'assets/summertree.png'; 
    } else if (temperature >= 15) {
        return 'assets/springtree.png'; 
    } else if (temperature >= 5) {
        return 'assets/autumntree.png'; 
    } else {
        return 'assets/wintertree.png';
    }
}

async function changeCity(cityKey) {
    //reach all the data in cityData based on cityKey
    var city = cityData[cityKey];
    //connect the elements that will change
    var weatherBox = document.querySelector('.top-left');
    var locationBox = document.querySelector('.top-right');
    var hardFactBox = document.querySelector('.bottom-left');
    var treeVisual = document.querySelector('.tree-visual img');
    var weather = document.querySelector('.weather-visual');
    //API connection by providing the coords to get all weather info
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + city.coords.latitude + 
              '&longitude=' + city.coords.longitude + 
              '&current=temperature_2m,wind_speed_10m,cloud_cover,rain,snowfall&temperature_unit=celsius&timezone=auto';

    try {
        var response = await fetch(url);
        var jsonData = await response.json(); 
        //get temperature above 2m & store datas into currentData
        var currentTemp = jsonData.current.temperature_2m; 
        var currentData = jsonData.current;

        //put topLeftWeather Info
        weatherBox.innerHTML = topLeftWeather(currentData, city.name);

        //put the associated tree image from getTreeImage
        treeVisual.src = getTreeImage(currentTemp);

       //use getWeatherBackground to find the associated file and change by style.backgroundImage in css
       //must change this visual by css because this is a the weather-visual is located under tree-visual, and it does not have an image spot in the html
        var backgroundFile = getWeatherBackground(currentData);
        weather.style.backgroundImage = 'url(' + backgroundFile + ')';

    //if api connection error occurs, return failure statement in the top left box
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        weatherBox.innerHTML = '<p>Weather data failed to load.</p>';
    }

    //put location info typed earlier into the top right box
    var toprightContent = "";
    toprightContent += '<p>Location</p>';
    toprightContent += '<p>' + city.location + '</p>';
    locationBox.innerHTML = toprightContent;

    //put location info typed earlier into the bottom left box
    var bottomleftContent = "";
    bottomleftContent += '<p>Hard Fact</p>';
    bottomleftContent += '<p>' + city.hardFact + '</p>';
    hardFactBox.innerHTML = bottomleftContent;
}