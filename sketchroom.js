// firebase global variables
let db;
let database;
let scoreRef;
let scoreRef2;

//Dimesione Stella
let sommadiametri = 5;
let keys = [];
let diametri;

let stelle;
let stars = [];

//geolocation 
var locationData; //geolocation variable
let RoundUp = 0.01 //geolocation round up 

//noise variable
let seed = 0;

//object name
let nomeutente;

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

  scoreRef2 = db.ref(database, "stelle")
  // define the callback function that will be called when
  // new data will arrive
  db.onValue(scoreRef, getDiametro);
  db.onValue(scoreRef2, getStella);
}

// Retrieves circles on load and automatically on every database update (realtime database)
function getDiametro(data) {

  //get incoming data
  diametri = data.val();
  keys = Object.keys(diametri);

  keys.forEach(function (key) {
    console.log(key,
      diametri[key].name,
      diametri[key].diametro,
      diametri[key].v1,
      diametri[key].v2,
      diametri[key].v3,
      diametri[key].lat,
      diametri[key].lng,
      diametri[key].acc,
    );

    sommadiametri = sommadiametri + diametri[key].diametro;
  });
}


function getStella(data) {

  //get incoming data
  stelle = data.val();
  stars = Object.keys(stelle);

  stars.forEach(function (key){
    
  console.log(stelle[key].latStella)
});
}

//SETUP

function setup() {

  //create the canvas
  createCanvas(windowWidth, windowHeight);
 
  //set laptop location
  laptopLat = locationData.latitude +100
  laptopLng = locationData.longitude
  laptopAcc = locationData.accuracy
  console.log(laptopLat,laptopLng,laptopAcc)

let check = 0
  if (stars) {
    stars.forEach(function (key) {
    
      let myLatStella = stelle[key].latStella
      let myLngStella = stelle[key].lngStella
      if ((laptopLat >= myLatStella-RoundUp) && (laptopLat <= myLatStella+RoundUp)) {
        if ( (laptopLng >= myLngStella-RoundUp) && (laptopLng <= myLngStella + RoundUp)){

          console.log("vecchio, sei nella stessa posizione")
          }
        }

        else { 
          check = 1
          
        
        }}
 
        
  ); 
  if (check === 1) {submitStella()}
  }

  /* if (keys) {
    keys.forEach(function (key) {
    
      let lat = diametri[key].lat
      let lng = diametri[key].lng
      if ((lat <= laptopLat+RoundUp) && (lat >= laptopLat-RoundUp) ) {
        if ((lng <= laptopLng+RoundUp) && (lng >= laptopLng-RoundUp)){

          submitStella()
          }
        }
 
        }
  ); 
  } */

  
}

function submitStella(){
  console.log("ciao")
  let data = {
    latStella:laptopLat,
    lngStella:laptopLng,
    diametro:sommadiametri,
    
  };
  const newStella = db.push(scoreRef2);
db.set(newStella, data);
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
    keys.forEach(function (key) {
      fill(diametri[key].v1, diametri[key].v2, diametri[key].v3, 100- diametri[key].acc);
      let x = noise((seed + 1000 * diametri[key].v1) / 300) * windowWidth;
      let y = noise((seed - 1000 * diametri[key].v1) / 300) * windowHeight;
      let lat = diametri[key].lat
      let lng = diametri[key].lng


      if ((lat <= laptopLat+RoundUp) && (lat >= laptopLat-RoundUp) ) {
        if ((lng <= laptopLng+RoundUp) && (lng >= laptopLng-RoundUp)){
          
      circle(x, y, diametri[key].diametro);
      fill("black");
      textSize(12);
      text(diametri[key].name, x, y - 20);
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



function updateStella(){
  console.log("accidenti")
  let data = {
    diametro:sommadiametri,
  };

const updateStella = db.push(scoreRef2);
db.update(updateStella, data);
}

