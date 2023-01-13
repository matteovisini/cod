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
  sommadiametri = 0;
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
  
}

function draw() {
  seed++;
  background(200);
  textSize(20);
  textAlign(CENTER, CENTER);
  fill("white");
  text("Ci sono " + keys.length + " utenti", width / 2, height / 2 - 200);
  fill("blue");
  text("Utente: " + nomeutente, width / 2, height / 2 + 200);
  rectMode(CENTER);
  rect(width / 2, height / 2, sommadiametri, sommadiametri);
  

  if (keys) {
    sommadiametri = 0;
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
          circle(x, y, diametri[key].diametro);
          fill("black");
          textSize(12);
          text(diametri[key].name, x, y - 20);
          singoloDiametro = diametri[key].diametro;
          sommadiametri = sommadiametri + singoloDiametro;
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