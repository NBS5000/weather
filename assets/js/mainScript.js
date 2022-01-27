/*
Weather dashboard
- Steve Barry -
javascript file 
*/
var tomTomKey = "GGODvJKHxmR05owz4sPq91rHvgsk0HWf";
var weatherKey = "022816ce4f8542d4f9f3d06e40efbb54";
var btn = document.getElementById("btn");
var lat, lon, city, safeCity;




function begin(){
    var box = document.getElementById("search");
    city = box.value;
    safeCity = city;//urlSafe(city);
    tomTomUrl = "https://api.tomtom.com/search/2/geocode/" + safeCity + ".json?key=" + tomTomKey + "&language=en-AU";
    if(city){
        box.style.boxShadow = "none";
        callTom(tomTomUrl);
    }else{
        // alert("Enter a city");
        box.style.boxShadow = "0 0 3px red";
        return
    }
}
// if(btn){
//     btn.addEventListener("click",begin());
// }
btn.addEventListener("click", function (){
    begin();
});

// if(btn){
//     btn.addEventListener("click",function(){
//         city = document.getElementById("search").value;
//         safeCity = city;//urlSafe(city);
//         tomTomUrl = "https://api.tomtom.com/search/2/geocode/" + safeCity + ".json?key=" + tomTomKey + "&language=en-AU";
//         if(city){
//             callTom(tomTomUrl);
//         }else{
//             alert("Enter a city");
//             return
//         }
//     })
// }

function createList(){
    var exist = JSON.parse(localStorage.getItem("weatherHistory"));
    if (!exist){
        var setCity = {city:""};
        var list = [];
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
    //construct request URL to get city weather info from coordinates
    var requestCityWeather = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=metric&appid=022816ce4f8542d4f9f3d06e40efbb54&exclude=minutely";    
    fetch(requestCityWeather)
    .then(
        (res) => res.json(),
    )
    .then(function(res){
        if(!res){
            setTimeout(500);
        }

        displayWeather(res);
    })
    .catch(function(error){
        alert("getWeather failed: " + error);
    });
}

function displayWeather(response){

    var noDays = response.daily.length;
    var loop = 0;
    var row1, row2, row3, row4, row5, total;
    console.log(response);
    // set the hours
    var hLoop = 0;
    var hData = [];
    hData.push(["Hour","Temp", "Rain"]);
    while (hLoop < 24){
        if(!response.hourly[hLoop].rain){
            var hRain = 0;
        }else{
            var hRain = Math.round(response.hourly[hLoop].rain["1h"]);
        }
        hData.push(["",parseInt(response.hourly[hLoop].temp),hRain]);
        // Exit
        hLoop = hLoop + 1;
    }
    console.log(hData);
    var width = Math.round((screen.width *0.9));
    localStorage.setItem("hourly",JSON.stringify(hData));
    drawVisualization(hData,width)
    // set the days
    while(loop <(noDays-1)){
        var today = moment();
        var dayDisp = today.add(loop,"days").format("ddd - DD MMM YYYY");
        var disp = "display"+loop;
        if(loop == 0){
            var uv = response.daily[loop].uvi;
            var uvCol;
            if(uv <3){
                uvCol = "uvLow";
            }else if(uv < 6){
                uvCol = "uvMod";
            }else if(uv < 8){
                uvCol = "uvHigh";
            }else if(uv < 11){
                uvCol = "uvVhigh";
            }else{
                uvCol = "uvExt";
            }
            row1 = "<tr class='rowDate'><td class='today'>" + dayDisp + "</td></tr>";
            row2 = "<tr class='rowIcon'><td class='today'><img class='iconImg' src='https://openweathermap.org/img/w/" + response.daily[loop].weather[0].icon + ".png' alt='Weather Icon'/>" + "<h2 class='temp'>" + response.daily[loop].temp.day + "&deg;c</h2></td></tr>";
            row3 = "<tr class='rowMax'><td class='today'>Min: " + response.daily[loop].temp.min + "&deg;c<br/>Max: " + response.daily[loop].temp.max + "&deg;c</td></tr>";
            row4 = "<tr class='rowWind'><td class='today'>Wind: " + Math.round(response.daily[loop].wind_speed * 3.6) + "kph</td></tr>";
            row5 = "<tr class='rowUv'><td class='today "+uvCol+"'>UV: " + uv + "<br/><span class='hum'>Humidity: " + response.daily[loop].humidity + "</span></td></tr>";

        }else{
            var uv = response.daily[loop].uvi;
            var uvCol;
            if(uv <3){
                uvCol = "uvLow";
            }else if(uv < 6){
                uvCol = "uvMod";
            }else if(uv < 8){
                uvCol = "uvHigh";
            }else if(uv < 11){
                uvCol = "uvVhigh";
            }else{
                uvCol = "uvExt";
            }

            row1 = "<tr class='rowDate'><td>" + dayDisp + "</td></tr>";
            row2 = "<tr class='rowIcon'><td><img class='iconImg' src='https://openweathermap.org/img/w/" + response.daily[loop].weather[0].icon + ".png' alt='Weather Icon'/>" + "<h2 class='temp'>" + response.daily[loop].temp.day + "&deg;c</h2></td></tr>";
            row3 = "<tr class='rowMax'><td>Min: " + response.daily[loop].temp.min + "&deg;c<br/>Max: " + response.daily[loop].temp.max + "&deg;c</td></tr>";
            row4 = "<tr class='rowWind'><td>Wind: " + Math.round(response.daily[loop].wind_speed * 3.6) + "kph</td></tr>";
            row5 = "<tr class='rowUv'><td class='"+uvCol+"'>UV: " + uv + "<br/><span class='hum'>Humidity: " + response.daily[loop].humidity + "</span></td></tr>";

        }
        total = row1 + row2 + row3 + row4 + row5;
        document.getElementById(disp).innerHTML = total;
        document.getElementById(disp).hidden = false;
        //Exit
        loop = loop + 1;
    }
    city = city.replace(/\b[a-z]/g, (x) => x.toUpperCase());
    document.getElementById("location").textContent = city;
    document.getElementById("legend").style.display = "block";
    document.getElementById("next").style.display = "block";
    document.getElementsByTagName("footer")[0].style.display = "block";
    document.getElementById("today").hidden = false;
    var current = [];
    current.push(response);
    localStorage.setItem("weatherCurrent",JSON.stringify(current));    
    addToHistory(city);
    document.getElementById("search").value = "";
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
        if(city != "My Location"){
            city = city.replace(/\b[a-z]/g, (x) => x.toUpperCase());

            history.push(city);
            localStorage.setItem("weatherHistory",JSON.stringify(history));
        }
    }
    dropList();
}

function dropList(){

    var histList = JSON.parse(localStorage.getItem("weatherHistory"));
    var listLen = histList.length;
    var z = 0;
    if(listLen>0){
        var content = "<option value='' disabled selected>Select your option</option>";
    }
    else{
        var content = "<option value='' disabled selected>No search history</option>";
    }
    while(z < listLen){
        content = content + "<option value='"+histList[z]+"'>"+histList[z]+"</option>";
        z = z+1;
    }
    document.getElementById("history").innerHTML = content;
}

function histSelect(){
    var selected = document.getElementById("history").value;
    document.getElementById("search").value = selected;
    begin();
}
var hist = document.getElementById("history");
hist.addEventListener("change", function (){
    histSelect();
});