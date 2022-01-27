google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawVisualization);

function drawVisualization(hData,width) {
debugger;
    var x = "'" + hData + "'";
    // hData => hData.json();
    // hData = JSON.parse(hData);

    // Some raw data (not necessarily accurate)
    var data = google.visualization.arrayToDataTable([

        hData
    // ['Time', 'Temp', 'Rain'],
    // ['',  32,   0],
    // ['',  28,   1.2],
    // ['',  26,   2],
    // ['',  27,   0.5],
    // ['',  24,   0],
    // ['',  32,   0],
    // ['',  28,   1.2],
    // ['',  26,   2],
    // ['',  27,   0.5],
    // ['',  24,   0],
    // ['',  32,   0],
    // ['',  28,   1.2],
    // ['',  26,   2],
    // ['',  27,   0.5],
    // ['',  24,   0],
    // ['',  32,   0],
    // ['',  28,   1.2],
    // ['',  26,   2],
    // ['',  27,   0.5],
    // ['',  24,   0],
    // ['',  32,   0],
    // ['',  28,   1.2],
    // ['',  26,   2],
    // ['',  24,   0]
    ]);

    var options = {
    title : 'Next 24 Hours',
    seriesType: 'bars',
    series: {1: {type: 'line'}},
    alignment: 'center' ,
    legend: 'bottom',
    chartArea: {'width': width, 'height': '80%'},
    theme: 'maximized'
    };

    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}