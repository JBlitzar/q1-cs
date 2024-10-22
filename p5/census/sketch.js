let myMap;
let canvas;
const mappa = new Mappa('Leaflet');
var table;
var rows;
var pop;

function preload(){

  // TODO: change FILENAME to your actual file name
 table = loadTable("census.csv", "csv", "header");

}

// puts all our options in a single object 
// 1. lat and lng are the starting point for the map - change these if you want the map to start somewhere else
// 2. if you want to make it more zoomed in, change the zoom level
const options = {
  lat: -40,
  lng: 55,
  zoom: 0.5, 
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

function setup(){
  canvas = createCanvas(640,640); 
  
  // turn the data table into an array (list) of rows
  rows = table.getRows();

  // create a tile map with the options above
  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas);
  pop = new Population();
  // go through the data one row at a time
  for (var r = 0; r < rows.length; r++) {

    pop.addPerson(new Person( rows[r].obj))
    
    
  }
}

function draw(){
  // clears the background so the map is clearly seen at each frame.
  clear();

  pop.update(myMap)
}