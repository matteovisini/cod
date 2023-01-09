let nameInput;
let submitButton;
let button;
let diametro;
// firebase global variables
let db;
let database;
let scoreRef;

//Dimesione Stella
let sommadiametri = 5;

let keys = [];
let diametri;

async function preload() {
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

// Retrieves circles on load and automatically on every database update (realtime database)
function getDiametro(data) {
  //get incoming data
  diametri = data.val();
  keys = Object.keys(diametri);

  keys.forEach(function (key) {
    console.log(
      key,
      diametri[key].name,
      diametri[key].diametro,
      diametri[key].v1,
      diametri[key].v2,
      diametri[key].v3
    );
    sommadiametri = sommadiametri + diametri[key].diametro;
  });
}

//SETUP

function setup() {
  createCanvas(windowWidth, windowHeight);
  randomnumber = random(0, 15);
}

let seed = 0;
let nomeutente;

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
      fill(diametri[key].v1, diametri[key].v2, diametri[key].v3);
      let x = noise((seed + 1000 * diametri[key].v1) / 300) * windowWidth;
      let y = noise((seed - 1000 * diametri[key].v1) / 300) * windowHeight;
      circle(x, y, diametri[key].diametro);
      fill("black");
      textSize(12);
      text(diametri[key].name, x, y - 20);

      if (mouseIsPressed === true) {
        var distance = dist(mouseX, mouseY, x, y);
        if (distance < diametri[key].diametro) {
          nomeutente = diametri[key].name;
        }
      }
    });
  }
}
