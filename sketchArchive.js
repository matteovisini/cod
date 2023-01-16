let cells = []; // array of objects

// firebase global variables
let db;
let database;
let scoreRef;
let scoreRef2;

let keys = [];
let diametri;

let stelle;
let stars = [];

//geolocation
var locationData; //geolocation variable
let RoundUp = 0.01; //geolocation round up

async function preload() {
  //geolocation function
  locationData = getCurrentPosition();

  // load firebase app module
  // it will be loaded in a variable called initializeApp
  const fb_app = "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  const { initializeApp } = await import(fb_app);

  // loading firebase database module
  // it will be loaded in a variable called "db"
  const fb_database =
    "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
  db = await import(fb_database);

  // Your web app's Firebase configuration
  // You can get this information from the firebase console
  const firebaseConfig = {
    apiKey: "AIzaSyC1IubDRSH_td2dhYjoOl4aEU_wwokxUB8",
    authDomain: "cc-g6-ac9e8.firebaseapp.com",
    databaseURL:
      "https://cc-g6-ac9e8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cc-g6-ac9e8",
    storageBucket: "cc-g6-ac9e8.appspot.com",
    messagingSenderId: "756444762037",
    appId: "1:756444762037:web:f4e6784ab4561dd53513fc",
    measurementId: "G-X8FH1YXKXD",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Database
  database = db.getDatabase(app);
  // The reference to database key where we store data
  // we use this both for reading and writing
  scoreRef = db.ref(database, "diametri");
  scoreRef2 = db.ref(database, "stelle");
  // define the callback function that will be called when
  // new data will arrive
  db.onValue(scoreRef, getDiametro);
  db.onValue(scoreRef2, getStella);
}

function getDiametro(data) {
  //get incoming data
  diametri = data.val();
  keys = Object.keys(diametri);
  console.log("la funzione getDiametro è partita");
}

function getStella(data) {
  //get incoming data
  stelle = data.val();
  stars = Object.keys(stelle);
  console.log("la funzione getStella è partita");
}

let sommacerchi;

let laptopLat;
let laptopLng;
let laptopAcc;

function setup() {
  angleMode(DEGREES);
  colorMode(HSB);
  createCanvas(windowWidth, windowHeight);
   slider()

  //set laptop location
  laptopLat = locationData.latitude;
  laptopLng = locationData.longitude;
  laptopAcc = locationData.accuracy;
  // Create objects

  //stars.forEach(function (key) {
}
let mousemovecheck = 0;
function arraycreation() {
  if (mousemovecheck == 0) {
    stars.forEach(function (key) {
      sommacerchi = 0;
      let latstar = stelle[key].latStella;
      let lngstar = stelle[key].lngStella;
      //let starColor = stelle[key].starColor;
      keys.forEach(function (key) {
        //condizione se posizione è uguale a posizione stella
        if (
          diametri[key].lat <= latstar + RoundUp &&
          diametri[key].lat >= latstar - RoundUp
        ) {
          if (
            diametri[key].lng <= lngstar + RoundUp &&
            diametri[key].lng >= lngstar - RoundUp
          ) {
            sommacerchi = sommacerchi + diametri[key].diametro;
          }
        }
      });
      //console.log(sommacerchi);
      //push object
      //fill(starColor);
      push();
      translate(width / 2, height / 2);
      rotate(270);
      drawStella(
        stelle[key].latStella,
        stelle[key].lngStella,
        stelle[key].starColor,
        stelle[key].starType,
        sommacerchi
      );
      pop();
    });
  }
  //mousemovecheck = 1;
}

//let geoxlaptop = 400;
//let geoylaptop = 400;

function draw() {
  background("#cdcdcd"); //background
  arraycreation();
  fill("white");
  scale = slider.value()*120
  maxNoise = slider.value()
  maxNoisenucleo = maxNoise / 2;
  if (slider.value() < 30) {
    inter = 0.2;
  }
  else {inter=0.5}
  
 
  //circle(width / 2, height / 2, 30);
  //stars.forEach(function (key) {
  //});
}

let kMax;
let step;
let n = 80; // number of blobs
let n2 = n / 5;
let radius = 0; // diameter of the circle
let inter // difference between the sizes of two blobs
let maxNoise //grandezza
let maxNoisenucleo//grandezza nucleo
let lapse = 0; // timer
let noiseProg = (x) => x;
//let myColor;
let disegno;
let velocitàStella = 200;
let scale //= 1000;

function drawStella(sx, sy, scolore, stipo, sommacerchi) {
  //blob
  let stellax = sx;
  let stellay = sy;
  let colore = scolore;
  let tipo = stipo;
  let xdiff = stellax - laptopLat;
  let ydiff = stellay - laptopLng;
  let diameter = sommacerchi;
  let d = dist(stellax, stellay, laptopLat, laptopLng);
  
  push();
  stroke("#4d4d4d");
  strokeWeight(0.1);
  noFill();
  
  circle(0, 0, d * 2 * scale);
  pop();
  //blob 
  push();
  let t = frameCount/velocitàStella;
  for (let i = n; i > 0; i--) {
    console.log ("blob sta disegnando")
    strokeWeight(2);
    noFill();
    step = 0.01
    let alpha = 1 - noiseProg(i / n);
    stroke(colore, 100, 90,0.2);
		let size = radius + i * inter;
		let k = tipo * sqrt(i/n);
		let noisiness = maxNoise * noiseProg(i / n);
    blob(size, xdiff * scale, ydiff * scale, k, t - i * step, noisiness);
  }
  pop();

  // nucleo
  push();

  for (let i = n2; i > 0; i--) {
    let alpha = 1 - noiseProg(i / n2);
    strokeWeight(1);
    step2 = 1;
    noStroke();
    fill(colore, 100, 70, alpha);
    let size = radius + i * inter;
    let k = tipo * sqrt(i / n2);
    let noisiness = maxNoisenucleo * noiseProg(i / n2);
    nucleo(size, xdiff * scale, ydiff * scale, k, t - i * step2, noisiness);
  }
  pop();
}

function blob(size, xCenter, yCenter, k, t, noisiness) {
  beginShape();
	let angleStep = 360 / 40;
  for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
    let r1, r2;
		r1 = sin(theta);
		r2 = cos(theta);
    let r = size + noise(k * r1,  k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}

function nucleo(size, xCenter, yCenter, k, t, noisiness) {
  beginShape();
  let angleStep = 360 / 120;
  for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
    let r1, r2;
    r1 = cos(theta) * 2;
    r2 = sin(theta) * 2;
    let r = size + noise(k * r1, k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
  wi = windowWidth / 2;
  he = windowHeight / 2;
}

function slider() {
  slider = createSlider(10, 80, 80);
  slider.position( windowWidth - 100, windowHeight - 50);
  slider.style('width', '80px');

}
