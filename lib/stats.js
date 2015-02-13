(function () {
  "use strict"

  require.config({
    shim: {
      "jquery": ["lib/jquery"]
    }
  })

}())

define("stats", [
  "jquery"
], function() {
    "use strict"
    $.ajax({
        url: "nodes.json",
        dataType: "json"
    }).done(function(jsondata) {
        jsondata = jsondata.nodes

        var routers = {}
        for (var node in jsondata) {
            if (routers.hasOwnProperty(jsondata[node].hardware))
                routers[jsondata[node].hardware] += 1
            else
                routers[jsondata[node].hardware] = 1
        }

        var firmwares = {}
        for (var node in jsondata) {
            if (firmwares.hasOwnProperty(jsondata[node].firmware))
                firmwares[jsondata[node].firmware] += 1
            else
                firmwares[jsondata[node].firmware] = 1
        }

        var gluons = {}
        for (var node in jsondata) {
            if (gluons.hasOwnProperty(jsondata[node].gluon_base))
                gluons[jsondata[node].gluon_base] += 1
            else
                gluons[jsondata[node].gluon_base] = 1
        }

        var gateways = {}
        $.each( jsondata, function( key, val ) {
            if (val.gateway)
                try {
                    var gateway = val.gateway
                    if (isNaN(gateways[gateway])) gateways[gateway] = 0

                    gateways[gateway] += 1
                } catch (e) {}
        })

        google.load("visualization", "1", {packages: ["corechart"], callback: drawHardware})
        google.load("visualization", "1", {packages: ["corechart"], callback: drawFirmwares})
        google.load("visualization", "1", {packages: ["corechart"], callback: drawGluons})
        google.load("visualization", "1", {packages: ["corechart"], callback: drawGateways})

        var datalist = []
        datalist.push(["Modell", "Anzahl"])

        for (var router in routers) {
            datalist.push([router, routers[router]])
        }

        var firmwarestats = []
        firmwarestats.push(["Firmware", "Anzahl"])
        for (var firmware in firmwares) {
            firmwarestats.push([firmware, firmwares[firmware]])
        }

        var gluonstats = []
        gluonstats.push(["Gluon Version", "Anzahl"])
        for (var base in gluons) {
            gluonstats.push([base, gluons[base]])
        }

        var gatewaystats = []
        gatewaystats.push(["Gateway", "Anzahl"])
        for (var gate in gateways) {
            gatewaystats.push([gate, gateways[gate]])
        }

        function drawHardware() {
            var data = google.visualization.arrayToDataTable(datalist)
            var options = {
                title: "Router Statistik",
                vAxis: {titleTextStyle: {color: "red"}},
                chartArea: {width: "50%"}
            }
            var chart = new google.visualization.BarChart(document.getElementById("chart_div"))
            chart.draw(data, options)
        }

        function drawFirmwares() {
            var data = google.visualization.arrayToDataTable(firmwarestats)
            var options = {
                title: "Firmware Statistik",
                vAxis: {titleTextStyle: {color: "red"}}
            }
            var chart = new google.visualization.PieChart(document.getElementById("chart_div2"))
            chart.draw(data, options)
        }

        function drawGluons() {
            var data = google.visualization.arrayToDataTable(gluonstats)
            var options = {
                title: "Gluon Statistik",
                vAxis: {titleTextStyle: {color: "red"}}
            }
            var chart = new google.visualization.PieChart(document.getElementById("chart_div3"))
            chart.draw(data, options)
        }

        function drawGateways() {
            var data = google.visualization.arrayToDataTable(gatewaystats)
            var options = {
                title: "Gateway Verteilung",
                vAxis: {titleTextStyle: {color: "red"}}
            }
            var chart = new google.visualization.BarChart(document.getElementById("chart_div4"))
            chart.draw(data, options)
        }
    })
})
