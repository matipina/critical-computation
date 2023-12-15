function scaledNoise(
  position,
  time,
  speedScale = 1,
  zoomScale = 1,
  amplitudeScale = 1,
  offset = 0
) {
  let positionInTime = position + speedScale * time + offset * speedScale;
  return amplitudeScale * noise(positionInTime * zoomScale);
}

function drawShape(points, color, offset = 0) {
  push();
  fill(color);

  beginShape();

  for (let x = 0; x <= width; x++) {
    vertex(x, points[x] + offset);
  }

  vertex(width + 1, height + 1);
  vertex(0, height + 1);

  endShape();
  pop();
}

class Mountain {
  constructor(shade) {
    this.coords = [];
    this.shade = shade;
    this.noiseScale = 0.01;
    this.t = 0;
  }

  display() {
    this.t += 1;
    let mountains = [];
    for (let x = 0; x <= width; x++) {
      let levelOnebNoise = scaledNoise(x, this.t, 0.2, this.noiseScale, 1.8, 0);
      let levelOneScaled = map(levelOnebNoise, 0, 5, 50, windowHeight);
      mountains.push(levelOneScaled);
    }
    drawShape(mountains, this.shade);
  }
}
