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

let starLat;
let starLng;

//geolocation
var locationData; //geolocation variable
let RoundUp = 0.015; //geolocation round up

let starName = "";
let cellName = "";
let currentStarLat = "";
let currentStarLng = "";
let starDistance = "";
let starDate = "";

let sommacerchi;

let laptopLat;
let laptopLng;
let laptopAcc;

let kMax;
let step;
let n = 80; // number of blobs
let n2 = n / 5;
let radius = 0; // diameter of the circle
let inter; // difference between the sizes of two blobs
let maxNoise; //grandezza
let maxNoisenucleo; //grandezza nucleo
let lapse = 0; // timer
let noiseProg = (x) => x;
//let myColor;
let velocitàStella = 200;
let scale; //= 1000;

let stellax;
let stellay;

let xdiff = stellax - laptopLat;
let ydiff = stellay - laptopLng;

let daysGone = 1;
let qrCode;
let myFont;

async function preload() {
  //geolocation function
  locationData = getCurrentPosition();
  qrCode = loadImage("assets/frame.svg");
  myFont = loadFont("assets/Replica Regular.otf");
  myFontLight = loadFont("assets/Replica Light.otf");

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
  checkStelle();
  console.log("la funzione getStella è partita");
}

function setup() {
  angleMode(DEGREES);
  colorMode(HSB);
  let canva = createCanvas(windowWidth, windowHeight);
  canva.parent("canvasp5");
  slider();
  atTime();
  textFont(myFont);

  //set laptop location
  laptopLat = locationData.latitude;
  laptopLng = locationData.longitude;
  laptopAcc = locationData.accuracy;
  // Create objects

  //stars.forEach(function (key) {

  kMaxCelle = random(0.1, 0.9);
  stepCelle = 0.01;
}
let mousemovecheck = 0;

function arraycreation() {
  stars.forEach(function (key) {
    push();
    translate(width / 2, height / 2);
    rotate(270);
    drawStella(
      stelle[key].latStella,
      stelle[key].lngStella,
      stelle[key].starColor,
      stelle[key].starType,
      stelle[key].starBrightness,
      maxNoise
    );
    pop();

    let hoverInfo = 80 / 4 + slider.value();
    if (
      ydiff * scale + width / 2 - hoverInfo < mouseX &&
      ydiff * scale + width / 2 + hoverInfo > mouseX &&
      -1 * (xdiff * scale) + height / 2 - hoverInfo < mouseY &&
      -1 * (xdiff * scale) + height / 2 + hoverInfo > mouseY
    ) {
      starName = stelle[key].starName;
      cellName = stelle[key].creatorName;
      currentStarLat = stelle[key].latStella;
      currentStarLng = stelle[key].lngStella;
      starDate = stelle[key].creationDate;

      distanceKm();
    }

    /* let starX = stelle[key].latStella - laptopLat
      let starY = stelle[key].lngStella - laptopLng

         let distance = dist(starX+width/2, starY+height/2,mouseX, mouseY,);
      if (mouseIsPressed === true) {
        if (distance < 80) {
          console.log("cacchio")
        }
  } */
  });
}

let nomeutente;
//mousemovecheck = 1;

let sliderIncrease = 80;
//let geoxlaptop = 400;
//let geoylaptop = 400;
let scaleClick = 120;
let desaparecido = 0;
let desaparecidoQR = 1;
let fine;
let prova = 0;

let xgrid = 0;
let ygrid = 0;

function grid() {
  push();

  for (ygrid = 0; ygrid <= windowHeight; ygrid += windowHeight / 5) {
    for (xgrid = 0; xgrid <= windowWidth; xgrid += windowWidth / 5) {
      stroke(0, 0, 0, 0.008);
      line(xgrid, 0, xgrid, windowHeight);
      line(0, ygrid, windowWidth, ygrid);
    }
  }
  //xgrid += ;
  //ygrid += 90;

  pop();
}

