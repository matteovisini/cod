// Elementi pagina
let nameInput;
let submitButton;
let button;
let diametro 

// firebase global variables
let db;
let database;
let scoreRef;
let scoreRef2;

//elementi pianeti per database
let keys = []; 
let diametri;
let startingPoing;
let lat;
let lng;
let acc;

//elementi stelle per database
let stelle;
let stars = [];
let sommadiametri = 5;
let stelleDatabase = 1;

// Geolocation variables
var locationData;
let RoundUp = 0.01
let fakeLat //solo per cambiare velocemente, da togliere alla fine
let fakeLng //solo per cambiare velocemente, da togliere alla fine

var currentHour
let startingPos
let creationDate
let currentDate
 
let threshold = 30

async function preload() {

  // Inizializzo Geolocalizzazione
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
  //db.onValue(scoreRef, getDiametro);

  scoreRef2 = db.ref(database, "stelle")
  // define the callback function that will be called when
  // new data will arrive
  db.onValue(scoreRef, getDiametro);
  db.onValue(scoreRef2, getStella);
}

//funzione ricezione dati pianeti
function getDiametro(data) {
  diametri = data.val();
  keys = Object.keys(diametri);
}
//funzione ricezione dati stelle
function getStella(data) {
  stelle = data.val();
  stars = Object.keys(stelle);
}


function deviceShaken() {
  submitDiametro()
}

function setup() {
  fakeLat = 0//+ random (-0.5, +0.5)//solo per cambiare velocemente, da togliere alla fine
  fakeLng = 0//+ random (-0.5, +0.5)//solo per cambiare velocemente, da togliere alla fine
  setShakeThreshold(threshold)
let canva =createCanvas(windowWidth, windowHeight);
  canva.parent("canvasp5");
  colorMode(HSB);
  lat = locationData.latitude + fakeLat//Cambia questo per forzare la tua lat
  lng = locationData.longitude+ fakeLng//Cambia questo per forzare la tua lng
  acc = locationData.accuracy
  console.log("Your current position is:",lat,lng,"accuracy:",acc)
  startingPos = random(255)
  diametro = 5;

  createP("Click the button to get points");
  button = createButton("click");
  button.mousePressed(increaseDiametro); // aumento diametro

  nameInput =createInput();
  nameInput.parent("nameInput");

  submitButton = createButton("submit");
  submitButton.mousePressed(submitDiametro);
 

  //randomcolor
  startingPoint = random(255);

	angleMode(DEGREES);
	kMax = random(0.2, 0.3);
	step = 0.01;
  cellColor = random(360); 
  cellDimension = round(random(20))

  rand = random(7);

  
  console.log(currentHour)
  oraEsatta()
var currentYear = year();
  var currentMonth = month();
  var currentDay = day();
 currentDate =  nf(currentMonth, 2) + '-' + nf(currentDay, 2) + '-' + currentYear ;
  console.log(currentDate)
}

function draw() {
  background(200);
  textSize(100);
  circle(width / 2, height / 2, diametro);
  drawCella()
}


let starColor
let starBrightness
let starType

//funzione check se stella con quella posizione è già nel database
function checkStelle() {
  //set laptop location
 
  laptopLat = lat //Cambia questo per forzare la tua lat
  laptopLng = lng //Cambia questo per forzare la tua lng
  laptopAcc = acc

  // variabili per controllare il ciclo
  submitcheck = 0; // per ogni stella, incrementa quando il laptop non è vicino.
  fine = 0; // se cambia, finisce il ciclo

  if (stars) {
    

    stars.forEach(function (key) {
      myLatStella = stelle[key].latStella;
      myLngStella = stelle[key].lngStella;
      console.log("Stelle analizzata:", stelleDatabase);

      if (fine === 0) {
        stelleDatabase++
        if (laptopLat >= myLatStella - RoundUp && laptopLat <= myLatStella + RoundUp) {
          if (laptopLng >= myLngStella - RoundUp && laptopLng <= myLngStella + RoundUp) {
            console.log("location already in the dataset");
            submitcheck = 0;
            fine = 1;
          }
        } else {
          submitcheck++;
        }
      }
    });
    if (submitcheck > 0) {
      console.log(
        "new star in this location:",
        laptopLat,
        laptopLng,
        laptopAcc
      );

      submitStella();
    }
  }
}
let starName
//funzione crea stella
function submitStella() {
  starColor = round(random(18)) * 20;
  starBrightness = round (random(60,80))
  //starColor = round(random(180))+round(random(180))
  starType = random(0.6, 6)
  

  switch (round(starType)) {
    case 1:
      starName = "Malassezia furfur"
      break;
    case 2:
      starName = "Entomophaga maimaiga"
      break;
    case 3:
      starName = "Aspergillus aculeatinus"
      break;
    case 4:
      starName = "Trichophyton rubrum"
    case 5:
      starName = "Piptocephalidaceae"
    case 6:
      starName = "Chondrostereum purpureum"
      
      break;
  }
  let data = {
    creatorName:nameInput.value(),
    creationDate: currentDate,
    latStella:laptopLat,
    lngStella: laptopLng,
    accStella: laptopAcc,
    starColor: starColor,
    starBrightness:starBrightness,
    starType: starType,
    starName:starName
    

  };
  const newStella = db.push(scoreRef2);
db.set(newStella, data);
}

