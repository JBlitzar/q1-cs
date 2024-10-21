function Person(attrs){
    this.a = attrs;
    this.map = map;
    var lat = this.a["ZipLat"]
    lat = !!+lat ? lat : 0
    var lon = this.a["ZipLon"]

    lon = !!+lon ? lon : 0
    this.lat = lat
    this.lon = lon

    this.r = 5

    this.label = "meme"

    this.isGood = !!this.lat && !!this.lon
}


Person.prototype.display = function(map){
    console.log("po")
    if(this.isGood){
        this.pos = map.latLngToPixel(this.lat, this.long)
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2)
        //todo other attrs
    }
}

Person.prototype.update = function(){
    if (
        this.isGood && dist(mouseX, mouseY, this.pos.x, this.pos.y) > this.r
      ) {
        text(this.label, this.pos.x, this.pos.y);
      }
}


function Population(map, people){
    this.map = map;
    this.people = people || [];
}
Population.prototype.addPerson = function(person){
    this.people.push(person);
}

Population.prototype.update = function(map){
    console.log("po")
    this.people.forEach(person => {
        person.update()
        person.display(map)
    });
}