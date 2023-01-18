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
  
    stars.forEach(function (key) {

      push();
      translate(width / 2, height / 2);
      rotate(270);
      drawStella(stelle[key].latStella,stelle[key].lngStella,stelle[key].starColor,stelle[key].starType,stelle[key].starBrightness,maxNoise);
      pop();
      /* let starX = stelle[key].latStella - laptopLat
      let starY = stelle[key].lngStella - laptopLng

         let distance = dist(starX+width/2, starY+height/2,mouseX, mouseY,);
      if (mouseIsPressed === true) {
        if (distance < 80) {
          console.log("cacchio")
        }
  } */
     })
  };

  let nomeutente
  //mousemovecheck = 1;


//let geoxlaptop = 400;
//let geoylaptop = 400;

function draw() {
  background("#ededed"); //background
  
  arraycreation();
  fill("white");
  scale = slider.value()*120
  maxNoise = slider.value()
  maxNoisenucleo = maxNoise / 2;
  if (slider.value() < 40) {
    inter = 0.2;
  }
  else { inter = 0.5 }
  fill("4d4d4d")
  text("Utente: " + nomeutente, width / 2, height / 2 + 200);




  if (slider.value() < 450){
  if (prova < 20){
    checkStelle()
    prova++
    }


  fill("white");
  text("Ci sono " + keys.length + " utenti", width / 2, height / 2 - 200);
  fill("blue");

  //celle 
  push()
  if (keys) {
    maxNoise = 400;
    keys.forEach(function (key) {

      //posizione e movimento celle
      let x = noise((seed + 1000 * diametri[key].startingPos) / 300) * windowWidth;
      let y = noise((seed - 1000 * diametri[key].startingPos) / 300) * windowHeight;
      let cellColor = diametri[key].cellColor
        
      //condizione prossimità
      let lat = diametri[key].lat;
      let lng = diametri[key].lng;
      //currentHour = diametri[key].currentHour;

      if ((lat <= laptopLat + RoundUp && lat >= laptopLat - RoundUp) && (lng <= laptopLng + RoundUp && lng >= laptopLng - RoundUp) ) {
    
        let t = frameCount / 250;
        

        oraEsatta()
        let bright = 0;
        
          for (let i = nCelle; i > 0; i--) {
            strokeWeight(1);
            noStroke();
            fill(cellColor, 60-bright, 70+bright);
            let size = radiusCelle + i * interCelle;
            let k = kMaxCelle * sqrt(i / nCelle);
            let noisiness = maxNoiseCelle * (i / nCelle) * (random(0.2));
            cell(size, x, y, k, t - i * step, noisiness);
            //bright = bright+incrementoBright
            bright = bright+diametri[key].currentHour;
          }

          //circle(x, y, diametri[key].diametro);
          fill("black");
          textSize(12);
          text(diametri[key].name, x, y - 20);
          singoloDiametro = diametri[key].diametro;
          maxNoise = maxNoise + singoloDiametro;
          maxNoisenucleo = maxNoise/2
        
      }


    });
  }
    pop()
    
}}
  
 
  //circle(width / 2, height / 2, 30);
  //stars.forEach(function (key) {
  //});


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

let stellax 
let stellay
  
function drawStella(sx, sy, scolore,stipo,sbrightness, sommacerchi) {
  //blob
  stellax = sx;
  stellay = sy;
  let colore = scolore;
  let tipo = stipo;
  let brightness = sbrightness;
  let xdiff = stellax - laptopLat;
  let ydiff = stellay - laptopLng;
  let diameter = sommacerchi;
  let d = dist(stellax, stellay, laptopLat, laptopLng);

  let distance = dist((ydiff* scale)+width/2, -1*(xdiff* scale)+height/2,mouseX, mouseY,);
      if (mouseIsPressed === true) {
        if (distance < 80/4+slider.value()) {
          console.log(tipo)
        }
  }
  

  
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
    
    strokeWeight(2);
    noFill();
    step = 0.01
    let alpha = 1 - noiseProg(i / n);
    stroke(colore, 100, brightness,0.2);
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
    fill(colore, 100, brightness-10, alpha);
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
  slider = createSlider(1, 500, 80);
  slider.position( windowWidth - 250, windowHeight - 50);
  slider.style('width', '200px');

}


