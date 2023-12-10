class SurveyOption {
  constructor(content, att, x, y, player) {
    this.content = content;
    this.att = att;
    this.x = x;
    this.y = y;
    this.player = player;

    this.sprite = createButton(content, x, y, content.length*14, 30);
    this.sprite.onPress = this.selectOption.bind(this);
  }

  selectOption() {
    if (currentLvl <= attributes) {
      console.log("Increase ", this.att, this.player);
      push();
      this.player.attributes[this.att] += 1;
      currentLvl += 1;
      fill(100);
      rect(20, windowHeight - 280, windowWidth - 40, 280, 10);
      pop();
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].sprite.visible = false;
      }
      buttons = [];
      if (currentLvl == attributes) {
        // End character creation
        scene += 1;
      }
    }
    dialogueOption += 1;
  }
}
