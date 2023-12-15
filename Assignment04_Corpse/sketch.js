let canvas;
let canvasContainer;
let sourceVideo;
let displayVideo;

// ml5 Face Detection Model
let faceapi;
var predictions = [];
let vScale = 28;
const size = 260;
let headImg;
let font;

let sketch = function (p) {
  p.reMap = function (arr, newWidth, newHeight) {
    let result = [
      p.map(arr[0], 0, 640, 0, newWidth),
      p.map(arr[1], 0, 480, 0, newHeight),
    ];
    return result;
  };
  // Start detecting faces
  p.faceReady = function () {
    faceapi.detect(p.gotFaces);
  };

  // When the model is loaded
  p.modelLoaded = function () {
    console.log("Model Loaded!");
  };

  // Got faces
  p.gotFaces = function (error, result) {
    if (error) {
      console.log(error);
      return;
    }
    predictions = result;
    faceapi.detect(p.gotFaces);
  };
  p.drawShape = function (x, y, size) {
    // Rectangle
    p.push();
    p.rectMode(p.CENTER);
    p.rect(x, y, size, size);
    p.pop();
  };

  p.preload = function () {
    headImg = p.loadImage("assets/head.png");
    font = p.loadFont('assets/EBGaramond-Italic.ttf');
  };

  p.setup = function () {
    canvasContainer = document.getElementById("canvas");
    p.frameRate(60);

    let constraints = {
      video: {
        mandatory: {
          width: 4 * size,
          height: 3 * size,
        },
        optional: [{ maxFrameRate: 60 }],
      },
      audio: false,
    };

    displayVideo = p.createCapture(constraints);

    displayVideo.style("z-index: 1");
    displayVideo.parent(canvasContainer);
    displayVideo.hide();
    //displayVideo.position(0, 0);
    facemesh = ml5.facemesh(displayVideo, p.modelLoaded);

    canvas = p.createCanvas(4 * size, 3 * size);
    canvas.style("z-index: 2");
    //canvas.position(0, 0);
    canvas.parent(canvasContainer);

    p.pixelDensity(1);

    facemesh.on("face", (results) => {
      predictions = results;
    });
  };

  p.draw = function () {
    p.push();
    p.translate(p.width, 0);
    p.scale(-1, 1);
    p.image(displayVideo, 0, 0, 4 * size, 3 * size);

    p.loadPixels();

    let facesCoords = [];

    p.push();
    for (let i = 0; i < predictions.length; i += 1) {
      // Get bounding box coordinates
      const boundingBox = predictions[i].boundingBox;
      let topLeft = p.reMap(boundingBox.topLeft[0], 4 * size, 3 * size);
      let bottomRight = p.reMap(boundingBox.bottomRight[0], 4 * size, 3 * size);
      facesCoords.push(topLeft);
      facesCoords.push(bottomRight);

      p.noFill();
      p.stroke('purple');
      p.strokeWeight(4);
      p.rect(topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]);
      p.scale(-1, 1);
      p.image(headImg, - bottomRight[0] , topLeft[1], topLeft[0], bottomRight[1] - topLeft[1]);
      p.textFont(font);
      p.noStroke();
      p.textSize(50);
      p.textAlign(p.CENTER, p.CENTER);
      p.fill('purple');
      p.text("Exquisite (Living) Corpse", -topLeft[0]/2 - bottomRight[0]/2, bottomRight[1] + 30);
    }
    p.pop();
    // End draw
  };
};

let myp5 = new p5(sketch);
