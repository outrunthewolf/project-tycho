
// ES6 Class adding a method to the Person prototype
class Sound {
  constructor(app, loader, resources) {

    this.stage = app.stage;
    this.app = app;
    this.loader = loader;
    this.resources = resources;

    // Music on
    this.musicOn = true;
    this.soundOn = true;

    this.musicMain = this.resources.musicMain.sound;
    this.musicGame = this.resources.musicGame.sound;

    this.musicMainPlaying = false;
    this.musicGamePlaying = false;

    this.soundToggle = { };
  }

  renderControls() {
    var that = this;

    this.soundToggle = new PIXI.Sprite(resources.btnPrimarySmall.texture);
    this.soundToggle.width = 50;
    this.soundToggle.height = 50;
    this.soundToggle.x = 20;
    this.soundToggle.y = 20;
    this.soundToggle.zIndex = 99999;
    this.soundToggle.interactive = true;
    this.soundToggle.buttonMode = true;
    this.app.stage.addChild(this.soundToggle);

    var soundText = new PIXI.Text("🔇", new PIXI.TextStyle({
      fontFamily: "Futura",
      fontSize: 50,
      fill: "white"
    }));
    soundText.x = 28;
    soundText.y = 10;
    this.soundToggle.addChild(soundText);

    var originalTitlePos = this.soundToggle.y;

    this.soundToggle.click = function (e) {
      gsap.to(that.soundToggle, {
        keyframes: [{
            y: (originalTitlePos - 10),
            duration: 0.3
          },
          {
            y: originalTitlePos,
            duration: 0.3
          }
        ],
        ease: "elastic"
      });

      if (that.soundLevel == 1) {
        that.soundLevel = 0;
        PIXI.sound.volumeAll = 0;
        soundText.text = "🔇";
      } else {
        that.soundLevel = 1;
        PIXI.sound.volumeAll = 1;
        soundText.text = "🔈";
      }
    };
    this.soundToggle.addChild(soundText);

    var originalTitlePos = this.soundToggle.y;
    var that = this;

    this.soundToggle.click = function (e) {
      gsap.to(that.soundToggle, {
        keyframes: [{
            y: (originalTitlePos - 10),
            duration: 0.3
          },
          {
            y: originalTitlePos,
            duration: 0.3
          }
        ],
        ease: "elastic"
      });

      if (that.soundLevel == 1) {
        that.soundLevel = 0;
        PIXI.sound.volumeAll = 0;
        soundText.text = "🔇";
      } else {
        that.soundLevel = 1;
        PIXI.sound.volumeAll = 1;
        soundText.text = "🔈";
      }
    };
  }

  playMusicMain() {
    // Stop any game music
    if(this.musicGamePlaying == true) {
      this.musicGamePlaying = false;
      this.musicGame.stop();
    }
    // If the main music isnt playing start it
    if(this.musicMainPlaying == false) {
      this.musicMainPlaying = true;
      this.musicMain.play({
        loop: true,
        volume: 0.5
      });
    }
  }

  playMusicGame() {
    // Stop any game music
    if(this.musicMainPlaying == true) {
      this.musicMainPlaying = false;
      this.musicMain.stop();
    }
    // If the main music isnt playing start it
    if(this.musicGamePlaying == false) {
      this.musicGamePlaying = true;
      this.musicGame.play({
        loop: true,
        volume: 0.3
      });
    }
  }

  toggleSound() {

  }

  toggleMusic() {
    if(this.musicOn == true) {
      this.musicOn = false;
      this.musicMain.volume = 0;
    }else{
      this.musicOn = true;
      this.musicMain.volume = 0.3;
    }
  }

  playSound(name) {
    this.resources[name].sound.play();
  }


}
