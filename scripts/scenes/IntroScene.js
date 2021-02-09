
// ES6 Class adding a method to the Person prototype
class IntroScene {
  constructor(app, loader, resources) {
    this.app = app;
    this.resources = resources;
    this.loader = loader;

    this.displayContainer = { };
    this.skipButton = { };

    this.render();

    return this;
  }

  render() {
    this.displayContainer = new PIXI.Container();

    // Add in all storyboards
    this.introStory1 = new PIXI.Sprite(this.resources.backgroundStoryIntro1.texture);
    this.introStory1.y = 0;
    this.introStory1.vx = 0;
    this.introStory1.vy = 0;
    this.introStory1.alpha = 1;
    this.introStory1.x = (this.app.view.width / 2) - (this.introStory1.width / 2);
    this.introStory1.height = this.app.view.height;
    this.displayContainer.addChild(this.introStory1);

    this.introStory2 = new PIXI.Sprite(this.resources.backgroundStoryIntro2.texture);
    this.introStory2.y = 0;
    this.introStory2.vx = 0;
    this.introStory2.vy = 0;
    this.introStory2.alpha = 0;
    this.introStory2.x = (this.app.view.width / 2) - (this.introStory2.width / 2);
    this.introStory2.height = this.app.view.height;
    this.displayContainer.addChild(this.introStory2);

    this.introStory3 = new PIXI.Sprite(this.resources.backgroundStoryIntro3.texture);
    this.introStory3.y = 0;
    this.introStory3.vx = 0;
    this.introStory3.vy = 0;
    this.introStory3.alpha = 0;
    this.introStory3.x = (this.app.view.width / 2) - (this.introStory1.width / 2);
    this.introStory3.height = this.app.view.height;
    this.displayContainer.addChild(this.introStory3);

    // Add in a skip button
    this.skipButton = new ButtonSmallSkip(this.resources);
    this.skipButton.x = this.app.view.width - 20 - this.skipButton.width;
    this.skipButton.y = this.app.view.height - (20 + this.skipButton.height);
    this.displayContainer.addChild(this.skipButton);
  }

  getRenderable() {
    return this.displayContainer;
  }

  // Callback when finished
  play(callback) {

    var tl = gsap.timeline({repeat: 0, repeatDelay: 1});
    var that = this;

    this.skipButton.on('pointerdown', function(event) {
      tl.seek("startGame");
    });

    // Load a black screen
    tl.to(this.introStory1, {alpha:1, duration: 1}).addLabel("intro1");
    tl.to(this.introStory2, {alpha:1, duration: 1}, "=+3").addLabel("intro2");
    tl.to(this.introStory3, {alpha: 1, duration: 1}, "=+4").addLabel("intro3");

    tl.to(this.displayContainer, {alpha: 0, duration: 1}, "=+4").addLabel("startGame");
    tl.to(this.displayContainer, {visible: false, duration: 0.2, onComplete: function() {
      callback();
    }});
  }
}