//funzione aumento diametro
function increaseDiametro() {
  diametro++;
}

//funzione push del bottone
function submitDiametro() {
  let data = {
    name: nameInput.value(),
    startingPos: startingPos,
    creationDate: currentDate,
    incrementoBright: incrementoBright,
    cellColor: cellColor,
    cellDimension:cellDimension,
    diametro: diametro,
    lat: lat,
    lng: lng,
    acc: acc
  };

  // create a new entry
  const newDiametro = db.push(scoreRef);
  // add the data to it
  db.set(newDiametro, data);
  // initialize score variable
  diametro = 0;
  // crea nuova stella al push del bottone
  checkStelle() 
}





let kMax;
let step;
let n = 10; // number of blobs
let radius = 0; // diameter of the circle
let inter = 0; // difference between the sizes of two blobs
let maxNoise ;  //grandezza
let lapse = 0;    // timer
let cellColor;
let rand;
let incrementoBright 
let cellDimension

function drawCella() {
  background("#1e1e1e");
  maxNoise = 300 + (cellDimension*20)

  let t = frameCount/80;
  let bright = 0;
  for (let i = n; i > 0; i--) {
    noStroke(); 
		fill(cellColor, 60-bright, 70+bright);
		let size = radius + i * inter;
		let k = kMax * sqrt(i/n);
		let noisiness = maxNoise * (i / n);
    cell(size, width/2, height/2, k, t - i * step, noisiness);
    bright = bright+incrementoBright
  }
}


function cell(size, xCenter, yCenter, k, t, noisiness) {
  beginShape();
	let angleStep = 360/200;
  for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
    let r1, r2;
		r1 = cos(theta)+2*10;
		r2 = sin(theta)+2*10;
    let r = size + noise(k * r1,  k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}

//change color on tap
function mouseClicked() {

    cellColor = round(random(36))*10;
    oraEsatta()
  cellDimension = round(random(20))


}

function oraEsatta() {
  currentHour = hour();
if (currentHour <= 12) {
    incrementoBright = random(4)
    if (incrementoBright <= 2) {incrementoBright = random(4) }
  }

  if (currentHour > 12 && currentHour < 16) {
    incrementoBright = random(4,8)
  }

  if (currentHour >= 16 && currentHour <= 20) {
    incrementoBright = random(-4)
    if (incrementoBright <= -2) {
      incrementoBright = random(-4)
    }
    }
  
    if (currentHour > 20 && currentHour <= 23) {
      incrementoBright = random(-4, -8)
  
    }
  }


//resize page
function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
  wi = windowWidth / 2;
  he = windowHeight / 2;
}


/* function atTime() {
  var currentYear = year();
  var currentMonth = month();
  var currentDay = day();
  var currentDate = currentYear + '-' + nf(currentMonth, 2) + '-' + nf(currentDay, 2);
 
  
const firstDate = new Date(currentDate) 
const secondDate = new Date() 

const firstDateInMs = firstDate.getTime()
const secondDateInMs = secondDate.getTime()

const differenceBtwDates = secondDateInMs - firstDateInMs

const aDayInMs = 24 * 60 * 60 * 1000

const daysDiff = Math.round(differenceBtwDates / aDayInMs)

console.log(daysDiff)
}
 */


