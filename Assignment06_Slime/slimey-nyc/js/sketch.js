
// Constants

const parameters = {
    width: 400,
    height: 400,
    foodInfluence: 1,
    colors: [
        '#EBE9E6',
        '#967849',
        '#4A226B',
        '#A6EEC1',
    ],
    foodColor: [1, 0, 0, 1],
    foodShowInfluence: 0.2,
    sensorDistance: 16,
    zoomDistanceRatio : 1,
    sensorAngle: 25 / 180 * Math.PI, // radians
    turningSpeed: 40 / 180 * Math.PI, // radians
    speed: 1,
    decayFactor: 0.85,
    depositAmount: 0.2,
    numAgents: 30000,
    startInCircle: false, // otherwise start randomly
    highlightAgents: false,
    randomTurning: false, // randomly turn within the limits of turning_speed
    wrapAround: true,
}

// Variables

let gui; // Gui object
let slimeMoldSim; // Simulation object
let combineShader, postShader; // Shaders
let foodImage, scentImage, combinedCanvas, gradientImage; // Textures
let array0, array1; // Buffers 
let mapCanvas;
let slimeCanvas;


// Helper functions

function loadLines() {
    let lines = subway_lines_data["features"];
    for (let i = 0; i < lines.length; i++) {
      let linePoints = lines[i].geometry.coordinates;
      for (let j = 0; j < linePoints.length; j++) {
        let linePoint = linePoints[j];
        let pos = myMap.latLngToPixel(
          linePoint[1],
          linePoint[0]
        );
        console.log('point:' + pos);
        mapCanvas.push();
        mapCanvas.fill('red');
        mapCanvas.ellipse(pos.x, pos.y, 4, 4);
        mapCanvas.pop();
      }
    }
  }
  
  function loadPoiCoord() {
    var pois = subway_stations_data["features"]; // Create an object that contains the features.
    //iterate trough the pois object. If it contains a PoI transform the latitude and longitude to pixels, and create a new instance of the class PoI
    for (let i = 0; i < pois.length; i++) {
      var pos = myMap.latLngToPixel(
        pois[i].geometry.coordinates[1],
        pois[i].geometry.coordinates[0]
      );
  
      // Creates an instance of PoI with the position data of every point fro the data
      var poi = new PoI(
        //lat, lng, x, y, w, h, title
        pois[i].geometry.coordinates[1],
        pois[i].geometry.coordinates[0],
        pos.x,
        pos.y,
        iconWidth,
        iconHeight,
        pois[i].properties.name
      );
  
      poiPoints.push(poi);
      loaded = true;
    }
  }
  

function createLayerTextures() {
    scentImage = createImage(parameters.width, parameters.height); // seperate simulation results from combined tex
    combinedCanvas = createGraphics(parameters.width, parameters.height, WEBGL); // combines simulation results with subway tex
    combinedCanvas.pixelDensity(1);
    combinedCanvas.background(0);
    array0 = new Float32Array(parameters.width * parameters.height);
    array1 = new Float32Array(parameters.width * parameters.height);
}

// ChatGPT helped with the WEBGL functions

function writeCanvasToArray(array, canvas) {
    canvas.loadPixels();
    for (let i = 0, j = 0; i < canvas.pixels.length; i += 4, j++) {
        // Use the red channel as the representation for now
        array[j] = canvas.pixels[i] / 255.0;
    }
    return array;
}

function writeArrayToImage(data, img) {
    img.loadPixels();
    for (let i = 0, j = 0; i < data.length; i++, j += 4) {
        const val = Math.floor(data[i] * 255);
        img.pixels[j] = val;
        img.pixels[j + 1] = val;
        img.pixels[j + 2] = val;
        img.pixels[j + 3] = 255; // alpha
    }
    img.updatePixels();
    return img;
}

function createGradientImage(hexList, w, h) {
    const chromaScale = chroma.scale(hexList).mode('lch');
    gradientImage = createImage(w, h);
    gradientImage.loadPixels();
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const t = x / w;
            const col = color(chromaScale(t).hex());
            gradientImage.set(x, y, col);
        }
    }
    gradientImage.updatePixels();
}

