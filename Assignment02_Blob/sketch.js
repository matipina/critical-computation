// Inspired in Daniel Shiffman's code:
// https://www.youtube.com/watch?v=ZI1dmHv3MeM&ab_channel=TheCodingTrain

// Typewriter effect obtained from https://gist.github.com/mjvo/2dce29799eb75b7ee1a571380f12ef1b

const Y_AXIS = 1;
const X_AXIS = 2;
let initialRadius = 70;
let radius = initialRadius;
let changeRate = 2;
let offset = 0.01;
let blobiness = 30;
let phase = 0;
let phaseRate = 0.001;
let zoff = 0;
let zoffRate = 0.01;
let angryLevel = 0;
let tries = 0

function getAvg(values) {
    return values.reduce((m, x, i) => m + (x - m) / (i + 1), 0)
}

function setup() {
  textFont('Trebuchet MS');

  createCanvas(400, 400);
  // Define background colors
  c1 = color(95, 205, 217);
  c2 = color(24, 191, 157);

  c3 = color(160, 217, 166);
  c4 = color(191, 160, 150);

  c5 = color(219, 110, 100);
  c6 = color(219, 180, 100);

  c7 = color(219, 10, 0);
  c8 = color(150, 20, 20);
}

function draw() {
  //background(0);

  if (angryLevel===0) {
    setGradient(0, 0, width, height, c1, c2, Y_AXIS);
  } else if (angryLevel===1) {
    setGradient(0, 0, width, height, c3, c4, Y_AXIS);
  } else if (angryLevel===2) {
    setGradient(0, 0, width, height, c5, c6, Y_AXIS);
  } else if (angryLevel===3) {
    setGradient(0, 0, width, height, c7, c8, Y_AXIS);
  }
  translate(width / 2, height / 2);
  
  //noStroke();
  fill(222, 239, 231);
  beginShape();
  let xCoordinates = [];
  let yCoordinates = [];
  let maxNoise = 2 + angryLevel*5;
  phaseRate = 0.001 + angryLevel*0.007;
  zoffRate = 0.01 + angryLevel*0.02;

  for (var a = 0; a < TWO_PI; a += 0.1) {
    let xoff = map(cos(a + phase), -1, 1, 0, maxNoise);
    let yoff = map(sin(a + phase), -1, 1, 0, maxNoise);
    let offset = map(noise(xoff, yoff, zoff), 0, 1, -blobiness, blobiness);
    let r = radius + offset;

    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
    xCoordinates.push(x)
    yCoordinates.push(y)

  }
  endShape(CLOSE);
  
  phase += phaseRate;
  zoff += zoffRate;

  let centerX = getAvg(xCoordinates);
  let centerY = getAvg(yCoordinates);

  // FACE
  drawFace(centerX, centerY);

  push();
  textSize(20);
  fill(222, 239, 231);
  textAlign(CENTER, CENTER);
  
  if (angryLevel===0) {
    if (tries <3) {
      text("Hi! I'm Blobby, nice to meet you!", 10, -100);
    } else {
      text("Yeah, yeah, I'm Blobby, whatever.", 10, -100);
    }
    
    textSize(10);
    if (tries===0) {
      text("(please don't touch the keyboard <3)", 10, 100);
    } else if (tries < 3) {
      text("(please, don't touch the keyboard. I'm watching you.)", 10, 100);
    } else {
      text("Why do I keep trying?", 10, 100);
    }
  } else if (angryLevel===1) {
    text("Ok, maybe I wasn't clear.", 10, -100);
    textSize(20);
    text("(please, please, \ndon't touch the keyboard)", 10, 110);
  } else if (angryLevel===2) {
    text("Now you're just being annoying.", 10, -100);
    textSize(25);
    text("DON'T. TOUCH. \nTHE. KEYBOARD.", 10, 120);
  } else if (angryLevel===3) {
    textSize(25);
    text("HOW MANY TIMES DO I HAVE\n TO TELL YOU I CAN'T BELIEVE YOU KEPT\n TOUCHING IT YOU HUMANS ARE ALL\n THE SAME", 10, -100);
    textSize(25);
    text("HOW DUMB DO YOU HAVE TO\n BE IT'S A SIMPLE INSTRUCTION\n AND YOU CANNOT EVEN\n DO THAT YOU USELESS PIECE OF\n", 10, 130);
  }
  pop();
  
  changeSize(xCoordinates, yCoordinates);

/*   if (mouseIsPressed===true) {
    if (checkClick(mouseX, mouseY)===true) {
      stretch(mouseX, mouseY, xCoordinates, yCoordinates);
    }
  } */
}

