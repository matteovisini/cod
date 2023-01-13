// firebase global variables
let db;
let database;
let scoreRef;
let scoreRef2;

//Variabile mousemove
let movimouse = 0;

//Dimesione Stella
let sommadiametri;
let keys = [];
let diametri;

let stelle;
let stars = [];

//geolocation
var locationData; //geolocation variable
let RoundUp = 0.01; //geolocation round up

//noise variable
let seed = 0;

//object name
let nomeutente;

let laptopLat;
let laptopLng;
let laptopAcc;

let submitcheck; // per ogni stella, incrementa quando il laptop non è vicino.
let fine; // se cambia, finisce il ciclo

let myLatStella;
let myLngStella;

// prime prove blob
let velocitàStella = 100

// prime prove blob
let kMaxBlob;
let kMaxNucleo
let step;
let n = 80; // number of blobs
let n2 = 20; // number of blobs
let radius = 0; // diameter of the circle
let inter = 0.5; // difference between the sizes of two blobs
let maxNoise  //grandezza
let maxNoisenucleo  //grandezza nucleo
let lapse = 0;    // timer
let noiseProg = (x) => (x);
let myColor 

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

// Retrieves circles on load and automatically on every database update (realtime database)
function getDiametro(data) {
  //get incoming data
  let somma;
  let incremento;
  let singoloDiametro;
  diametri = data.val();
  keys = Object.keys(diametri);
  maxNoise = 0;
  keys.forEach(function (key) {
/*     console.log(
      key,
      diametri[key].name,
      diametri[key].diametro,
      diametri[key].v1,
      diametri[key].v2,
      diametri[key].v3,
      diametri[key].lat,
      diametri[key].lng,
      diametri[key].acc
    ); */
    /* singoloDiametro = diametri[key].diametro;
    sommadiametri = sommadiametri + singoloDiametro; */
  });
}

function getStella(data) {
  //get incoming data
  stelle = data.val();
  stars = Object.keys(stelle);

  stars.forEach(function (key) {

    //checkStelle();
  });
}

//funzione crea stella
function submitStella() {
  let data = {
    latStella: laptopLat,
    lngStella: laptopLng,
    diametro: sommadiametri,
    check: 0,
  };
  const newStella = db.push(scoreRef2);
  db.set(newStella, data);
}

//setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  lat = locationData.latitude;
  lng = locationData.longitude;
  acc = locationData.accuracy;
  console.log("Your current position is:", lat, lng, "accuracy:", acc);
  checkStelle();

  colorMode(HSB);
	angleMode(DEGREES);
  kMaxBlob = random(0.1, 4.0);
  kMaxNucleo = random(0.1, 2.0);
  step = 0.01;
  myColor = random(0,360)
  


	kMaxCelle = random(0.1, 0.9);
  stepCelle = 0.01;
  
}

function draw() {
  seed++;
  background("#1e1e1e");
  textSize(20);
  textAlign(CENTER, CENTER);
  fill("white");
  text("Ci sono " + keys.length + " utenti", width / 2, height / 2 - 200);
  fill("blue");
  text("Utente: " + nomeutente, width / 2, height / 2 + 200);
  //rectMode(CENTER);
  //rect(width / 2, height / 2, sommadiametri, sommadiametri);
  drawStella()

  if (keys) {
    maxNoise = 0;
    keys.forEach(function (key) {
      fill(
        diametri[key].v1,
        diametri[key].v2,
        diametri[key].v3,
        100 - diametri[key].acc
      );
      let x = noise((seed + 1000 * diametri[key].v1) / 300) * windowWidth;
      let y = noise((seed - 1000 * diametri[key].v1) / 300) * windowHeight;
      let lat = diametri[key].lat;
      let lng = diametri[key].lng;

      if (lat <= laptopLat + RoundUp && lat >= laptopLat - RoundUp) {
        if (lng <= laptopLng + RoundUp && lng >= laptopLng - RoundUp) {
          let t = frameCount/150;
  let bright = 0;
          for (let i = nCelle; i > 0; i--) {
            strokeWeight(1);
            stroke(250 + bright, 60, 70);
    
            fill(250 + bright, 60, 70, alpha);
            let size = radiusCelle + i * interCelle;
            let k = kMaxCelle * sqrt(i / nCelle);
            let noisiness = maxNoiseCelle * (i / nCelle);
            cella(size, x, y, k, t - i * step, noisiness);
            bright = bright + 4 * 1.5
          }

          //circle(x, y, diametri[key].diametro);
          fill("black");
          textSize(12);
          text(diametri[key].name, x, y - 20);
          singoloDiametro = diametri[key].diametro;
          maxNoise = maxNoise + singoloDiametro;
          maxNoisenucleo = maxNoise/3
        }
      }

      if (mouseIsPressed === true) {
        var distance = dist(mouseX, mouseY, x, y);
        if (distance < diametri[key].diametro) {
          nomeutente = diametri[key].name;
        }
      }
    });
  }
}


function checkStelle() {
  //set laptop location
  laptopLat = locationData.latitude; //Cambia questo per forzare la tua lat
  laptopLng = locationData.longitude; //Cambia questo per forzare la tua lng
  laptopAcc = locationData.accuracy;

  fine = 0; // se cambia, finisce il ciclo

  if (stars) {
    stars.forEach(function (key) {
      myLatStella = stelle[key].latStella;
      myLngStella = stelle[key].lngStella;

      if (fine === 0) {
        if (laptopLat >= myLatStella - RoundUp && laptopLat <= myLatStella + RoundUp) {
          if (laptopLng >= myLngStella - RoundUp && laptopLng <= myLngStella + RoundUp) {
            console.log("Your closest star is:", laptopLat, laptopLng, laptopAcc);
            fine = 1;
          }
          else {
          console.log("there's nothing here")
        } ;
        }
      }
    })
  }
}

function drawStella() {
  //blob stella
  push();
  let t = frameCount/velocitàStella;
  for (let i = n; i > 0; i--) {
    strokeWeight(2);
    noFill();
    let alpha = 1 - noiseProg(i / n);
    stroke(myColor, 100, 90,0.2);
		let size = radius + i * inter;
		let k = kMaxBlob * sqrt(i/n);
		let noisiness = maxNoise * noiseProg(i / n);
    blob(size, width/2, height/2, k, t - i * step, noisiness);
  }
  pop();
  //nucleo stella
  push();
  for (let i = n2; i > 0; i--) {
    let alpha = 1 - noiseProg(i / n2);
    strokeWeight(1);
    step2 = 1;
    noStroke();
		fill(myColor, 100, 70,alpha);
		let size = radius + i * inter;
		let k = kMaxNucleo * sqrt(i/n2);
		let noisiness = maxNoisenucleo * noiseProg(i / n2);
    nucleo(size, width/2, height/2, k, t - i * step2, noisiness);
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
		r1 = cos(theta)*2;
		r2 = sin(theta)*2;
    let r = size + noise(k * r1,  k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}


function Celle() {
  
}

// By Roni Kaufman

let kMaxCelle;
let stepCelle;
let nCelle = 10; // number of blobs
let radiusCelle = 0; // diameter of the circle
let interCelle = 2; // difference between the sizes of two blobs
let maxNoiseCelle = 20;  //grandezza
let lapseCelle = 0;    // timer
let noiseProgCelle = (x) => (x);


function cella(size, xCenter, yCenter, k, t, noisiness) {
  beginShape();
	let angleStep = 360/60;
  for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
    let r1, r2;
		r1 = cos(theta)*2;
		r2 = sin(theta);
    let r = size + noise(k * r1,  k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}