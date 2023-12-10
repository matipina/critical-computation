let n = 1;
let i;
let time;
let nextBallTimer = 0;
let x;
let y;
let period = 2;
let h = 400;
let radius = 20;
let timer = 0;
let nSlider;
let polySynth;
let statusArray;
let nextIn;

function equation(t, i, n, period) {
  return (1 / 2) * sin(PI * (i / n - 1 / 2) + (t / period) * 2 * PI) + 1 / 2;
}

function coolLine(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  ellipse(x1, y1, 8);
  ellipse(x2, y2, 8);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //nSlider = createSlider(1, 20, 1, 1);
}

function draw() {
  background(0);
  stroke(255);
  time = millis() / 1000;
  //n = nSlider.value();
  push();
  translate(width / 2, height / 4);
  fill(255);
  ellipse(x, h / 2, radius);
  for (let i = 0; i < n; i++) {
    x = 0; //i * w/n;
    y = h * equation(time, i, n, period);
    if (time >= period / 2 / n + timer) {
      console.log("now!", i);
      timer = time;
    }

    line(x, 0, x, h);

    fill("aquamarine");
    ellipse(x, y, radius);
    translate(0, h / 2);
    rotate(PI / n);
    translate(0, -h / 2);
  }
  pop();
	if (time >= 3 * period + nextBallTimer) {
		if (n <= 100) {
			n += 1;
			nextBallTimer = time;
		} else {
			n = 1;
			nextBallTimer = time;
		}
	}
}
