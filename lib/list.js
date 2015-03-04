(function () {
  "use strict"

  require.config({
    shim: {
      "jquery": ["lib/jquery"],
      "lib/jquery.tablesorter": ["jquery"]
    }
  })

}())

define("list", [
  "lib/d3",
  "jquery",
  "loader",
  "config",
  "lib/jquery.tablesorter"
], function (d3, $, loadNodes, ffmapConfig) {

  "use strict"

  function nicedate(timestamp) {
    var firstsplit = timestamp.split("T")
    var datesplit = firstsplit[0].split("-")
    var timesplit = firstsplit[1].split(":")
    var res = datesplit[2] + "." + datesplit[1] + "." + datesplit[0] + " " + timesplit[0] + ":" + timesplit[1] + " (CET)"
    return res
  }

  function nodetable(table, fn) {
    var thead, tbody, tfoot

    function prepare() {
      thead = table.append("thead")
      tbody = table.append("tbody")
      tfoot = table.append("tfoot")

      var tr = thead.append("tr")

      tr.append("th").text("Name")
      tr.append("th").text("Status")
      tr.append("th").text("Clients")
      tr.append("th").text("WLAN Links")
      tr.append("th").text("VPN")
      tr.append("th").text("Geo")
      tr.append("th").text("Hardware")
      tr.append("th").text("Firmware")
      tr.append("th").text("Autoupdate")
      tr.append("th").text("Branch")
      tr.append("th").text("Batman Version")
      tr.append("th").text("Last Contact")
    }

    function update(data) {
      var nonClients = data.nodes.filter(function (d) { return (!d.system.role || d.system.role === "node") })
      var doc = tbody.selectAll("tr").data(nonClients)
      var date = nicedate(data.meta.timestamp)
      var row = doc.enter().append("tr")

      row.classed("online", function (d) { return d.flags.online })

      row.append("td").text(function (d) { return d.name ? d.name : d.id })
      row.append("td").text(function (d) { return d.flags.online ? parseInt(d.uptime / 3600) + "h" : "offline" })
      row.append("td").text(function (d) { return d.clientcount })
      row.append("td").text(function (d) { return d.wifilinks.length })
      row.append("td").text(function (d) { return d.vpns.length })
      row.append("td").text(function (d) { return d.geo ? "ja" : "nein" })
      row.append("td").text(function (d) { return d.hardware })
      row.append("td").text(function (d) { return d.firmware })
      row.append("td").text(function (d) { return d.autoupdater_state ? "ja" : "nein" })
      row.append("td").text(function (d) { return d.autoupdater_branch })
      row.append("td").text(function (d) { return d.batman_version })
      row.append("td").text(function (d) { return new Date(d.lastseen * 1000).toLocaleString() })

      var foot = tfoot.append("tr")
      foot.append("td").text("Summe")
      foot.append("td").text(nonClients.reduce(function(old, node) { return old + node.flags.online }, 0) + " / " + nonClients.length)
      foot.append("td").text(nonClients.reduce(function(old, node) { return old + node.clientcount }, 0))
      foot.append("td").attr("colspan", 4).style("text-align", "right").text("Zuletzt aktualisiert: " + date)

      $("#nodelist").tablesorter({sortList: [[0,0]]})
    }
    prepare()

    var nodesStream = loadNodes(fn)

    nodesStream.take(1).onValue(update)
  }

  function backbonetable(table, fn) {
    var thead, tbody, tfoot

    function prepare() {
      thead = table.append("thead")
      tbody = table.append("tbody")
      tfoot = table.append("tfoot")

      var tr = thead.append("tr")

      tr.append("th").text("Name")
      tr.append("th").text("Status")
      tr.append("th").text("Clients")
      tr.append("th").text("WLAN Links")
      tr.append("th").text("VPN")
      tr.append("th").text("Geo")
      tr.append("th").text("Hardware")
      tr.append("th").text("Firmware")
      tr.append("th").text("Autoupdate")
      tr.append("th").text("Branch")
      tr.append("th").text("Batman Version")
      tr.append("th").text("Last Contact")
    }

    function update(data) {
      var nonBbones = data.nodes.filter(function (d) { return d.system.role === "backbone" })
      var doc = tbody.selectAll("tr").data(nonBbones)
      var date = nicedate(data.meta.timestamp)
      var row = doc.enter().append("tr")

      row.classed("online", function (d) { return d.flags.online })

      row.append("td").text(function (d) { return d.name ? d.name : d.id })
      row.append("td").text(function (d) { return d.flags.online ? parseInt(d.uptime / 3600) + "h" : "offline" })
      row.append("td").text(function (d) { return d.clientcount })
      row.append("td").text(function (d) { return d.wifilinks.length })
      row.append("td").text(function (d) { return d.vpns.length })
      row.append("td").text(function (d) { return d.geo ? "ja" : "nein" })
      row.append("td").text(function (d) { return d.hardware })
      row.append("td").text(function (d) { return d.firmware })
      row.append("td").text(function (d) { return d.autoupdater_state ? "ja" : "nein" })
      row.append("td").text(function (d) { return d.autoupdater_branch })
      row.append("td").text(function (d) { return d.batman_version })
      row.append("td").text(function (d) { return new Date(d.lastseen * 1000).toLocaleString() })

      var foot = tfoot.append("tr")
      foot.append("td").text("Summe")
      foot.append("td").text(nonBbones.reduce(function(old, node) { return old + node.flags.online }, 0) + " / " + nonBbones.length)
      foot.append("td").text(nonBbones.reduce(function(old, node) { return old + node.clientcount }, 0))
      foot.append("td").attr("colspan", 4).style("text-align", "right").text("Zuletzt aktualisiert: " + date)

      $("#backbonelist").tablesorter({sortList: [[0,0]]})
    }
    prepare()

    var nodesStream = loadNodes(fn)

    nodesStream.take(1).onValue(update)
  }

  function gwtable(table, fn) {
    var thead, tbody, tfoot

    function prepare() {
      thead = table.append("thead")
      tbody = table.append("tbody")
      tfoot = table.append("tfoot")

      var tr = thead.append("tr")

      tr.append("th").text("Name")
      tr.append("th").text("Status")
      tr.append("th").text("VPN")
      tr.append("th").text("Geo")
      tr.append("th").text("Hardware")
      tr.append("th").text("OS")
      tr.append("th").text("Batman Gateway Mode")
      tr.append("th").text("Batman Version")
      tr.append("th").text("Last Contact")
    }

    function update(data) {
      var nonGates = data.nodes.filter(function (d) { return d.system.role === "gateway" })
      var doc = tbody.selectAll("tr").data(nonGates)
      var date = nicedate(data.meta.timestamp)
      var row = doc.enter().append("tr")

      row.classed("online", function (d) { return d.flags.online })

      row.append("td").text(function (d) { return d.name ? d.name : d.id })
      row.append("td").text(function (d) { return d.flags.online ? parseInt(d.uptime / 3600) + "h" : "offline" })
      row.append("td").text(function (d) { return d.vpns.length })
      row.append("td").text(function (d) { return d.geo ? "ja" : "nein" })
      row.append("td").text(function (d) { return d.hardware })
      row.append("td").text(function (d) { return d.firmware })
      row.append("td").text(function (d) { return d.batman_gwmode })
      row.append("td").text(function (d) { return d.batman_version })
      row.append("td").text(function (d) { return new Date(d.lastseen * 1000).toLocaleString() })

      var foot = tfoot.append("tr")
      foot.append("td").text("Summe")
      foot.append("td").text(nonGates.reduce(function(old, node) { return old + node.flags.online }, 0) + " / " + nonGates.length)
      foot.append("td").attr("colspan", 3).style("text-align", "right").text("Zuletzt aktualisiert: " + date)

      $("#gwlist").tablesorter({sortList: [[0,0]]})
    }
    prepare()

    var nodesStream = loadNodes(fn)

    nodesStream.take(1).onValue(update)
  }

  function srvtable(table, fn) {
    var thead, tbody, tfoot

    function prepare() {
      thead = table.append("thead")
      tbody = table.append("tbody")
      tfoot = table.append("tfoot")

      var tr = thead.append("tr")

      tr.append("th").text("Name")
      tr.append("th").text("Status")
      tr.append("th").text("VPN")
      tr.append("th").text("Geo")
      tr.append("th").text("Hardware")
      tr.append("th").text("OS")
      tr.append("th").text("Batman Version")
      tr.append("th").text("Last Contact")
    }

    function update(data) {
      var nonSrvs = data.nodes.filter(function (d) { return d.system.role === "service" })
      var doc = tbody.selectAll("tr").data(nonSrvs)
      var date = nicedate(data.meta.timestamp)
      var row = doc.enter().append("tr")

      row.classed("online", function (d) { return d.flags.online })

      row.append("td").text(function (d) { return d.name ? d.name : d.id })
      row.append("td").text(function (d) { return d.flags.online ? parseInt(d.uptime / 3600) + "h" : "offline" })
      row.append("td").text(function (d) { return d.vpns.length })
      row.append("td").text(function (d) { return d.geo ? "ja" : "nein" })
      row.append("td").text(function (d) { return d.hardware })
      row.append("td").text(function (d) { return d.firmware })
      row.append("td").text(function (d) { return d.batman_version })
      row.append("td").text(function (d) { return new Date(d.lastseen * 1000).toLocaleString() })

      var foot = tfoot.append("tr")
      foot.append("td").text("Summe")
      foot.append("td").text(nonSrvs.reduce(function(old, node) { return old + node.flags.online }, 0) + " / " + nonSrvs.length)
      foot.append("td").attr("colspan", 3).style("text-align", "right").text("Zuletzt aktualisiert: " + date)

      $("#srvlist").tablesorter({sortList: [[0,0]]})
    }
    prepare()

    var nodesStream = loadNodes(fn)

    nodesStream.take(1).onValue(update)
  }

  nodetable(d3.select("#nodelist"), ffmapConfig.nodesJSON)
  gwtable(d3.select("#gwlist"), ffmapConfig.nodesJSON)
  srvtable(d3.select("#srvlist"), ffmapConfig.nodesJSON)
  backbonetable(d3.select("#backbonelist"), ffmapConfig.nodesJSON)
})