function draw() {
  background("#ededed"); //background

  grid();

  if (prova < 20) {
    checkStelle();
    prova++;
  }

  if (slider.value() >= 400) {
    desaparecido = desaparecido - 0.8;
    desaparecidoQR = desaparecidoQR + 0.8;

    if (desaparecido < 0) {
      desaparecido = 0;
    }
    if (desaparecidoQR < 0) {
      desaparecidoQR = 0;
    }
  }
  if (slider.value() <= 400) {
    desaparecido = desaparecido + 0.8;
    desaparecidoQR = desaparecidoQR - 0.8;
    if (desaparecido > 1) {
      desaparecido = 1;
    }
    if (desaparecidoQR > 1) {
      desaparecidoQR = 1;
    }
  }

  arraycreation();
  fill("white");
  scale = slider.value() * 120;
  maxNoise = slider.value();
  maxNoisenucleo = maxNoise / 2;
  if (slider.value() < 50) {
    inter = 0.2;
  } else {
    inter = 0.5;
  }
  fill("4d4d4d");

  if (slider.value() >= 300) {
    push();
    textSize(16);
    tint(0, 0, 0, desaparecidoQR);

    image(
      qrCode,
      (height / 100) * 4,
      windowHeight - (height / 100) * 14,
      70,
      70
    );
    fill(0, 0, 0, desaparecidoQR);

    text(
      "SCAN TO KEEP",
      (height / 100) * 16,
      windowHeight - (height / 100) * 12.5
    );
    text(
      "GERMINATING",
      (height / 100) * 16,
      windowHeight - (height / 100) * 9.5
    );

    text(
      "THIS PARASITE",
      (height / 100) * 16,
      windowHeight - (height / 100) * 6.5
    );

    pop();
  }

  push();
  fill(0, 0, 0, desaparecido);
  textSize(16);

  text(
    "PARASITE TYPE: " + starName,
    (height / 100) * 4,
    windowHeight - (height / 100) * 16
  );
  text(
    "FIRST CELL: " + cellName,
    (height / 100) * 4,
    windowHeight - (height / 100) * 13
  );
  text(
    "GERMINATE AT DAY: " + starDate,
    (height / 100) * 4,
    windowHeight - (height / 100) * 10
  );

  if (starDistance < 2) {
    text(
      "YOU ARE PART OF THIS COLONY ",
      (height / 100) * 4,
      windowHeight - (height / 100) * 7
    );

    fill(341, 87, 100, desaparecido);
    text(
      "CLICK ON THE PARASITE TO SEE THE SPORES AROUND YOU  ",
      (height / 100) * 4,
      windowHeight - (height / 100) * 4
    );
  } else {
    text(
      "SETTLED " + starDistance + " KM AWAY FROM YOU",
      (height / 100) * 4,
      windowHeight - (height / 100) * 7
    );
    text(
      "GO " + currentStarLat + ", " + currentStarLng + " TO SEE THE COLONY ",
      (height / 100) * 4,
      windowHeight - (height / 100) * 4
    );
  }
  pop();

  let clickabile = dist(width / 2, height / 2, mouseX, mouseY);
  if (mouseIsPressed === true) {
    if (clickabile < 80 / 4 + slider.value()) {
      if (isIncrementing) {
        return;
      }
      isIncrementing = true;
      incrementSlider();
    }
  }
  if (slider.value() > 400) {
    desaparecido = desaparecido - 0.4;
    push();
    pazzia();

    pop();
  }
}
//circle(width / 2, height / 2, 30);
//stars.forEach(function (key) {
//});

