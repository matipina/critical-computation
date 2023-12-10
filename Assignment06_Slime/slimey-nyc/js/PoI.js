class PoI {
  constructor(lat, lng, x, y, w, h, title) {
    this.lat = lat;
    this.lng = lng;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.title = title;
    this.rollover = false; // Is the mouse over the ellipse?
    this.selected = false; // Has this ellipse been clicked?
  }

  over(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.w) {
      this.y = this.y + 3;
      this.w = this.w + 6;
      this.h = this.h + 6;
      mapCanvas.textFont(font);
      mapCanvas.textSize(12);
      mapCanvas.fill(255);
      mapCanvas.text(this.title, this.x + this.w/2 + 1, this.y - 6);
    }
  }

  select(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.w) {
      this.y = this.y + 3;
      this.w = this.w + 6;
      this.h = this.h + 6;
      mapCanvas.textFont(font);
      mapCanvas.noStroke();
      mapCanvas.textSize(12);
      mapCanvas.fill(50);
      mapCanvas.text(this.title, this.x + 5, this.y + 2);
    }
  }

  show() {
    if (showStations === true) {
      mapCanvas.push();
      mapCanvas.noStroke();
      mapCanvas.fill(255);
      mapCanvas.ellipse(this.x, this.y - this.h / 2, this.w, this.h);
      mapCanvas.pop();
    }
  }

  updatePos(_x, _y, _zoom) {
    //adjust if map is moved
    let zoomExpWidth = map(_zoom, 0, 22, 0, 7);
    let zoomExpHeight = map(_zoom, 0, 22, 0, 7);
    this.x = _x;
    this.y = _y;
    this.w = exp(zoomExpWidth);
    this.h = exp(zoomExpHeight);
  }
}
