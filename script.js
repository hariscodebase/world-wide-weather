var cityList;
var selectedCity;

$.getJSON("content/cityList.json", function (json) {
    cityList = json; // this will show the info it in firebug console
});


//getting all required elements
const searchWrapper = $('.search-input')[0];
const inputBox = $('#city-input')[0];
const suggBox = $('.autocom-box')[0];

//onkey press and release events
inputBox.onkeyup = (e) => {
    let userData = e.target.value;
    let cityResults = [];
    if (userData) {
        cityResults = cityList.filter((data) => {
            return data.name.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });
        cityResults = cityResults.slice(0, 20).map((data) => {
            return data = `<li id=${data.id}>${data.name}, ${data.country}</li>`;
        });
        searchWrapper.classList.add("active");
        showSuggestions(cityResults);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            allList[i].setAttribute("onclick", "select(this)");
        }
    } else {
        searchWrapper.classList.remove("active");
    }


}

function select(element) {
    inputBox.value = element.textContent; //passing the user slected city to the text box value
    searchWrapper.classList.remove("active");
    selectedCity = element.getAttribute("id");
}

function showSuggestions(list) {
    let listData;
    if (!list.length) {
        userValue = inputBox.value;
        listData = `<li>${userValue}</li>`;
    } else {
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}

// CREATE VARIABLES FOR ELEMENT HOLDERS
var outputSection = document.getElementById("output");
var searchIcon = document.getElementsByClassName("fa-search")[0];

var locationEle = document.getElementById("location");
var iconEle = document.getElementById("w-icon");
var temperatureEle = document.getElementById("temperature");
var conditionsEle = document.getElementById("conditions");
var sunsetEle = document.getElementById("sunset");

// FUNCTION TO CALL THE API AND SHOW USEFUL INFO FROM RESPONSE
function showWeather(city) {
    //CREATE  VARIABLE FOR API KEY
    const myApiKey = "64fb994916d35cf475815805c4e78f3f";

    //CREATE VARIABLE FOR URL AND APPEND CITY + KEY
    var url = "https://api.openweathermap.org/data/2.5/weather?id=" + city + "&units=metric&appid=" + myApiKey;

    //USE XMLHTTPREQUEST TO INTERACT WITH THE API
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {

        //CHECK API CALL STATUS IS SUCCESSFUL
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                //HANDLE API-RESPONSE DATA TO SHOW USEFUL INFO
                const data = xhr.response;
                locationEle.innerHTML = data.name;
                iconEle.innerHTML = "<img src='http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png' alt='weather image'>";
                temperatureEle.innerHTML = data.main.temp + " ºC";
                conditionsEle.innerHTML = data.weather[0].main;
                sunsetEle.innerHTML = new Date(data.sys.sunset * 1000).toLocaleTimeString();
                outputSection.style.display = "block";


            } else {

                //THIS BLOCK HANDLES UNSUCCESSFUL API
                outputSection.innerHTML = "API Call unsuccessful";
                outputSection.style.display = "block";
                console.log(xhr.status);
            }
        }
    }

    // PROVIDE URL & SPECIFIC RESPONSE TYPE
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.send(null);
}


// EVENT HANDLERS
searchIcon.onclick = function () {
    showWeather(selectedCity);
}