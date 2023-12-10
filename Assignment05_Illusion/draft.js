let r = 30;

function triCircle(x, y, r, angle, rotation) {
  push();
  translate(x, y);
  rotate(rotation);
  arc(0, 0, r, r, 0, 2 * PI - angle);
  pop();
}

function ghostRect(x, y, w, h, r) {
  triCircle(x, y, r, PI / 2, HALF_PI);
  triCircle(x + w, y, r, PI / 2, PI);
  triCircle(x, y + h, r, PI / 2, 0);
  triCircle(x + w, y + h, r, PI / 2, 3 * HALF_PI);
}

function ghostArrow(x, y, w, h, r) {
  triCircle(x, y, r, (3 * PI) / 4, 0);
  triCircle(x, y + h, r, (3 * PI) / 4, HALF_PI);
}

function setup() {
  angleMode(RADIANS);
  createCanvas(700, 700);
}

function draw() {
  background(220);

  stroke("purple");
  fill("red");
  ghostRect(200, 200, 50, 50, r);
  ghostArrow(300, 200, 50, 50, r);
}