function drawFace(x, y) {
  // FACE
  push();
  stroke(0);
  strokeWeight(2);

  if (angryLevel===0) {
    fill(0);
    ellipse(x - 10, y - 12, 7);
    noFill();
    ellipse(x + 10, y - 12, 15, 14);
    fill(0);
    ellipse(x + 7, y - 10, 2);
    noFill();

    curve(-30, -30, x - 9, y + 13, x + 9, y + 13, 30, -30);
  } else if (angryLevel===1) {
    fill(0);
    ellipse(x - 10, y - 12, 7, 6);
    noFill();
    ellipse(x + 10, y - 12, 15, 10);
    fill(0);
    ellipse(x + 7, y - 10, 2);
    noFill();

    curve(-50, 10, x - 10, y + 7, x + 10, y + 7, 50, 10);
  } else if (angryLevel===2) {
    fill(0);
    ellipse(x - 10, y - 12, 7, 5);
    noFill();
    ellipse(x + 10, y - 12, 15, 7);
    fill(0);
    ellipse(x + 6.5, y - 11, 2);
    noFill();

    curve(-70, 10, x - 20, y, x + 20, y, 70, 10); 
  } else if (angryLevel===3) {
    noFill();
    line(x - 10, y - 12, x - 25, y - 17);
    line(x - 10, y - 12, x - 25, y - 12);
    line(x - 10, y - 12, x - 25, y - 7);

    line(x + 10, y - 12, x + 25, y - 17);
    line(x + 10, y - 12, x + 25, y - 12);
    line(x + 10, y - 12, x + 25, y - 7);

    beginShape();
    for (let i=0; i<6; i++) {
      vertex(x - (30 - 10*i), y + 5 + random(10))
      vertex(x - (20 - 10*i), y + 5 - random(10))
    }
    endShape();
  }
  pop();
}

function checkClick(x, y) {
  if (x < width) {
    if (y < height) {
      return true;
    }
  }
  return false;
}

function getDistance(x1, y1, x2, y2) {
  //line(x1, y1, x2, y2);
  return sqrt( (x2-x1)**2 + (y2-y1)**2 )
}


function stretch(x1, y1, xCoordinates, yCoordinates) {
  push();
  translate(-width/2, -height/2)
  stroke('orange');
  strokeWeight(3);
  noFill();
  ellipse(x1, y1, 20);
  pop();

  for (let i = 0; i < xCoordinates.length; i++){
    const x2 = xCoordinates[i];
    const y2 = yCoordinates[i];
    
    //let distance = getDistance(x1-width/2, y1-height/2, x2, y2);
    //console.log('distance between ', Math.floor(x1), Math.floor(x2), 'and ', Math.floor(y1),  Math.floor(y2), ": ", distance);
  }

}

function changeSize() {
  if (angryLevel===3) {
    if (radius < width) {
      radius += changeRate;
      blobiness += changeRate;
      offset += 1;
    }
  }
  else if (angryLevel<3) {
    if (radius > initialRadius) {
      radius -= changeRate;
      blobiness -= changeRate;
      offset -= 1;
    }
  }
}

function keyPressed() {
  angryLevel += 1;
  if (angryLevel > 3) {
    angryLevel = 0
    tries += 1;
  }
}

function setGradient(x, y, w, h, c1, c2, axis) {
  push();
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
  pop();
}

function typeWriter(sentence, n, x, y, speed) {
  if (n < (sentence.length)) {
    text(sentence.substring(0, n+1), x, y);
    n++;
    setTimeout(function() {
      typeWriter(sentence, n, x, y, speed)
    }, speed);
  }
}