function drawStella(sx, sy, scolore, stipo, sbrightness, sommacerchi) {
  //blob
  stellax = sx;
  stellay = sy;
  let colore = scolore;
  let tipo = stipo;
  let brightness = sbrightness;
  xdiff = stellax - laptopLat;
  ydiff = stellay - laptopLng;
  let diameter = sommacerchi;
  let d = dist(
    stellax - starAdjustmentX,
    stellay - starAdjustmentY,
    laptopLat,
    laptopLng
  );

  push();
  stroke("#4d4d4d");
  strokeWeight(0.1);
  noFill();

  circle(0, 0, d * 2 * scale);
  pop();

  //blob
  push();

  let t = frameCount / velocitàStella;
  if (
    (ydiff - starAdjustmentY) * scale + width / 2 > 0 &&
    (ydiff - starAdjustmentY) * scale + width / 2 < windowWidth &&
    -1 * ((xdiff - starAdjustmentX) * scale) + height / 2 > 0 &&
    -1 * ((xdiff - starAdjustmentX) * scale) + height / 2 < windowHeight
  ) {
    for (let i = n; i > 0; i--) {
      //if (ydiff*scale>0 && ydiff*scale<windowHeight){
      strokeWeight(2);
      noFill();
      step = 0.01;
      let alpha = 1 - noiseProg(i / n);
      stroke(colore, 100, brightness, 0.2);
      let size = radius + i * inter;
      let k = tipo * sqrt(i / n);
      let noisiness = maxNoise * noiseProg(i / n);
      blob(
        size,
        (xdiff - starAdjustmentX) * scale,
        (ydiff - starAdjustmentY) * scale,
        k,
        t - i * step,
        noisiness
      );
    }
  }
  pop();

  // nucleo
  push();
  if (
    (ydiff - starAdjustmentY) * scale + width / 2 > 0 &&
    (ydiff - starAdjustmentY) * scale + width / 2 < windowWidth &&
    -1 * ((xdiff - starAdjustmentX) * scale) + height / 2 > 0 &&
    -1 * ((xdiff - starAdjustmentX) * scale) + height / 2 < windowHeight
  ) {
    for (let i = n2; i > 0; i--) {
      let alpha = 1 - noiseProg(i / n2);
      strokeWeight(1);
      step2 = 1;
      noStroke();
      fill(colore, 100, brightness - 10, alpha);
      let size = radius + i * inter;
      let k = tipo * sqrt(i / n2);
      let noisiness = maxNoisenucleo * noiseProg(i / n2);
      nucleo(
        size,
        (xdiff - starAdjustmentX) * scale,
        (ydiff - starAdjustmentY) * scale - starAdjustmentY,
        k,
        t - i * step2,
        noisiness
      );
    }
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
    let r = size + noise(k * r1, k * r2, t) * noisiness;
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

function slider() {
  slider = createSlider(13, 500, 500);
  //slider.position(windowWidth - 250, windowHeight - 50);
  //slider.style("width", "200px");
  //slider.style("background-color", "#ff4848");
  slider.class("sliderz");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  wi = windowWidth / 2;
  he = windowHeight / 2;
}

function distanceKm() {
  // Coordinate dei due punti
  let lat1 = laptopLat;
  let lon1 = laptopLng;
  let lat2 = stellax;
  let lon2 = stellay;

  // Converte i gradi in radianti
  lat1 = radians(lat1);
  lon1 = radians(lon1);
  lat2 = radians(lat2);
  lon2 = radians(lon2);

  // Formula del great-circle distance
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = pow(sin(dlat / 2), 2) + cos(lat1) * cos(lat2) * pow(sin(dlon / 2), 2);
  let c = 2 * atan2(sqrt(a), sqrt(1 - a));

  // Raggio medio della Terra (in metri)
  let R = 6371e3;

  // Calcola la distanza in metri
  let distance = R * c;

  // Calcola la distanza in km
  starDistance = round(distance / 1000);
}

let isIncrementing = false;

function incrementSlider() {
  if (slider.value() >= 500) {
    isIncrementing = false;
    return;
  }
  slider.value(slider.value() + 30);
  setTimeout(incrementSlider, 100);
}

function mouseReleased() {
  isIncrementing = false;
}

let kMaxCelle;
let stepCelle;
let nCelle = 5; // number of blobs
let radiusCelle = 0; // diameter of the circle
let interCelle = 2; // difference between the sizes of two blobs
let maxNoiseCelle; //grandezza
let lapseCelle = 0; // timer
let noiseProgCelle = (x) => x;
let seed = 0;
function pazzia() {
  seed++;

  //celle
  push();
  if (keys) {
    keys.forEach(function (key) {
      //posizione e movimento celle
      let x =
        noise((seed + 1000 * diametri[key].startingPos) / 300) * windowWidth;
      let y =
        noise((seed - 1000 * diametri[key].startingPos) / 300) * windowHeight;
      let cellColor = diametri[key].cellColor;
      maxNoiseCelle = 25 + diametri[key].cellDimension;
      //condizione prossimità
      let lat = diametri[key].lat;
      let lng = diametri[key].lng;
      //currentHour = diametri[key].currentHour;

      if (
        lat <= laptopLat + RoundUp &&
        lat >= laptopLat - RoundUp &&
        lng <= laptopLng + RoundUp &&
        lng >= laptopLng - RoundUp
      ) {
        let t = frameCount / 250;

        let bright = 0;
        let incrementoBright = diametri[key].incrementoBright;
        let cellDate = diametri[key].creationDate;

        atTime(cellDate);

        for (let i = nCelle; i > 0; i--) {
          strokeWeight(1);
          noStroke();

          fill(cellColor, 60 - bright, 70 + bright, 1 - cellOpacity);
          let size = radiusCelle + i * interCelle;
          let k = kMaxCelle * sqrt(i / nCelle);
          let noisiness = maxNoiseCelle * (i / nCelle) * random(0.2);

          cell(size, x, y, k, t - i * step, noisiness);

          bright = bright + incrementoBright;
          //bright = bright+diametri[key].currentHour;
        }

        //circle(x, y, diametri[key].diametro);
        textAlign(CENTER, CENTER);
        fill(0, 0, 0, 1 - cellOpacity);
        textSize(12);

        text(diametri[key].name, x, y - 20);
      }
    });
  }
  pop();
}
function cell(size, xCenter, yCenter, k, t, noisiness) {
  beginShape();
  let angleStep = 360 / 200;
  for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
    let r1, r2;
    r1 = cos(theta) + 2 * 10;
    r2 = sin(theta) + 2 * 10;
    let r = size + noise(k * r1, k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}

function atTime(cellDate) {
  let myCellDate = cellDate;
  var currentYear = year();
  var currentMonth = month();
  var currentDay = day();
  var currentDate =
    nf(currentMonth, 2) + "-" + nf(currentDay, 2) + "-" + currentYear;

  const firstDate = new Date(currentDate);
  const secondDate = new Date(myCellDate);

  const firstDateInMs = firstDate.getTime();
  const secondDateInMs = secondDate.getTime();

  const differenceBtwDates = secondDateInMs - firstDateInMs;

  const aDayInMs = 24 * 60 * 60 * 1000;

  const daysDiff = Math.round(differenceBtwDates / aDayInMs);

  if (daysDiff > 8 * daysGone) {
    daysDiff = 8 * daysGone;
  }
  cellOpacity = daysDiff / (10 * daysGone);
  //console.log (cellOpacity)
}

let starAdjustmentX;
let starAdjustmentY;

function checkStelle() {
  fine = 0; // se cambia, finisce il ciclo

  if (stars) {
    stars.forEach(function (key) {
      myLatStella = stelle[key].latStella;
      myLngStella = stelle[key].lngStella;

      if (fine === 0) {
        console.log("funzione");
        if (
          laptopLat >= myLatStella - RoundUp &&
          laptopLat <= myLatStella + RoundUp &&
          laptopLng <= laptopLng + RoundUp &&
          laptopLng >= laptopLng - RoundUp
        ) {
          console.log("Your closest star is:", laptopLat, laptopLng, laptopAcc);
          starAdjustmentX = myLatStella - laptopLat;
          starAdjustmentY = myLngStella - laptopLng;
          fine = 1;
        } else {
          console.log("there's nothing here");
          starAdjustmentX = 0;
          starAdjustmentY = 0;
        }
      }
    });
  }
}
