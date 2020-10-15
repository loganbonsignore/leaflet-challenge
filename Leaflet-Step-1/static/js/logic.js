var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3
});

// Adding tile layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

// Grabbing our GeoJSON data..
d3.json(queryUrl, function(data) {
  console.log(data)
  // Function that will determine the color of a neighborhood based on the borough it belongs to
  function chooseSize(mag) {
    if (mag===0) {
      return 1;
    } return mag*4;
    }

  function chooseColor(depth) {
    if (depth>10) {
      return "red";
    } else if (depth>7) {
      return "yellow";
    } else if (depth>7) {
      return "orange";
    } else if (depth>3) {
      return "blue";
    } else if (depth<3) {
      return "purple";
    } else {
      return "green";
    }
  }

  function chooseStyle(feature) {
    return {
      color: "white",
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      fillOpacity: 1,
      opacity: 1,
      weight: 1.5,
      radius: chooseSize(feature.properties.mag)
    };
  }

  // Creating a geoJSON layer with the retrieved data
  var geojson = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng)
    },
    style: chooseStyle,
    onEachFeature: function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>Magnitude: "+feature.properties.mag+ "</p>");
    }
  }).addTo(myMap);
});

