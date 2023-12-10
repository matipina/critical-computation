//Access token
const access_key =
  "pk.eyJ1Ijoic2FyYWFzZGF1Z2JqZXJnIiwiYSI6ImNqbWhua2owMjJleTkzdnE0bDlzZHl6YmcifQ.QD5xpdK9hOwzH427mF5_4Q";

//Mapbox style
const style = "mapbox://styles/saraasdaugbjerg/cknpy20qj0t1t17rv7yohmayb";

// Options for map
const options = {
  lat: 40.7128,
  lng: -73.966,
  zoom: 12,
  style: style,
};

// Create an instance of MapboxGL
const mappa = new Mappa("MapboxGL", access_key);
var myMap;
var subway_lines_data;
var subway_stations_data;
var icon;
var font;
var iconWidth = 5;
var iconHeight = 5;
var poiPoints = [];
var showMap = true;
var showStations = true;
var showLines = true;
let stationsCheck;
let linesButton;

/* //
function preload() {
  subway_lines_data = loadJSON("data/subway_lines.geojson");
  subway_stations_data = loadJSON("data/subway_stations.geojson");

  icon = loadImage("assets/icon.png");
  font = loadFont("assets/Khmer Sangam MN.ttf");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(255);
  // Create a tile map and overlay the canvas.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  stationsCheck = createCheckbox("Show stations", true);
  stationsCheck.changed(() => (showStations === true) ? false : true);
} */

var loaded = false;

/* function draw() {
  clear();
  if (myMap.ready && !loaded) {
    loadLines();
    loadPoiCoord();
  }

  if (loaded) {
    for (let i = 0; i < poiPoints.length; i++) {
      var pos = myMap.latLngToPixel(poiPoints[i].lat, poiPoints[i].lng);

      poiPoints[i].updatePos(pos.x, pos.y, myMap.zoom());
      poiPoints[i].over(mouseX, mouseY);
      poiPoints[i].show();
    }
  }
} */

function loadLines() {
  let lines = subway_lines_data["features"];
  for (let i = 0; i < lines.length; i++) {
    let linePoints = lines[i].geometry.coordinates;
    for (let j = 0; j < linePoints.length; j++) {
      let linePoint = linePoints[j];
      let pos = myMap.latLngToPixel(
        linePoint[1],
        linePoint[0]
      );
      console.log('point:' + pos);
      push();
      fill('red');
      ellipse(pos.x, pos.y, 4, 4);
      pop();

    }
  }
}

function loadPoiCoord() {
  var pois = subway_stations_data["features"]; // Create an object that contains the features.
  //iterate trough the pois object. If it contains a PoI transform the latitude and longitude to pixels, and create a new instance of the class PoI
  for (let i = 0; i < pois.length; i++) {
    var pos = myMap.latLngToPixel(
      pois[i].geometry.coordinates[1],
      pois[i].geometry.coordinates[0]
    );

    // Creates an instance of PoI with the position data of every point fro the data
    var poi = new PoI(
      //lat, lng, x, y, w, h, title
      pois[i].geometry.coordinates[1],
      pois[i].geometry.coordinates[0],
      pos.x,
      pos.y,
      iconWidth,
      iconHeight,
      pois[i].properties.name
    );

    poiPoints.push(poi);
    loaded = true;
  }
}
