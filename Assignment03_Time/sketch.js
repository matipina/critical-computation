// Code for spherical coordinates obtained from: https://github.com/Creativeguru97/YouTube_tutorial/tree/master/Play_with_geometry/SphericalCoordinates/0_2_SpiralSphere

let r = 0;

let thetaMaxValue;

let ballTheta = 0;
let thetaRate = 0.04;
let ballAlpha = 255;
let balls = [];
let runSecs;
let numBalls = 100;
let waitTime = 45;
let txt;
let font;
let heartSound;
let playing = false;
let musicPlaying = false;
let music;
let density = 66;
let canvas;
let canvasContainer;


function drawSphere(x, y, z, radius, color){
  push(); // enter local coordinate system
  stroke(color);
  translate(x, y, z);
  sphere(radius, 8);
  pop(); // exit local coordinate system (back to global coordinates)
}

function mousePressed() {
  // If the user clicks on the doorbell, play the sound!
  if (playing === false) {
    playing = true;
    heartSound.setVolume(0.8);
    heartSound.play();
    heartSound.setVolume(0, 20, 64);
  }
}

function preload(){
  font = loadFont('assets/PlayfairDisplay-VariableFont_wght.ttf');
  heartSound = loadSound('assets/heart.mp3');
  music = loadSound('assets/music.mp3');
}

function getType(chance) {
  if (chance < 70) {
    return 0;
  } else if (chance < 85) {
    return 1;
  }
    else {
      return 2;
    }
  }


function setup(){
  canvasContainer = document.getElementById("canvas");
  canvas = createCanvas(windowWidth - 266, 800, WEBGL);
  canvas.parent(canvasContainer);

  angleMode(DEGREES);

  r = width/4;

  let x = r * cos(ballTheta);
  let y = r * sin(ballTheta) * sin(ballTheta*50);
  let z = r * sin(ballTheta) * cos(ballTheta*50);

  //xin, yin, zin, rin, theta, dissapearTime
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(
      x,
      y,
      z,
      random(4, 12), // Radius
      ballTheta - random(2*i), // Theta
      random(65), // Time
      getType(random(100)),// Type
      color(160, 30, 22, 255)// Color
    );
  }
  stroke(19, 22, 38);
  strokeWeight(1);
  noFill();

  textFont(font);
  textSize(36);
  textAlign(CENTER, CENTER);

}

function draw(){
  runSecs = frameCount/frameRate();
  background('#3D81BF');

  orbitControl(4, 4, 1, {freeRotation: false});//Mouse control
  push();
  fill(255);
  text('Chile', 0, -360);
  text('September, 1973', 0, -320);
  pop()
  rotateY(-30);
  rotateZ(-90);
  scale(0.8, 0.8, 0.8);

  if (millis()/1000 > 70) {
    if (musicPlaying === false) {
      musicPlaying = true;
      music.setVolume(0);
      music.play();
      music.setVolume(0.9, 10);
    }
  }
  
  beginShape();

  // Idea: add r * noise() to any of the dimensions. It looks cool.
  for(let theta = 0; theta < 180; theta += 0.1){
    let x = r * cos(theta);
    let y = r * sin(theta) * sin(theta*density);
    let z = r * sin(theta) * cos(theta*density);
    vertex(x, y, z);
  } 
  endShape();

  if (playing === true) {
    balls.forEach(ball => {
      ball.move();
    });
  }
  balls.forEach(ball => {
    ball.display();
  });
  
}

class Ball {
  constructor(xin, yin, zin, rin, theta, dissapearTime, type, color) {
    this.x = xin;
    this.y = yin;
    this.z = zin;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.alpha = 255;
    this.r = rin;
    this.theta = theta;
    this.time = dissapearTime;
    this.type = type;
    this.stop = false;
    this.col = color;
    this.off = random(1);
    this.effect = 0;
  }

  move() {

    // If type is 0, after waitTime, change color to black
    // If type is 1, after waitTime, stop
    // If type is 2, after waitTime, dissapear
    if (this.theta < 180) {
      if (this.theta > waitTime + this.time) {
        if (this.type === 0) {
          this.col = color(10, 0, 0);
          this.effect = map(noise(this.off), 0, 1, -r/2, r/2) * this.theta/90;
        }
        if (this.type === 1) {
          this.stop = true;
          this.col = color(10, 0, 0);
        }
        else if (this.type === 2) {
          this.alpha -= 1;
        }
      }
  
      this.x = r * cos(this.theta);
      this.y = r * sin(this.theta) * sin(this.theta*density) + this.effect;
      this.z = r * sin(this.theta) * cos(this.theta*density);
  
      if (this.stop === false) {
        this.theta += thetaRate;
      }
      this.col.setAlpha(this.alpha);
      this.off += 0.01;
    }
  }

  display() {
    if (this.theta > 0 && this.theta < 180) {
      drawSphere(this.x, this.y, this.z, this.r, this.col);
    }
  }
}

function getCoords(theta) {
  x = r * cos(theta);
  y = r * sin(theta) * sin(theta*density);
  z = r * sin(theta) * cos(theta*density);

  return [x, y, z]
}