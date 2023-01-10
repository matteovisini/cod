let cells = []; // array of Jitter objects

// firebase global variables
let db;
let database;
let scoreRef;

async function preload() {

  //geolocation function
  locationData =  getCurrentPosition();

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
  // define the callback function that will be called when
  // new data will arrive
  db.onValue(scoreRef, getDiametro);
}

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  // Create objects
  for (let i = 0; i < 20; i++) {
    cells.push(new blob());
  }

  //set laptop location
  laptopLat = locationData.latitude
  laptopLng = locationData.longitude
  laptopAcc = locationData.accuracy
  console.log(laptopLat,laptopLng,laptopAcc)
  
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
