
// ES6 Class adding a method to the Person prototype
class ButtonLarge {
  constructor(resources, text) {

    var height = 84;
    var width = 232;

    // Button Text
    if (text) {
      var buttonText = new PIXI.Text(text, new PIXI.TextStyle({
        fontFamily: "emery",
        fontSize: 43,
        fill: '#f0f0c9',
        stroke: '#000',
        strokeThickness: 1
      }));
    }

    // Create button
    var button = new PIXI.Sprite(resources.btnPrimaryLarge.texture);
    button.height = height;
    button.width = width;
    button.vx = 0;
    button.vy = 0;
    button.interactive = true;
    button.buttonMode = true;
    button.alpha = 1;

    // Centre text in button
    buttonText.x = (button.width / 2) - (buttonText.width / 2) + 5;
    buttonText.y = (button.height / 2) - (buttonText.height / 2);
    button.addChild(buttonText);

    return button;
  }
}
