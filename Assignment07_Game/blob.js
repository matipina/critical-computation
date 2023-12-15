function getSample(n, range) {
  let arr = [];
  while (arr.length < n) {
    var r = Math.floor(Math.random() * range);
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

class Blob {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angryLevel = 0;
    this.maxNoise = 2 + this.angryLevel * 9;
    this.phase = 0;
    this.phaseRate = 0.001;
    this.offset = 0.01;
    this.zoff = 0;
    this.zoffRate = 0.01;
    this.blobiness = 10;
    this.layers = 1;
    this.ringDistance = 40;
    this.rings = [];
    this.paths = [];
    this.player = new Player(14);
    this.xCount = 0;
    this.yCount = 0;
    this.keyIndex = 0;
    this.currentRing = 0;
    this.goals = [];
    this.healthMax = 100;
    this.healthLvl = 100;
    this.regenRate = 1;
  }

  addPaths(n) {
    console.log("Creating " + n + " new paths...\n");
    let newPath;

    // For each path, get a pair of start and end rings.
    // They have to be different.

    let ringIndexes;
    // Generate n pairs of numbers
    for (let i = 0; i < n; i++) {
      ringIndexes = getSample(2, this.layers);
      ringIndexes.sort();
      newPath = new Path(
        this.rings[ringIndexes[0]],
        this.rings[ringIndexes[1]],
        floor(random(this.rings[ringIndexes[0]].xCoordinates.length))
      );
      this.paths.push(newPath);
    }
  }

  addLayer(radius) {
    let newLayer;
    newLayer = new Ring(
      this.layers,
      radius,
      this.phase,
      this.zoff,
      this.blobiness,
      this.maxNoise
    );
    newLayer.display();
    this.rings.push(newLayer);

    if (this.layers > 1) {
      this.addPaths(floor(random(1, this.layers)));
    }
  }

  addRings() {
    for (let l = 1; l <= this.layers; l++) {
      this.addLayer(this.radius * l);
    }
  }

  checkPath(direction, path) {
    if (direction == "up") {
      return (
        (this.rings[this.currentRing].xCoordinates[this.keyIndex] ==
          path.startRing.xCoordinates[path.index] ||
          this.rings[this.currentRing].xCoordinates[this.keyIndex + 1] ==
            path.startRing.xCoordinates[path.index] ||
          this.rings[this.currentRing].xCoordinates[this.keyIndex - 1] ==
            path.startRing.xCoordinates[path.index]) &&
        this.currentRing == path.startRing.id - 1
      );
    } else if (direction == "down") {
      return (
        (this.rings[this.currentRing].xCoordinates[this.keyIndex] ==
          path.endRing.xCoordinates[path.index] ||
          this.rings[this.currentRing].xCoordinates[this.keyIndex + 1] ==
            path.endRing.xCoordinates[path.index] ||
          this.rings[this.currentRing].xCoordinates[this.keyIndex - 1] ==
            path.endRing.xCoordinates[path.index]) &&
        this.currentRing == path.endRing.id - 1
      );
    }
  }

  createGoal() {
    this.goals.push(
      new Goal(
        this.rings.length - 1,
        floor(random(126)),
        this,
        Object.keys(lessons)[this.goals.length]
      )
    );

  }

  draw() {
    push();
    translate(this.x, this.y);
    //fill(222, 239, 231, 0);
    noFill();
    stroke(primaryColor);
    strokeWeight(1);
    this.phase += this.phaseRate;
    this.zoff += this.zoffRate;

    if (this.layers > this.rings.length) {
      this.addLayer(
        this.radius +
          random(this.ringDistance - 2, this.ringDistance) * (this.layers - 1)
      );
    }

    // Update shape of each ring
    for (let i = 0; i < this.rings.length; i++) {
      this.rings[i].phase = this.phase; // + 10 * i;
      this.rings[i].zoff = this.zoff; // + 10 * i;
      this.rings[i].blobiness = this.blobiness;
      this.rings[i].maxNoise = this.maxNoise;
      this.rings[i].display();
    }

    // Update shape of each path
    for (let i = 0; i < this.paths.length; i++) {
      this.paths[i].display();
    }

    this.xCount = this.rings[this.currentRing].xCoordinates.length;
    this.yCount = this.rings[this.currentRing].yCoordinates.length;

    if (keyIsDown(LEFT_ARROW)) {
      if (this.keyIndex > 0) {
        this.keyIndex--;
      } else {
        this.keyIndex = this.xCount - 1;
      }
    }
    if (keyIsDown(RIGHT_ARROW)) {
      if (this.keyIndex < this.xCount - 1) {
        this.keyIndex++;
      } else {
        this.keyIndex = 0;
      }
    }
    if (keyIsDown(UP_ARROW)) {
      console.log("Up Arrow Pressed");
      for (var i = 0; i < this.paths.length; i++) {
        if (this.checkPath("up", this.paths[i])) {
          this.currentRing = this.paths[i].endRing.id - 1;
          break;
        }
      }
    }
    if (keyIsDown(DOWN_ARROW)) {
      console.log("Down Arrow Pressed");
      for (var i = 0; i < this.paths.length; i++) {
        if (this.checkPath("down", this.paths[i])) {
          this.currentRing = this.paths[i].startRing.id - 1;
          break;
        }
      }
    }

    // Display player if scene == 2
    if (scene == 2) {
      this.goals[score].display();
      this.player.display(this.rings[this.currentRing], this.keyIndex);

      //health bar
      if (this.currentRing > 0) {
        this.regenRate = -this.currentRing * 0.1;
      } else {
        this.regenRate = 1;
      }
      if (this.healthLvl <= 0) {
        this.currentRing = 0;
      }
      push();
      noFill();
      stroke(255);
      rect(500, -300, this.healthMax, 20);
      pop();
      push();
      noStroke();
      fill(secondaryColor);
      this.healthLvl += this.regenRate;
      this.healthLvl = min(this.healthMax, this.healthLvl);
      if (this.healthLvl < 20) {
        fill(216, 34, 41);
        //this.regenRate = -this.currentRing*(0.001);
      }

      rect(500, -300, this.healthLvl, 20);
      pop();
    }

    for (var i = 0; i < this.paths.length; i++) {
      if (
        this.checkPath("up", this.paths[i]) ||
        this.checkPath("down", this.paths[i])
      ) {
        this.paths[i].selected = true;
        break;
      } else {
        this.paths[i].selected = false;
      }
    }
    pop();
  }
}

class Path {
  // idea: add offset +/- x and y coordinates to add wiggle to the crack
  // todo: make it move consistently around the center
  constructor(startRing, endRing, index = 0) {
    this.startRing = startRing;
    this.endRing = endRing;
    this.thickness = 3; // Add as input later
    this.index = index;
    this.color = color(255);
    this.selected = false;
  }

  display() {
    let startX = this.startRing.xCoordinates[this.index];
    let startY = this.startRing.yCoordinates[this.index];
    let endX = this.endRing.xCoordinates[this.index];
    let endY = this.endRing.yCoordinates[this.index];

    push();
    stroke(this.color);
    strokeWeight(this.thickness);
    beginShape(LINES);
    vertex(startX, startY);
    vertex(endX, endY);
    endShape();

    // Display start and end points of the path
    noStroke();
    if (this.selected === true) {
      fill(250, 170, 170, 20);
      for (let i = 0; i < 20; i++) {
        ellipse(startX, startY, i * 3);
        ellipse(endX, endY, i * 3);
      }
      fill(20);
      ellipse(startX, startY, this.thickness * 3);
      ellipse(endX, endY, this.thickness * 3);
    } else {
      fill(255);
      ellipse(startX, startY, this.thickness * 3);
      ellipse(endX, endY, this.thickness * 3);
    }
    pop();
  }
}

class Ring {
  constructor(id, radius, phase, zoff, blobiness, maxNoise, main = true) {
    this.id = id;
    this.radius = radius;
    this.xCoordinates = [];
    this.yCoordinates = [];
    this.angryLevel = 0;
    this.maxNoise = maxNoise;
    this.phase = phase;
    this.phaseRate = 0.001;
    this.offset = 0.01;
    this.zoff = zoff;
    this.zoffRate = 0.01;
    this.blobiness = blobiness;
    this.main = main;
    this.thickness = 6;
    this.secondaryThickness = random(1, 2);

    if (this.main === true) {
      this.minorRings = [];
      for (let i = 0; i < ringsPerLvl; i++) {
        if (this.id === 1 || i === ringsPerLvl - 1) {
          push();
          fill(255);
          console.log("id 1!!");
          this.minorRings.push(
            new Ring(
              id,
              radius - 4 * i,
              phase,
              zoff,
              blobiness,
              maxNoise,
              false
            )
          );
          pop();
        } else {
          this.minorRings.push(
            new Ring(
              id,
              radius - 4 * i,
              phase,
              zoff,
              blobiness,
              maxNoise,
              false
            )
          );
        }
      }
    }
  }

  display() {
    let xoff;
    let yoff;

    // Remove previous ring's coordinates
    this.xCoordinates = [];
    this.yCoordinates = [];
    push();

    translate(this.x, this.y);
    if (this.main === true) {
      strokeWeight(this.thickness);
    } else {
      strokeWeight(this.secondaryThickness);
    }
    beginShape();
    for (var a = 0; a < TWO_PI; a += 0.05) {
      xoff = map(cos(a + this.phase), -1, 1, 0, this.maxNoise);
      yoff = map(sin(a + this.phase), -1, 1, 0, this.maxNoise);
      this.offset = map(
        noise(xoff, yoff, this.zoff),
        0,
        1,
        -this.blobiness,
        this.blobiness
      );

      let x = (this.radius + this.offset) * cos(a);
      let y = (this.radius + this.offset) * sin(a);
      vertex(x, y);
      this.xCoordinates.push(x);
      this.yCoordinates.push(y);
    }
    endShape(CLOSE);
    pop();

    if (this.main === true) {
      for (let i = 0; i < this.minorRings.length; i++) {
        this.minorRings[i].phase = this.phase;
        this.minorRings[i].zoff = this.zoff;
        this.minorRings[i].blobiness = this.blobiness;
        this.minorRings[i].maxNoise = this.maxNoise;
        this.minorRings[i].display();
      }
    }
  }
}

class Goal {
  constructor(ringIndex, keyIndex, blob, topic) {
    console.log("index: ", keyIndex);
    this.blob = blob;
    this.player = blob.player;
    this.active = true;
    this.ring = this.blob.rings[ringIndex];
    this.position = keyIndex;
    this.attributes = lessons[topic].attributes;
    this.r = 5;
  }

  checkCollision() {
    let distance = dist(
      this.ring.xCoordinates[this.position],
      this.ring.yCoordinates[this.position],
      this.player.x,
      this.player.y
    );
    if (distance < this.r * 5) {
      noStroke();
      fill(200);
      rect(
        this.ring.xCoordinates[this.position],
        this.ring.yCoordinates[this.position],
        this.r
      );
    }

    if (distance < this.r) {
      console.log("Collision!!!");
      this.capture();
    }
  }

  addAttributes() {
    if (this.active) {
      console.log("add attributes: ", this.attributes);
      for (const att in this.attributes) {
        this.player.attributes[att] += this.attributes[att];
      }
    }
  }

  capture() {
    score += 1;
    this.addAttributes();
    this.showLesson();
  }

  showLesson() {
    // Display lesson contents

    // Increase level
    currentLvl += 1;
    this.updateSoundtrack();
    this.active = false;
    this.blob.currentRing = 0;

    if (this.blob.goals.length < 3) {
      this.blob.createGoal();
    } else {
      console.log('end!!')
      scene += 1;
    }
    console.log("Turn goal off");
  }

  updateSoundtrack(){
    if(maxAttribute!=null){
      var path = str(maxAttribute) + str(currentLvl-4)
      characterSoundtrack.buffer = characterSoundtracks.get(path); 
      console.log("path:", path);
      if(characterSoundtrack.state == "started"){
        characterSoundtrack.stop();
      }
      if(characterSoundtrack.loaded){
        characterSoundtrack.start();
        console.log("Now Playing:",path);
      }
    }
    
  }

  display() {
    if (this.active) {
      push();
      noStroke();
      fill(236, 170, 1, 17);
      for (let i = 0; i < this.r * 7; i++) {
        ellipse(
          this.ring.xCoordinates[this.position],
          this.ring.yCoordinates[this.position],
          i * 2
        );
      }
      fill(255);
      ellipse(
        this.ring.xCoordinates[this.position],
        this.ring.yCoordinates[this.position],
        this.r
      );
      pop();

      this.checkCollision();
    }
  }
}
