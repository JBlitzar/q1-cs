function Person(attrs){
    this.a = attrs;
    this.map = map;
    var lat = this.a["ZipLat"]
    lat = !!+lat ? lat : 0
    var lon = this.a["ZipLong"]

    lon = !!+lon ? lon : 0
    this.lat = lat
    this.lon = lon

    this.r = 5
    this.speed = 0.0000001

    this.label = `I was born in ${this.a["Birth Month"]}, and I travel by ${this.a["Commute"]}`
    // console.log(this.a["ZipLat"])
    // console.log(lat)
    // console.log(lon)

    this.isGood = !!this.lat && !!this.lon
    //console.log(this.isGood)

    this.pos = createVector(+this.lat, +this.lon);
    this.goal = createVector(+this.lat, +this.lon);

    this.velocity = createVector(0,0)

    this._parseTime = function( t ) {
        var d = new Date();
        var time = t.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
        d.setHours( parseInt( time[1]) + (time[3] ? 12 : 0) );
        d.setMinutes( parseInt( time[2]) || 0 );
        return d;
     }
     this.update = function(time){
    
        //console.log(this.a.obj["Departure Time"])
        //console.dir(this.a)
        if(this.a["Departure Time"]){
            if(time > this._parseTime(this.a["Departure Time"])){ // time to go!
                this.goal = createVector(37.560847, -122.381696) // nueva
                //console.log("go time!")
                // if(this.isGood){
                //     console.log(this.pos.dist(this.goal))
                // }
                
            }
    
        }
    
        
        
        if (
            this.isGood && dist(mouseX, mouseY, this.pixelPos.x, this.pixelPos.y) < this.r
          ) {
            text(this.label, this.pixelPos.x, this.pixelPos.y);
          }
    
        if(this.isGood && this.pos.dist(this.goal) > 0){
            //console.log(`${this.goal.sub(this.pos)} z`)
            this.addForce(
                this.goal.sub(this.pos)
                .normalize()
                .mult(this.speed)
                .mult(
                    this.pos.dist(this.goal) ** 2
                )
            )
            
        }
        //console.log(this.pos)
        if(this.isGood && this.pos){
            this.pos.add(this.velocity);
        // console.log(this.velocity)
        // console.log(this.pos)
        }
        this.velocity = createVector(0,0)
        
    }
     
}


Person.prototype.display = function(map){
    
    if(this.isGood){
        this.pixelPos = map.latLngToPixel(this.pos.x, this.pos.y)
        ellipse(this.pixelPos.x, this.pixelPos.y, this.r * 2, this.r * 2)
        
        //todo other attrs
    }
}
Person.prototype.addForce = function(f){
    this.velocity = this.velocity.add(f);
}
Person.prototype.compare = function(o){
    if(o.isGood && this.pos.dist(o.pos) < 0.01){
        this.addForce(o.velocity / 2);
    }
}






function Population(map, people){
    this.map = map;
    this.people = people || [];

    this.time = new Date();
    this.time.setHours(0)
    this.time.setMinutes(0)
}
Population.prototype.addPerson = function(person){
    this.people.push(person);
}

Population.prototype.update = function(map){
    this.time.setMinutes(this.time.getMinutes()+1)
    console.log(this.time)
    document.getElementById("t").innerHTML = this.time
    this.people.forEach(person => {
        person.display(map)
        this.people.forEach(o => {
            person.compare(o)
        })
        person.update(this.time)
        
    });
}