function setupGui() {
    gui = new dat.GUI();
    gui.add(parameters, 'foodInfluence', 0, 1, 0.01).name('Food Eat Influence');
    gui.add(parameters, 'foodShowInfluence', 0, 1, 0.01).name('Food Show Influence');
    gui.add(parameters, 'sensorDistance', 1, 100).name('Sensor Distance');
    gui.add(parameters, 'zoomDistanceRatio', 1, 10).name('Zoom - Distance Ratio');
    gui.add(parameters, 'sensorAngle', 0, PI * 2).name('Sensor Angle');
    gui.add(parameters, 'turningSpeed', 0, PI * 2).name('Turning Speed');
    gui.add(parameters, 'speed', 0, 5).name('Speed');
    gui.add(parameters, 'decayFactor', 0, 1).name('Decay Factor');
    gui.add(parameters, 'depositAmount', 0, 1).name('Deposit Amount');
    gui.add(parameters, 'numAgents', 1, 50000).name('Number of Agents');
    gui.add(parameters, 'startInCircle').name('Start In Circle');
    gui.add(parameters, 'highlightAgents').name('Highlight Agents');
    gui.add(parameters, 'randomTurning').name('Random Turning');
    gui.add(parameters, 'wrapAround').name('Wrap Around');
    gui.add({ 
        reset_sim:  () => { 
            slimeMoldSim.reset();
        },
    }, 'reset_sim').name('Reset Sim');  
}

// P5 builtin functions

function preload() {
    foodImage = loadImage('images/test.jpg'); // This is where the subway tex will go
    combineShader = loadShader('shaders/fullscreen.vert', 'shaders/combine.frag');
    postShader = loadShader('shaders/fullscreen.vert', 'shaders/post.frag');
    subway_lines_data = loadJSON("data/subway_lines.geojson");
    subway_stations_data = loadJSON("data/subway_stations.geojson");
  
    icon = loadImage("assets/icon.png");
    font = loadFont("assets/Khmer Sangam MN.ttf");
}

function setup() {
    mapCanvas = createGraphics(windowWidth, windowHeight);
    mapCanvas.background(0);

    slimeCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
    // Create a tile map and overlay the canvas.
    myMap = mappa.tileMap(options);
    myMap.overlay(slimeCanvas);
  
    stationsCheck = createCheckbox("Show stations", true);
    stationsCheck.changed(() => (showStations === true) ? false : true);

    createLayerTextures();
    setupGui();
    slimeMoldSim = new SlimeMoldSim(parameters);
    // slimeMoldSim = new SlimeMoldSim();
    createGradientImage(parameters.colors, 256, 1);
    noStroke();
}

function draw() {
    mapCanvas.clear();
    slimeCanvas.clear();
    if (myMap.ready && !loaded) {
      //loadLines();
      loadPoiCoord();
    }
  
    if (loaded) {
      for (let i = 0; i < poiPoints.length; i++) {
        var pos = myMap.latLngToPixel(poiPoints[i].lat, poiPoints[i].lng);
  
        poiPoints[i].updatePos(pos.x, pos.y, myMap.zoom());
        poiPoints[i].over(mouseX, mouseY);
        poiPoints[i].show();
      }
    }

    // Create combined input for slime mold sim
    combineShader.setUniform('uScentTex', scentImage); // scent image from previous frame
    combineShader.setUniform('uFoodTex', mapCanvas);
    combineShader.setUniform('uFoodInfluence', parameters.foodInfluence);
    combinedCanvas.shader(combineShader);
    // texture(scentImage);
    combinedCanvas.rect(-combinedCanvas.width * 0.5, -combinedCanvas.height * 0.5, combinedCanvas.width, combinedCanvas.height); // draw the combined results
    // Run simulation
    writeCanvasToArray(array0, combinedCanvas);
    slimeMoldSim.simStep(array0, array1);
    writeArrayToImage(array1, scentImage); // only output scent (not food input; can add back in post or not for flexibility)
    // Post processing step (add colors etc)
    postShader.setUniform('uScentTex', scentImage);
    postShader.setUniform('uFoodTex', mapCanvas);
    postShader.setUniform('uFoodShowInfluence', parameters.foodShowInfluence);
    postShader.setUniform('uFoodColor', parameters.foodColor);
    postShader.setUniform('uGradientImage', gradientImage);
    shader(postShader); // draw final result to canvas
    // texture(combinedCanvas);
    rect(-width * 0.5, -height * 0.5, width, height);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Fullscreen toggle
function keyPressed() {
    if (keyCode == 'f') {
        let fs = fullscreen();
        fullscreen(!fs);
    }
    if (keyCode == 'u') {
        dat.GUI.toggleHide();
    }
}