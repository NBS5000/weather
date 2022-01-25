/*
Weather dashboard
- Steve Barry -
javascript file 
*/
var tomTomKey = "GGODvJKHxmR05owz4sPq91rHvgsk0HWf";
var weatherKey = "022816ce4f8542d4f9f3d06e40efbb54";
var btn = document.getElementById("btn");
var lat, lon, city, safeCity;





//debugger;
if(btn){
    //debugger;
    btn.addEventListener("click",function(){
        // document.getElementById("search").value = "melbourne";
        city = document.getElementById("search").value;
        safeCity = city;//urlSafe(city);
        tomTomUrl = "https://api.tomtom.com/search/2/geocode/" + safeCity + ".json?key=" + tomTomKey + "&language=en-AU";
        if(city){
            callTom(tomTomUrl);
        }else{
            alert("Enter a city");
            return
        }
    })
}

function createList(){
    var exist = JSON.parse(localStorage.getItem("weatherHistory"));
    if (!exist){
        var setCity = {city:""};
        var list = [];
        // list.push(setCity);
        localStorage.setItem("weatherHistory",JSON.stringify(list));    
        localStorage.setItem("weatherCurrent",JSON.stringify(list));
    }
    dropList()
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        myLoc.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    myLat = position.coords.latitude;
    myLon = position.coords.longitude;
    city = "My Location";

    getWeather(myLat,myLon);

}


function callTom(url){
    //debugger;
    fetch(url)
        .then(
            res => res.json(),
        )
        .then(function(res){
            lat = res.results[0].position.lat,
            lon = res.results[0].position.lon;
            if(!lat || !lon){
                setTimeout(function(){},100);
            }
            getWeather(lat,lon);
        })
        .catch(function (error) {
            alert('Location finder did not work: ' + error);
        });
}

function getWeather(lat, lon){
    // debugger;

    //construct request URL to get city weather info from coordinates
    var requestCityWeather = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=metric&appid=022816ce4f8542d4f9f3d06e40efbb54";    
    fetch(requestCityWeather)
    .then(
        (res) => res.json(),
    )
    .then(function(res){
        if(!res){
            setTimeout(500);
            console.log(res);
        }

        displayWeather(res);
    })
    .catch(function(error){
        alert("getWeather failed: " + error);
    });
}

function displayWeather(response){
    //debugger;
    var noDays = response.daily.length;
    var loop = 0;
    var row1, row2, row3, row4, row5, total, show;
    var today = moment();

    console.log(response);

    while(loop < noDays){
        var disp = "display"+loop;
        if(loop == 0){
            row1 = "<tr class='rowDate'><td class='today'>" + today.add(loop,"days").format("DD MMM YYYY") + "</td></tr>";
            row2 = "<tr class='rowIcon'><td class='today'><img class='iconImg' src='https://openweathermap.org/img/w/" + response.daily[loop].weather[0].icon + ".png' alt='Weather Icon'/>" + "<h2 class='temp'>" + response.daily[loop].temp.day + "&deg;c</h2></td></tr>";
            row3 = "<tr class='rowMax'><td class='today'>Min: " + response.daily[loop].temp.min + "&deg;c<br/>Max: " + response.daily[loop].temp.max + "&deg;c</td></tr>";
            row4 = "<tr class='rowWind'><td class='today'>Wind: " + Math.round(response.daily[loop].wind_speed * 3.6) + "kph</td></tr>";
            row5 = "<tr class='rowUv'><td class='today'>UV: " + response.daily[loop].uvi + "<br/>Humidity: " + response.daily[loop].humidity + "</td></tr>";

        }else{

            row1 = "<tr class='rowDate'><td>" + today.add(loop,"days").format("DD MMM YYYY") + "</td></tr>";
            row2 = "<tr class='rowIcon'><td><img class='iconImg' src='https://openweathermap.org/img/w/" + response.daily[loop].weather[0].icon + ".png' alt='Weather Icon'/>" + "<h2 class='temp'>" + response.daily[loop].temp.day + "&deg;c</h2></td></tr>";
            row3 = "<tr class='rowMax'><td>Min: " + response.daily[loop].temp.min + "&deg;c<br/>Max: " + response.daily[loop].temp.max + "&deg;c</td></tr>";
            row4 = "<tr class='rowWind'><td>Wind: " + Math.round(response.daily[loop].wind_speed * 3.6) + "kph</td></tr>";
            row5 = "<tr class='rowUv'><td>UV: " + response.daily[loop].uvi + "<br/>Humidity: " + response.daily[loop].humidity + "</td></tr>";

        }
        total = row1 + row2 + row3 + row4 + row5;
        document.getElementById(disp).innerHTML = total;
        document.getElementById(disp).hidden = false;
        //Exit
        loop = loop + 1;
    }
    row1 = row1 + "</tr>";
    row2 = row2 + "</tr>";
    row3 = row3  + "</tr>";
    row4 = row4  + "</tr>";
    row5 = row5  + "</tr>";

    total = row1 + row2 + row3 + row4 + row5;
    // show = "<th>" + city + "</th>";
    // document.getElementById("display").innerHTML = show + total;
    var current = [];
    current.push(response);
    localStorage.setItem("weatherCurrent",JSON.stringify(current));    
    addToHistory(city);

}

function addToHistory(city){
    var history = JSON.parse(localStorage.getItem("weatherHistory"));
    var list = history.length;
    var x = 0;
    while(x < list ){
        if(city === history[x]){
            break;
        }
        //Exit
        x = x+1;
    } 
    if(x ==list){
        if(city == "My Location"){
            history.push(city);
            localStorage.setItem("weatherHistory",JSON.stringify(history));
            console.log(history);
        }
    }
    dropList();
}

function dropList(){

    var histList = JSON.parse(localStorage.getItem("weatherHistory"));
    var listLen = histList.length;
    var z = 0;
    var content = "<option></option>";
    while(z < listLen){
        content = content + "<option>"+histList[z]+"</option>";
        z = z+1;
    }
    document.getElementById("history").innerHTML = content;
}

function today(){
    // var todayExpand = localStorage.getItem("weatherCurrent");


}

/*
    low (1-2)
    moderate (3-5)
    high (6-7)
    very high (8-10)
    extreme (11 and above).
*/

/*
    if(!parseInt(showRain)){
        showRain = 0;
    }
    document.getElementById("rain").innerHTML = showRain + "mm";
    */
/*
    // update localstorage
    var storage = JSON.parse(localStorage.getItem("dateNight"));
    // sets the different values of the date
    storage[0].icon = iconLink;
    storage[0].temp = showTemp;
    storage[0].wind = showWind;
    storage[0].rain = showRain;
    // sets the updated array to localstorage
    localStorage.setItem('dateNight', JSON.stringify(storage));
*/
