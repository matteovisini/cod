// Elementi pagina
let nameInput;
let submitButton;
let button;
let diametro;

// firebase global variables
let db;
let database;
let scoreRef;
let scoreRef2;

//elementi pianeti per database
let keys = []; 
let diametri;
let v1;
let v2;
let v3;
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


function setup() {
  fakeLat = 0 //random (-30, +30)//solo per cambiare velocemente, da togliere alla fine
  fakeLng = 0 //random (-30, +30)//solo per cambiare velocemente, da togliere alla fine
  createCanvas(windowWidth, windowHeight - 100);
  colorMode(HSB);
  lat = locationData.latitude + fakeLat//Cambia questo per forzare la tua lat
  lng = locationData.longitude +fakeLng//Cambia questo per forzare la tua lng
  acc = locationData.accuracy
  console.log("Your current position is:",lat,lng,"accuracy:",acc)

  diametro = 0;
  createP("Click the button to get points");
  button = createButton("click");
  button.mousePressed(increaseDiametro); // aumento diametro
  nameInput = createInput("name");
  submitButton = createButton("submit");
  submitButton.mousePressed(submitDiametro);
 
  //randomcolor
  v1 = random(255);
  v2 = random(255);
  v3 = random(255);
}

function draw() {
  background(200);
  textSize(100);
  fill(v1, v2, v3);
  circle(width / 2, height / 2, diametro);
}

//funzione aumento diametro
function increaseDiametro() {
  diametro++;
}

//funzione push del bottone
function submitDiametro() {
  let data = {
    name: nameInput.value(),
    diametro: diametro,
    v1: v1,
    v2: v2,
    v3: v3, 
    lat: lat,
    lng: lng,
    acc:acc,
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


let starColor
let starType

//funzione crea stella
function submitStella() {
  starColor = random(360)
  starType = random(0.1, 4.0)
  let data = {
    latStella:laptopLat,
    lngStella:laptopLng,
    diametro: sommadiametri,
    starColor: starColor,
    starType: starType
    

  };
  const newStella = db.push(scoreRef2);
db.set(newStella, data);
}

