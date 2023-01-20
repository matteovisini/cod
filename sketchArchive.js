/* firebase global variables */
let db;
let database;
let scoreRef;
let scoreRef2;

let keys = [];
let diametri; // array of cells

let stelle;
let stars = []; // array of parasites

/* geolocation initialization and roundup */
var locationData; //geolocation variable
let RoundUp = 0.015; //geolocation round up

/* empty variables for the laptop current location */
let laptopLat;
let laptopLng;
let laptopAcc;

let starLat; //empty lat for the stars
let starLng; //empty lng for the stars

/*empty field for the info text */
let starName = "";
let cellName = "";
let currentStarLat = "";
let currentStarLng = "";
let starDistance = "";
let starDate = "";

/* variables for the parasite */
let step;
let n = 80; // number to create the parsite shape
let n2 = n / 5; // number to create the parasite nucleus
let radius = 0; // diameter of the starting circle
let inter; // difference between the sizes of two blobs
let maxNoise; //parsite noise that change dimension
let maxNoisenucleo; //nucleus noise
let lapse = 0; // timer
let noiseProg = (x) => x;
let starSpeed = 200; //parasite speed
let singoloDiametro; // allows the parasite to grow

/* variables for the cells */
let kMaxCelle;
let stepCelle = 0.01;
let nCelle = 5; // number of cells
let radiusCelle = 0; // diameter of the starting circle
let interCelle = 2; // difference between the sizes of two blobs
let maxNoiseCelle; //nucleus noise
let lapseCelle = 0; // timer
let noiseProgCelle = (x) => x;
let seed = 0;

/* empty variables to draw the parasite in the correct position */
let stellax;
let stellay;

let daysGone = 1; //controls how quickly the cells fade over time. Use 10,100,1000 etc to make it slowler

/* things that involves slider */
let archive = localStorage.getItem("archivePage"); //recover the data from the homepage to know if zoom on the parasite
let sliderStart; //value for the starting pos of the zoom slider
let scale; //empty value for the zoom with the slider, change it to quickly change the scale of the archive
let desaparecido = 0; //makes text at the bottom appear or disappear based on zoom
let desaparecidoQR = 1; //makes QR appear or disappear based on zoom

/* variables for the checkStelle() function */
let check = 0; //counter to repeat multiple times the check for presence of a near parasite in the database
let fine; // empty variable to better control checkStelle()


/* x and y for the background grid */
let xgrid = 0;
let ygrid = 0;

/* preload */
async function preload() {
  /* geolocation function */
  locationData = getCurrentPosition();

  /* image and font preload */
  qrCode = loadImage("assets/frame.svg");
  myFont = loadFont("assets/Replica Regular.otf");
  myFontLight = loadFont("assets/Replica Light.otf");

  /* load firebase app module */
  const fb_app = "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  const { initializeApp } = await import(fb_app); // it will be loaded in a variable called initializeApp

  const fb_database =
    "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"; // loading firebase database module
  db = await import(fb_database); // it will be loaded in a variable called "db"

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

  const app = initializeApp(firebaseConfig); // Initialize Firebase
  database = db.getDatabase(app); // Initialize Database

  // The reference to database key where data are stored
  scoreRef = db.ref(database, "diametri"); // cells
  scoreRef2 = db.ref(database, "stelle"); // parasites

  // define the callback function that will be called when new data will arrive
  db.onValue(scoreRef, getDiametro);
  db.onValue(scoreRef2, getStella);
}

/* get incoming cells */
function getDiametro(data) {
  diametri = data.val();
  keys = Object.keys(diametri);
  // console.log("la funzione getDiametro è partita");
}

/* get incoming parasites */
function getStella(data) {
  stelle = data.val();
  stars = Object.keys(stelle);
  checkStelle();
  // console.log("la funzione getStella è partita");
}

function setup() {
  let canva = createCanvas(windowWidth, windowHeight);
  canva.parent("canvasp5"); //canva related to the div in the HTML

  //general settings
  angleMode(DEGREES);
  colorMode(HSB);
  textFont(myFont);

  //check if data from localStorage has arrived, if yes, change the sliderStart
  //console.log(archive);
  if (archive > 0) {
    sliderStart = 400; // zoom in
    localStorage.clear(); // clear the 0 in the localStorage
  } else {
    sliderStart = 20; // zoom out
  }
  slider(); //calls the function to construct the slider

  atTime(); //calls the function to calculate the days

  //set laptop geolocation
  laptopLat = locationData.latitude;
  laptopLng = locationData.longitude;
  laptopAcc = locationData.accuracy;

  //set random value for the cells movement
  kMaxCelle = random(0.1, 0.9);
}

