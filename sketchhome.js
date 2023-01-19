let kMax;
let step;
let n = 100; // number of blobs
let radius = 0; // diameter of the circle
let inter = 0.5; // difference between the sizes of two blobs
let maxNoise = 500; //grandezza
let maxNoisenucleo = maxNoise / 3; //grandezza nucleo
let lapse = 0; // timer
let noiseProg = (x) => x;

function setup() {
  let canva = createCanvas(windowWidth, windowHeight);
  canva.parent("canvasp5");
  colorMode(HSB);
  angleMode(DEGREES);
  //kMax = random(0.1, 4.0);
  step = 0.01;

  kMaxcella = random(0.2, 0.3);
  step2 = 0.01;
  myColorcella = random(360);
  randcella = random(7);
}

function draw() {
  push();
  background("#1b1b1b");

  kMax = map(mouseX, 0, width, 2, 4.0);
  let t = frameCount / 200;
  for (let i = n; i > 0; i--) {
    strokeWeight(3);
    noFill();
    let alpha = 1 - noiseProg(i / n);
    stroke(191, 5, 90, 0.2);
    let size = radius + i * inter;
    let k = kMax * sqrt(i / n);
    let noisiness = maxNoise * noiseProg(i / n);
    blob(size, width / 2, height / 2, k, t - i * step, noisiness);
  }
  /* for (let p = 0; p < 5; p++) {
    drawcella();
  } */

  pop();
}

function blob(size, xCenter, yCenter, k, t, noisiness) {
  beginShape();
  let angleStep = 360 / 40;
  for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
    let r1, r2;
    r1 = sin(theta);
    r2 = cos(theta);
    let r = size + noise(k * r1, k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  wi = windowWidth / 2;
  he = windowHeight / 2;
}

/* // By Roni Kaufman

let kMaxcella;
let step2;
let ncella = 10; // number of blobs
let radiuscella = 0; // diameter of the circle
let intercella = 0; // difference between the sizes of two blobs
let maxNoisecella = 300; //grandezza
let lapsecella = 0; // timer
let myColorcella;
let randcella;
let seed = 0;

function drawcella() {
  let t = frameCount / 80;
  let bright = 0;
  for (let i = ncella; i > 0; i--) {
    seed++;
    let x2 = noise(((seed + 1000) / 1000) * 2) * windowWidth;
    let y2 = noise(((seed - 1000) / 1000) * 2) * windowHeight;
    let x3 = noise((seed + 1000) / 1000 / 2) * windowWidth;
    let y3 = noise((seed - 1000) / 1000 / 2) * windowHeight;
    let x4 = noise((seed + 1000) / 1000) * windowWidth;
    let y4 = noise((seed - 1000) / 1000) * windowHeight;
    let x5 = noise((seed + 1000) / 1000) * windowWidth;
    let y5 = noise((seed - 1000) / 1000) * windowHeight;
    let x6 = noise((seed + 1000) / 1000) * windowWidth;
    let y6 = noise((seed - 1000) / 1000) * windowHeight;
    noStroke();
    fill(myColorcella, 60 - bright, 70 + bright);
    let size = radiuscella + i * intercella;
    let k = kMaxcella * sqrt(i / n);
    let noisiness = maxNoisecella * (i / n);
    nucleo(size, x2, y2, k, t - i * step2, noisiness);
    nucleo(size, x3, y3, k, t - i * step2, noisiness);
    nucleo(size, x4, y4, k, t - i * step2, noisiness);
    nucleo(size, x5, y5, k, t - i * step2, noisiness);
    nucleo(size, x6, y6, k, t - i * step2, noisiness);

    bright = bright + 6;
  }
}

function nucleo(size, xCenter, yCenter, k, t, noisiness) {
  beginShape();
  let angleStep = 360 / 200;
  for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
    let r1, r2;
    r1 = cos(theta) + 2 * 10;
    r2 = sin(theta) + 2 * 10;
    let r = size + noise(k * r1, k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}
 */
