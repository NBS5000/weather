google.charts.load('current', {'packages':['corechart']});

function drawVisualization(hData,width) {
    var x = "'" + hData + "'";
    console.log(hData);
    console.log(parseInt(width));
    var data = google.visualization.arrayToDataTable(
        hData
    );
    var options = {
    seriesType: 'bars',
    series: {1: {type: 'line'}},
    alignment: 'center' ,
    legend: 'none',
    chartArea: {'width': width, 'height': '80%'},
    theme: 'maximized',
    colors: ['rgb(255,127,39)', 'rgb(0,162,232)']
    };
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

window.addEventListener('resize', function(event) {
    var dt = JSON.parse(localStorage.getItem("hourly"));
    var wid = Math.round((screen.width *0.9));
    drawVisualization(dt,wid);
}, true);
