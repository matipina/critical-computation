const guitarColors = [
  // Browns
  [222, 184, 135],
  [205, 170, 125],
  [255, 248, 220],
  [139, 105, 20],
  [222, 184, 135],
  [38, 19, 15],
  [191, 140, 111],
  [87, 47, 37],
  [217, 112, 20],
  [242, 146, 29],
  // Other colors
  [0, 46, 102],
  [31, 63, 102],
  [252, 148, 175]
]

const neckColors = [
  [38, 1, 1],
  [80, 20, 10],
  [13, 13, 13]
]

var showGrid = false;
var showAnchors = false;

function randomizeColor(colorOptions) {
  return colorOptions[Math.floor(Math.random() * colorOptions.length)]
}

var guitarColor = randomizeColor(guitarColors);
var neckColor = randomizeColor(neckColors);

function changeGuitarColor(color) {
  guitarColor = color;
}

function changeNeckColor(color) {
  neckColor = color;
}

function changeGridVisibility() {
  if (showGrid==false) {
    showGrid = true;
  }
  else if (showGrid==true) {
    showGrid = false
  }
}

function changeBlendMode(mode) {
  blendMode(mode);
}

function changeAnchorsVisibility() {
  if (showAnchors==false) {
    showAnchors = true;
  }
  else if (showAnchors==true) {
    showAnchors = false
  }
}

function createGrid(spacing, showMiddle) {
  push();
  strokeWeight(0.2);
  for (let i=0; i < width/spacing; i++) {
    line(i*spacing, 0, i*spacing, height);
  }
  for (let j=0; j < height/spacing; j++) {
    line(0, j*spacing, width, j*spacing);
  }
  if (showMiddle==true) {
    strokeWeight(1);
    stroke('red');
    line(width/2, 0, width/2, height);
  }
  pop();
}

function startVertex(x, y, show) {
  vertex(x, y); 

  push();
  let size = 10;
  if (show==true) {
    noFill();
    ellipse(x, y, size);    
  }
  pop();
}

function newBVertex(x2, y2, x3, y3, x4, y4, col, show) {
  bezierVertex(x2, y2, x3, y3, x4, y4);

  push();

  let size = 10;
  if (show==true) {
    noFill();
    stroke(col);
    ellipse(x2, y2, size);
    ellipse(x3, y3, size);
    ellipse(x4, y4, size);
  }
  pop();
}

function getX(y, m, x0, y0) {
  let x = (m*(y - y0) + x0);
  return x
}

function createButtons() {
  gridButton = createButton('Show Grid');
  gridButton.position(10, 405);
  gridButton.mousePressed(changeGridVisibility);

  anchorButton = createButton('Show Anchors');
  anchorButton.position(10, 430);
  anchorButton.mousePressed(changeAnchorsVisibility);

  boringButton = createButton('Boring Mode (default)')
  boringButton.position(410, 10);
  boringButton.mousePressed(function () {
    changeBlendMode(BLEND);
  })

  addButton = createButton('Additive Mode')
  addButton.position(410, 40)
  addButton.mousePressed(function () {
    changeBlendMode(DARKEST);
  })

  addButton = createButton('Weird Mode')
  addButton.position(410, 70)
  addButton.mousePressed(function () {
    changeBlendMode(SOFT_LIGHT);
  })

  addButton = createButton('LSD Mode (WARNING)')
  addButton.position(410, 100)
  addButton.mousePressed(function () {
    changeBlendMode(DIFFERENCE);
  })
}

function guitarBody(startX, startY, topAnchorWidth, topAnchorY, topWidth, topY, endAnchorWidth, endAnchorY, bottomWidth, bottomY, woodColor) {
  push();
  fill(...woodColor);
  noStroke();

  beginShape();
  // first point
  startVertex(startX, startY, showAnchors);

  newBVertex(startX+topAnchorWidth, topAnchorY, startX-topWidth, topY, startX+bottomWidth, bottomY, 'green', showAnchors)
  newBVertex(startX+endAnchorWidth, endAnchorY, startX-endAnchorWidth, endAnchorY, startX-bottomWidth, bottomY, 'blue', showAnchors)
  newBVertex(startX+topWidth, topY, startX-topAnchorWidth, topAnchorY, startX, startY, 'purple', showAnchors)
  endShape();

  fill(20, 0, 0);
  ellipse(startX, startY + 82, 50);
  
  pop();
}

function guitarHead(startX, startY, headWidth, headHeight) {
  push();
  rect(startX, startY-headHeight/2, headWidth, headHeight, 7)
  pop();
}

function addFrets(fretAmount, neckHeight, neckWidth, startX, startY) {
  push();
  stroke(255);
  strokeWeight(2);
  let fretSpacing = neckHeight/fretAmount;
  for (let i=0; i < fretAmount; i++) {
    line(startX-neckWidth/2, startY + fretSpacing*i, startX+neckWidth/2, startY + fretSpacing*i);
  }
  pop();
}

