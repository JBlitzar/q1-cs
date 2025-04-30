function Planet(r, start, speed, name, pcolor) {
  this.r = r;
  this.start = start;
  this.speed = speed;
  this.name = name;
  this.x = this.r;
  this.y = 0;
  this.pcolor = pcolor;

  this.prevPositions = [];
  this.posMaxLen = 0; // 100 / this.speed * SCALE;
}

Planet.prototype.display = function () {
  fill(this.pcolor || "#fff");
  noStroke();
  ellipse(this.x, this.y, 20, 20);
  fill(0);
  stroke("#fff");
  strokeWeight(2);
  for (let i = 0; i < this.prevPositions.length; i += 3) {
    fill(255, 255, 255, 10);
    let pos = this.prevPositions[i];
    ellipse(pos.x, pos.y, (i * 2) / this.posMaxLen, (i * 2) / this.posMaxLen);
  }
  //text(this.name, this.x, this.y - 10)

  strokeWeight(1);
  noFill();
  stroke(255, 255, 255, 170); //this.pcolor
  ellipse(0, 0, this.r * 2, this.r * 2);

  fill(this.pcolor || "#fff");
  noStroke();
  ellipse(this.x, this.y, 20, 20);
};

Planet.prototype.update = function (t) {
  let angle = (this.start + this.speed * t) % 360;
  this.x = this.r * cos(radians(angle));
  this.y = this.r * sin(radians(angle));

  if (true) {
    this.prevPositions.push({ x: this.x, y: this.y });
  }

  // this.prevPositions.push({x: this.x, y: this.y});
  if (this.prevPositions.length > this.posMaxLen) {
    this.prevPositions.shift();
  }
  this.display();
};

Planet.prototype.text = function () {
  fill(this.pcolor);
  noStroke();
  ellipse(0, 0, 15, 15);
  fill(255);
  text(this.name, 10, 4);
};

Planet.ofTableRName = function (mensium, collectisRadix, r, name, pcolor) {
  omega = mensium[0] + mensium[1] + mensium[2] / 60 + mensium[3] / 3600;
  M_0 =
    collectisRadix[0] * 30 +
    collectisRadix[1] +
    collectisRadix[2] / 60 +
    collectisRadix[3] / 3600;

  return new Planet(r, M_0, omega, name, pcolor);
};

let earth;
let sun;
let saturn;
let jupiter;
let mars;
let venus;
let mercury;
let t = 0;
let SCALE = 1;
let TIMESCALE = 5;
let starPositions = [];
let planets = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  SCALE *= min(width / 2, height / 2) / 500;
  earth = new Planet(0, 0, 0, "Earth", color(0, 0, 255));
  sun = Planet.ofTableRName(
    [0, 0, 2, 0],
    [0, 0, 59, 8],
    93 * SCALE,
    "Sun",
    color(255, 255, 0)
  );
  saturn = Planet.ofTableRName(
    [0, 0, 2, 0],
    [3, 25, 51, 15],
    746 * SCALE,
    "Saturn",
    color(200, 160, 120)
  ); // millions of miles of distance from earth
  jupiter = Planet.ofTableRName(
    [0, 0, 4, 59],
    [11, 1, 39, 37],
    390 * SCALE,
    "Jupiter",
    color(255, 120, 0)
  );
  mars = Planet.ofTableRName(
    [0, 0, 31, 26],
    [7, 1, 24, 59],
    140 * SCALE,
    "Mars",
    color(255, 60, 0)
  );
  venus = Planet.ofTableRName(
    [0, 0, 37, 0],
    [1, 15, 28, 37],
    25 * SCALE,
    "Venus",
    color(230, 200, 190)
  );
  mercury = Planet.ofTableRName(
    [0, 3, 6, 24],
    [2, 13, 46, 18],
    57 * SCALE,
    "Mercury",
    color(120, 120, 120)
  );

  planets.push(earth);
  planets.push(sun);
  planets.push(saturn);
  planets.push(jupiter);
  planets.push(mars);
  planets.push(venus);
  planets.push(mercury);

  for (var i = 0; i < (width * height) / 3000; i++) {
    starPositions.push({
      x: random(-width / 2, width / 2),
      y: random(-height / 2, height / 2),
    });
  }
}

function draw() {
  translate(width / 2, height / 2);
  //scale(0.25)
  background("#000");
  stroke(255);
  strokeWeight(1);
  for (let i = 0; i < starPositions.length; i++) {
    let pos = starPositions[i];
    point(pos.x + (40 * mouseX) / width, pos.y + (40 * mouseY) / height);
  }
  fill(255);
  stroke(0);
  text(`Day ${t.toFixed(0)}`, -width / 2 + 10, -height / 2 + 20);

  earth.update(t);
  sun.update(t);
  saturn.update(t);
  jupiter.update(t);
  mars.update(t);
  venus.update(t);
  mercury.update(t);
  for (let i = 0; i < planets.length; i++) {
    let planet = planets[i];
    push();
    translate(-width / 2 + 20, i * 20 - height / 2 + 40);
    planet.text();
    pop();
  }

  // if(frameCount % TIMESCALE == TIMESCALE - 1){
  //   t += 1;
  // }
  t += 1 / TIMESCALE;
}
