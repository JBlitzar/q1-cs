function Person(attrs) {
  this.a = attrs;
  this.map = map;
  var lat = this.a["ZipLat"];
  lat = !!+lat ? lat : 0;
  var lon = this.a["ZipLong"];

  lon = !!+lon ? lon : 0;
  this.lat = lat;
  this.lon = lon;

  this.r = 5;
  this.speed = 0.0000001;

  this.label = `I was born in ${this.a["Birth Month"]}, and I travel by ${this.a["Commute"]}`;
  // console.log(this.a["ZipLat"])
  // console.log(lat)
  // console.log(lon)

  this.isGood = !!this.lat && !!this.lon;
  //console.log(this.isGood)

  this._parseTime = function (t) {
    var d = new Date();
    var time = t.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
    d.setMinutes(parseInt(time[2]) || 0);
    return d;
  };
}
function Point(lat, lon) {
  this.lat = lat;
  this.lon = lon;
  this.r = 5;
}

function Population(people) {
  this.people = people || [];

  this.time = new Date();
  this.time.setHours(0);
  this.time.setMinutes(0);
}
Population.prototype.addPerson = function (person) {
  if (person.isGood) {
    this.people.push(person);
  }
};

Population.prototype.update = function () {
  this.time.setMinutes(this.time.getMinutes() + 1);
  console.log(this.time);
  //document.getElementById("t").innerHTML = this.time;
};
