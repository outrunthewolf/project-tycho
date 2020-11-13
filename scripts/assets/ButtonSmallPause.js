
// ES6 Class adding a method to the Person prototype
class ButtonSmallPause {
  constructor(resources) {

    var height = 50;
    var width = 50;

    // Create button
    var button = new PIXI.Sprite(resources.btnPrimarySmallPause.texture);
    button.height = height;
    button.width = width;
    button.vx = 0;
    button.vy = 0;
    button.interactive = true;
    button.buttonMode = true;
    button.name = "buttonSmall";
    button.alpha = 1;

    return button;
  }
}
