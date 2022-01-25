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
    //debugger;

    //construct request URL to get city weather info from coordinates
    var requestCityWeather = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=metric&appid=022816ce4f8542d4f9f3d06e40efbb54";    
    fetch(requestCityWeather)
    .then(
        res => res.json(),
    )
    .then(function(res){
        
        //****next should be calling a function to update the GUI with from cityWeather variable***//
        //make sure to first fill theDate var with Date object representing the date of the dateNight

        displayWeather(res);
    });
}

function displayWeather(response){
    //debugger;
    var noDays = response.daily.length;
    var loop = 0;
    var row1, row2, row3, row4, row5, total, show;
    var today = moment();
    row1 = "<tr class='rowDate'>";
    row2 = "<tr class='rowIcon'>";
    row3 = "<tr class='rowMax'>";
    row4 = "<tr class='rowWind'>";
    row5 = "<tr class='rowUv'>";
    console.log(response);
    console.log("Days: "+noDays);

    while(loop < noDays){
        row1 = row1 +  "<td>" + today.add("days",loop).format("DD MMM YYYY") + "</td>";
        row2 = row2 + "<td><img class='iconImg' src='https://openweathermap.org/img/w/" + response.daily[loop].weather[0].icon + ".png' alt='Weather Icon'/>" + "<h2 class='temp'>" + response.daily[loop].temp.day + "&deg;c</h2></td>";
        row3 = row3 + "<td>Min: " + response.daily[loop].temp.min + "&deg;c - Max: " + response.daily[loop].temp.max + "&deg;c</td>";
        row4 = row4 + "<td>Wind: " + Math.round(response.daily[loop].wind_speed * 3.6) + "kph</td>";
        row5 = row5 + "<td>UV Index: " + response.daily[loop].uvi + " - Humidity: " + response.daily[loop].humidity + "</td>";
        console.log(row1);
        //Exit
        loop = loop + 1;
    }
    row1 = row1 + "</tr>";
    row2 = row2 + "</tr>";
    row3 = row3  + "</tr>";
    row4 = row4  + "</tr>";
    row5 = row5  + "</tr>";

    total = row1 + row2 + row3 + row4 + row5;
    show = "<th>" + city + "</th>";
    document.getElementById("display").innerHTML = show + total;
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
}