let cells = []; // array of Jitter objects

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  // Create objects
  for (let i = 0; i < 20; i++) {
    cells.push(new blob());
  }
}

let geoxlaptop = 400;
let geoylaptop = 400;

function draw() {
  background(50, 89, 100);
  fill("white");
  circle(width / 2, height / 2, 30);
  for (let i = 0; i < cells.length; i++) {
    push();
    translate(width / 2, height / 2);
    fill("white");
    cells[i].move();
    cells[i].display();
    pop();
  }
}

// Jitter class
class blob {
  constructor() {
    //this.x = 500;
    //this.y = 510;
    this.x = random(width);
    this.y = random(height);
    this.diameter = random(10, 30);
    this.geox = geoxlaptop;
    this.geoy = geoylaptop;
    this.d;
    this.rand1 = random(180, 270);
    this.rand2 = random(0, 90);
    this.rand3 = random(90, 180);
    this.rand4 = random(0, -90);
    this.xdiff = this.x - this.geox;
    this.ydiff = this.y - this.geoy;
    // this.angle = atan(this.ydiff, this.xdiff) * (180 / 3, 14);
    // this.angle = 0;
  }

  move() {
    this.d = dist(this.geox, this.geoy, this.x, this.y);
    stroke("white");
    strokeWeight(0.1);
    noFill();
    circle(0, 0, this.d * 2);
    //this.x += random(-this.speed, this.speed);
    // this.y += random(-this.speed, this.speed);
  }

  display() {
    push();
    //rotate(0);
    if (this.xdiff < 0 && this.ydiff < 0) {
      rotate(this.angle);
    }
    if (this.xdiff > 0 && this.ydiff > 0) {
      rotate(this.angle);
    }
    if (this.xdiff < 0 && this.ydiff > 0) {
      rotate(this.angle);
    }
    if (this.xdiff > 0 && this.ydiff < 0) {
      rotate(this.angle);
    }
    fill("white");
    stroke("red");
    strokeWeight("3");
    // line(0, 0, this.d / 2, 0);
    ellipse(this.xdiff, this.ydiff, this.diameter, this.diameter);

    pop();
  }
}
