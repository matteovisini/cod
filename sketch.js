let nameInput;
let submitButton;
let button;
let diametro;
// firebase global variables
let db;
let database;
let scoreRef;

let v1;
let v2;
let v3;

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

function setup() {
  createCanvas(windowWidth, windowHeight - 100);
  diametro = 0;
  createP("Click the button to get points");
  button = createButton("click");
  button.mousePressed(increaseDiametro);
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
  //textAlign(CENTER, CENTER);
  //text(score, width / 2, height / 2);
  fill(v1, v2, v3);
  circle(width / 2, height / 2, diametro);
}

function increaseDiametro() {
  diametro++;
}

function submitDiametro() {
  let data = {
    name: nameInput.value(),
    diametro: diametro,
    v1: v1,
    v2: v2,
    v3: v3,
  };

  // create a new entry
  const newDiametro = db.push(scoreRef);
  // add the data to it
  db.set(newDiametro, data);
  // initialize score variable
  diametro = 0;
}

// Retrieves circles on load and automatically on every database update (realtime database)
//function getDiametro(data) {
//get incoming data
// let diametri = data.val();
// let keys = Object.keys(diametri);

// keys.forEach(function (key) {
//   console.log(key, diametri[key].name, diametri[key].score);
//   diametro = scores[key].score;
// });
//}
