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
  createCanvas(windowWidth, windowHeight);
  

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

      //push object
      cells.push(
        new blob(sommacerchi, stelle[key].latStella, stelle[key].lngStella)
      );
    });
  }
  //mousemovecheck = 1;
}

//let geoxlaptop = 400;
//let geoylaptop = 400;

function draw() {
  background(50, 89, 100);
 
  fill("white");
  //circle(width / 2, height / 2, 30);
  //stars.forEach(function (key) {
  for (let m = 0; m < cells.length; m++) {
    push();
    translate(width / 2, height / 2);
    fill("white");
    cells[m].radialtrace();
    cells[m].display();
    pop();
  }
  //});
}

// Jitter class
class blob {
  constructor(sommacerchi, x, y) {
    //this.x = 500;
    //this.y = 510;
    this.x = x;
    this.y = y;
    this.diameter = sommacerchi;
    this.pcx = laptopLat;
    this.pcy = laptopLng;
    this.rand1 = random(180, 270);
    this.rand2 = random(0, 90);
    this.rand3 = random(90, 180);
    this.rand4 = random(0, -90);
    this.xdiff = this.x - this.pcx;
    this.ydiff = this.y - this.pcy;
    this.d = dist(this.pcx, this.pcy, this.x, this.y);
    // this.angle = atan(this.ydiff, this.xdiff) * (180 / 3, 14);
    // this.angle = 0;
  }

  radialtrace() {
    //console.log("MAMMA MIA");
    push();
    stroke("white");
    strokeWeight(0.1);
    noFill();
    circle(0, 0, this.d * 2 * 8);
    pop();
    //this.x += random(-this.speed, this.speed);
    // this.y += random(-this.speed, this.speed);
  }

  display() {
    push();
    //rotate(0);
    /* if (this.xdiff < 0 && this.ydiff < 0) {
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
    } */
    fill("white");
    stroke("red");
    strokeWeight(1);
    // line(0, 0, this.d / 2, 0);
    ellipse(
      this.xdiff * 8,
      this.ydiff * 8,
      this.diameter / 5,
      this.diameter / 5
    );

    pop();
  }
}