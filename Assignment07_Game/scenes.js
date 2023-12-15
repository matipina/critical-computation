const dialogueQuestions = [7, 9, 11, 13, 15]; // This determines which dialogue options corresponds to questions

function startScreen() {
  background(backgroundImg);
  drawGui();
  if (startButton.isPressed) {
    if (scene === 0) {
      scene += 1;
      startButton.visible = false;
    }
  }
}

function characterCreation() {
  let question = questions["question" + currentLvl];
  let answers = question["answers"];

  fill(255);
  //text(currentLvl, 40, 50);

  skipButton.visible = true;
  if (skipButton.isPressed) {
    dialogueOption += 1;
  }

  // Textbox

  if (dialogueQuestions.includes(dialogueOption)) {
    skipButton.visible = false;
    push();
    fill(100);
    rect(20, windowHeight - 280, windowWidth - 40, 280, 10);
    pop();

    text(question["content"], 60, windowHeight - 220);

    let i = 0;
    if (buttons.length < 5) {
      for (const answer in answers) {
        buttons.push(
          new SurveyOption(
            answers[answer],
            answer,
            60,
            windowHeight - 50 - buttonH * i,
            blob.player
          )
        );
        i += 1;
      }
    }
  } else {
    // Show dialogue
    skipButton.visible = true;
    text(
      dialogue[dialogueOption],
      100,
      100,
      windowWidth - 120
    );
  }
  drawGui();
}