/* if (mouseX+100 < width/2 && mouseX+100 < width/2)
if (mouseIsPressed === true) {
  if (distance < 80 / 4 + slider.value()) {
    console.log(tipo)
  }
} */

let prova = 0
let seed =

  function sergio() {
  if (scale < 450){
  if (prova < 20){
    checkStelle()
    prova++
    }


  fill("white");
  text("Ci sono " + keys.length + " utenti", width / 2, height / 2 - 200);
  fill("blue");

  //celle 
  push()
  if (keys) {
    maxNoise = 400;
    keys.forEach(function (key) {

      //posizione e movimento celle
      let x = noise((seed + 1000 * diametri[key].startingPos) / 300) * windowWidth;
      let y = noise((seed - 1000 * diametri[key].startingPos) / 300) * windowHeight;
      let cellColor = diametri[key].cellColor
        
      //condizione prossimità
      let lat = diametri[key].lat;
      let lng = diametri[key].lng;
      //currentHour = diametri[key].currentHour;

      if ((lat <= laptopLat + RoundUp && lat >= laptopLat - RoundUp) && (lng <= laptopLng + RoundUp && lng >= laptopLng - RoundUp) ) {
    
        let t = frameCount / 250;
        

        oraEsatta()
        let bright = 0;
        
          for (let i = nCelle; i > 0; i--) {
            strokeWeight(1);
            noStroke();
            fill(cellColor, 60-bright, 70+bright);
            let size = radiusCelle + i * interCelle;
            let k = kMaxCelle * sqrt(i / nCelle);
            let noisiness = maxNoiseCelle * (i / nCelle) * (random(0.2));
            cell(size, x, y, k, t - i * step, noisiness);
            //bright = bright+incrementoBright
            bright = bright+diametri[key].currentHour;
          }

          //circle(x, y, diametri[key].diametro);
          fill("black");
          textSize(12);
          text(diametri[key].name, x, y - 20);
          singoloDiametro = diametri[key].diametro;
          maxNoise = maxNoise + singoloDiametro;
          maxNoisenucleo = maxNoise/2
        
      }


    });
  }
    pop()
    
}}

let myColor 


function checkStelle() {
  fine = 0; // se cambia, finisce il ciclo

  if (stars) {
    stars.forEach(function (key) {
      myLatStella = stelle[key].latStella;
      myLngStella = stelle[key].lngStella;

      if (fine === 0) {
        console.log("funzione");
        if (laptopLat >= myLatStella - RoundUp && laptopLat <= myLatStella + RoundUp && laptopLng <= laptopLng + RoundUp && laptopLng >= laptopLng - RoundUp)  {
            console.log("Your closest star is:", laptopLat, laptopLng, laptopAcc);
          myColor = stelle[key].starColor;
          starType = stelle[key].starType
          fine = 1;
          disegno = 1
            
          }
          else {
          console.log("there's nothing here")
        } ;
        }
    
    })
  }
}

// By Roni Kaufman

let kMaxCelle;
let stepCelle;
let nCelle = 5; // number of blobs
let radiusCelle = 0; // diameter of the circle
let interCelle = 2; // difference between the sizes of two blobs
let maxNoiseCelle = 25;  //grandezza
let lapseCelle = 0;    // timer
let noiseProgCelle = (x) => (x);


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


/* function mouseMoved() {
  if (movimouse === 0) {
    checkStelle()
    movimouse = 1
  }

}  
 */
//resize page

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
  
    if (currentHour > 20 && currentHour < 23) {
      incrementoBright = random(-4, -8)
  
    }
}
  