/* creation of the array to place parasites */
function arraycreation() {
  maxNoise = slider.value(); //maxNoise starting value

  stars.forEach(function (key) {
    push();
    translate(width / 2, height / 2); //translate everything to put it in the middle of the canvas
    rotate(270); //rotate everything to match north (we don't know why we had to do this, maybe we made some formula errors before)

    //variables to check every single parasite positions in the database
    myLatStella = stelle[key].latStella;
    myLngStella = stelle[key].lngStella;

    keys.forEach(function (key) {
      //variables to check every single cells in the database
      let latCell = diametri[key].lat;
      let lngCell = diametri[key].lng;

      //increases the size of different parasites based on nearby cells
      if (
        latCell <= myLatStella + RoundUp &&
        latCell >= myLatStella - RoundUp &&
        lngCell <= myLngStella + RoundUp &&
        lngCell >= myLngStella - RoundUp
      ) {
        singoloDiametro = 0.01 * slider.value();
        maxNoise = maxNoise + singoloDiametro;
        maxNoisenucleo = maxNoise / 2;
      }
    });

    /* gets all the elements to draw the parasites */
    drawStella(
      stelle[key].latStella,
      stelle[key].lngStella,
      stelle[key].starColor,
      stelle[key].starType,
      stelle[key].starBrightness,
      maxNoise
    );
    pop();

    let hoverInfo = 80 / 4 + slider.value(); // scale space where it is possible to hover on parasites based on the zoom
    
    /* sets all the data for the info box in the corner */
    if (
      (stellay - laptopLng) * scale + width / 2 - hoverInfo < mouseX &&
      (stellay - laptopLng) * scale + width / 2 + hoverInfo > mouseX &&
      -1 * ((stellax - laptopLat) * scale) + height / 2 - hoverInfo < mouseY &&
      -1 * ((stellax - laptopLat) * scale) + height / 2 + hoverInfo > mouseY
    ) {
      starName = stelle[key].starName;
      cellName = stelle[key].creatorName;
      currentStarLat = stelle[key].latStella;
      currentStarLng = stelle[key].lngStella;
      starDate = stelle[key].creationDate;

      distanceKm(); //function to calculate the formula for large distances in KM
    }
  });
}

/* draws the background grid */
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

  scale = slider.value() * 120; // set scale parameters according to the slider

  grid(); //draws the background grid

  /* Repeated search for nearby stars in the database to avoid problems with slow position detection */
  if (check < 20) {
    checkStelle();
    check++;
  }

  arraycreation(); //function to place parasites

  //change values ​​for scale adjustment with zoom
  if (slider.value() < 50) {
    inter = 0.2;
  } else {
    inter = 0.5;
  }

  /* Show different infomations according to the two zoom level */

  if (slider.value() >= 300) {
    desaparecido = desaparecido - 0.8;
    desaparecidoQR = desaparecidoQR + 0.8;

    if (desaparecido < 0) {
      desaparecido = 0;
    }
    if (desaparecidoQR < 0) {
      desaparecidoQR = 0;
    }
  }
  if (slider.value() <= 300) {
    desaparecido = desaparecido + 0.8;
    desaparecidoQR = desaparecidoQR - 0.8;
    if (desaparecido > 1) {
      desaparecido = 1;
    }
    if (desaparecidoQR > 1) {
      desaparecidoQR = 1;
    }
  }
  
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
      windowHeight - 70
    );
    text(
      "GERMINATING",
      (height / 100) * 16,
      windowHeight - 50
    );

    text(
      "THIS PARASITE",
      (height / 100) * 16,
      windowHeight - 30
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

  /* make the center clickable to auto zoom */
  let clickabile = dist(width / 2, height / 2, mouseX, mouseY); 
  if (mouseIsPressed === true) {
    if (clickabile < 80 / 4 + slider.value()) {
      if (isIncrementing) {
        return;
      }
      isIncrementing = true;
      incrementSlider(); //makes the auto zoom possible, leaving the user the possibility to change the slider
    }
  }

  /* draws cells when the view is zoomed */
  if (slider.value() > 360) {
    desaparecido = desaparecido - 0.4;
    push();

    cells(); //draws cells 

    pop();
  }
}

  /* function that draws parasite on data created by the array */
function drawStella(sx, sy, scolore, stipo, sbrightness, sommacerchi) {
  stellax = sx;
  stellay = sy;
  let colore = scolore;
  let tipo = stipo;
  let brightness = sbrightness;
  let xdiff = stellax - laptopLat;
  let ydiff = stellay - laptopLng;
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

  let t = frameCount / starSpeed;
  if (
    (ydiff - starAdjustmentY) * scale + width / 2 > 0 &&
    (ydiff - starAdjustmentY) * scale + width / 2 < windowWidth &&
    -1 * ((xdiff - starAdjustmentX) * scale) + height / 2 > 0 &&
    -1 * ((xdiff - starAdjustmentX) * scale) + height / 2 < windowHeight
  ) {
    for (let i = n; i > 0; i--) {
      //if (ydiff*scale>0 && ydiff*scale<windowHeight){
      strokeWeight(3);
      noFill();
      step = 0.01;
      let alpha = 1 - noiseProg(i / n);
      stroke(colore, 100, brightness, 0.2);
      let size = radius + i * inter;
      let k = tipo * sqrt(i / n);
      let noisiness = diameter * noiseProg(i / n);
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
  slider = createSlider(13, 400, sliderStart);
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
  if (slider.value() >= 400) {
    isIncrementing = false;
    return;
  }
  slider.value(slider.value() + 30);
  setTimeout(incrementSlider, 100);
}

function mouseReleased() {
  isIncrementing = false;
}

function cells() {
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
      maxNoiseCelle = 20 + diametri[key].cellDimension * 2;

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

function starDimension() {
  if (keys) {
    maxNoise = slider.value();

    keys.forEach(function (key) {
      let lat = diametri[key].lat;
      let lng = diametri[key].lng;

      if (
        lat <= laptopLat + RoundUp &&
        lat >= laptopLat - RoundUp &&
        lng <= laptopLng + RoundUp &&
        lng >= laptopLng - RoundUp
      ) {
      }
    });
  }
}