function guitarNeck(startX, startY, neckWidth, neckHeight, offset, neckColor) {
  push();
  rectMode(CENTER);
  noStroke();
  fill(...neckColor);
  rect(startX, startY - offset, neckWidth, neckHeight, 2);
  guitarHead(startX, startY - offset - neckHeight/2, neckWidth + 12, 39);
  addFrets(15, neckHeight, neckWidth, startX, (startY - offset - neckHeight/2));

  pop();
}

function setup() {
  createCanvas(400, 400);
  blendMode(BLEND);
  // blendMode(DARKEST); //collage mode
  // blendMode(DIFFERENCE); LSD mode
  // blendMode(SOFT_LIGHT); // weird mode
  angleMode(DEGREES);

  const startValues= [width/2, 184, 138, 185, -23, 225, 173, 51, 264, 412]

  startXSlider = createSlider(0, width, width/2);
  startXSlider.position(410, 290);
  startXSlider.style('width', '100px');

  startYSlider = createSlider(50, 250, 184);
  startYSlider.position(520, 290);
  startYSlider.style('width', '100px');

  topAnchorWidthSlider = createSlider(0, width, 138);
  topAnchorWidthSlider.position(410, 310);
  topAnchorWidthSlider.style('width', '100px');

  topAnchorYSlider = createSlider(0, height, 185);
  topAnchorYSlider.position(520, 310);
  topAnchorYSlider.style('width', '100px');

  topWidthSlider = createSlider(-100, 80, -23);
  topWidthSlider.position(410, 330);
  topWidthSlider.style('width', '100px');

  topYSlider = createSlider(0, height, 225);
  topYSlider.position(520, 330);
  topYSlider.style('width', '100px');

  endAnchorWidthSlider = createSlider(0, width, 173);
  endAnchorWidthSlider.position(410, 350);
  endAnchorWidthSlider.style('width', '100px');

  bottomWidthSlider = createSlider(0, 220, 51);
  bottomWidthSlider.position(410, 370);
  bottomWidthSlider.style('width', '100px');

  bottomYSlider = createSlider(0, height, 264);
  bottomYSlider.position(520, 370);
  bottomYSlider.style('width', '100px');

  endAnchorYSlider = createSlider(0, 600, 412);
  endAnchorYSlider.position(520, 390);
  endAnchorYSlider.style('width', '100px');

  randomButton = createButton('Next Guitar')
  randomButton.position(10, 10);


  createButtons();
}

function getBackgroundColor(guitarColor, mode) {
  let values = guitarColor;
  let magnitude = 70;
  let threshold = 200;

  if (mode=='darker') {
    return darkerColor = [values[0]-magnitude, values[1]-magnitude, values[2]-magnitude]
  }
  else if (mode=='lighter') {
    if (values[0] > threshold && values[1] > threshold && values[2] > threshold) {
      return darkerColor = [values[0]-magnitude, values[1]-magnitude, values[2]-magnitude]
    }
    else {
      let lighterColor = [values[0]+magnitude, values[1]+magnitude, values[2]+magnitude]
      return lighterColor
    }
  }
}

function updateSlider(slider, value) {
  slider.value(value);
}

function draw() {
  let backColor = getBackgroundColor(guitarColor, 'lighter')
  background(backColor)

  push()
  noFill();
  stroke(0);

  var startX = startXSlider.value();
  var startY = startYSlider.value();
  var topAnchorWidth = topAnchorWidthSlider.value();
  var topAnchorY = topAnchorYSlider.value();
  var topWidth = topWidthSlider.value();
  var topY = topYSlider.value();
  var endAnchorWidth = endAnchorWidthSlider.value();
  var endAnchorY = endAnchorYSlider.value();
  var bottomY = bottomYSlider.value();
  var bottomWidth = bottomWidthSlider.value();

  randomButton = createButton('Next Guitar')
  randomButton.position(10, 10);
  randomButton.mousePressed(function() {
    updateSlider(startYSlider, random(165, 218));
    updateSlider(topAnchorWidthSlider, random(100, 180));
    updateSlider(topAnchorYSlider, random(140, 300));
    updateSlider(topWidthSlider, random(-50, 30));
    updateSlider(topYSlider, random(200, 250));
    updateSlider(endAnchorWidthSlider, random(130, 210));
    updateSlider(endAnchorYSlider, random(300, 550));
    updateSlider(bottomYSlider, random(100, 400));
    updateSlider(bottomWidthSlider, random(50, 180));
    changeGuitarColor(randomizeColor(guitarColors));
    changeNeckColor(randomizeColor(neckColors));
  });

  if (showGrid==true) {
    createGrid(20, true);
  }
  
  guitarBody(startX, startY, topAnchorWidth, topAnchorY, topWidth, topY, endAnchorWidth, endAnchorY, bottomWidth, bottomY, guitarColor);
  guitarNeck(startX, startY, 20, 180, 35, neckColor); // Add some variability to the width and height, but not too much
  
  pop()
}
