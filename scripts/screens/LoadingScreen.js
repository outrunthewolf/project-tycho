// ES6 Class adding a method to the Person prototype
class LoadingScreen {
  constructor(app, loader, resources) {
    this.stage = app.stage;
    this.app = app;
    this.backgroundHolder = { };
    this.loader = loader;
    this.resources = { };

    // Load any static images
    this.loader.add('backgroundPrimary', 'resources/images/background-primary.png');
    this.loader.add('backgroundRules', 'resources/images/background-rules.png');
    this.loader.add('btnPrimaryLarge', 'resources/images/btn-primary-up.png');
    this.loader.add('btnPrimarySmall', 'resources/images/btn-primary-small.png');
    this.loader.add('btnPrimarySmallPause', 'resources/images/btn-primary-small-pause.png');
    this.loader.add('btnPrimarySmallSkip', 'resources/images/btn-primary-small-skip.png');
    this.loader.add('avatarRock', 'resources/images/rock.png');
    this.loader.add('avatarPaper', 'resources/images/radial-bg-paper.png');
    this.loader.add('avatarScissors', 'resources/images/scissors.png');
    this.loader.add('backgroundMoon', 'resources/images/background-moon.png');
    this.loader.add('healthBar', 'resources/images/health-bar.png');

    // Radial icons
    this.loader.add('radialIconRock', 'resources/images/radial-icon-rock.png');
    this.loader.add('radialIconPaper', 'resources/images/radial-icon-paper.png');
    this.loader.add('radialIconScissors', 'resources/images/radial-icon-scissors.png');

    // Attack icons
    this.loader.add('attackIconRock', 'resources/images/attack-icon-rock.png');
    this.loader.add('attackIconPaper', 'resources/images/attack-icon-paper.png');
    this.loader.add('attackIconScissors', 'resources/images/attack-icon-scissors.png');

    // Storyboard stuff
    this.loader.add('backgroundStoryIntro1', 'resources/storyboard/background-story-intro1.jpg');
    this.loader.add('backgroundStoryIntro2', 'resources/storyboard/background-story-intro2.jpg');
    this.loader.add('backgroundStoryIntro3', 'resources/storyboard/background-story-intro3.jpg');

    // Load animates sprites
    this.loader.add('backgroundBattleAnimated', 'resources/sprites/background-battle-animated.json');
    this.loader.add('alienAnimated', 'resources/sprites/alien-animated.json');
    this.loader.add('backgroundFlashAnimated', 'resources/sprites/background-flash-animated.json');
    this.loader.add('moonAnimated', 'resources/sprites/background-moon-animated.json');
    this.loader.add('explosionAnimated', 'resources/sprites/background-explosion-animated.json');
    this.loader.add('explosionVerticalAnimated', 'resources/sprites/background-explosion-vertical-animated.json');

    // Sound
    this.loader.add('musicMain', 'resources/sounds/music/the_laboratory_loop.wav');
    this.loader.add('musicGame', 'resources/sounds/music/jump_and_shoot_man_loop.wav');

    //this.loader.add('soundAlienAttack', 'resources/sounds/Bomb_Explosion.wav');
    this.loader.add('soundHumanAttack', 'resources/sounds/Bomb_Explosion.wav');
    this.loader.add('soundAlienDropAttack', 'resources/sounds/Shoot3.wav');
    this.loader.add('soundHumanDropDefense', 'resources/sounds/Laser.wav');
    this.loader.add('soundWin', 'resources/sounds/Magic.wav');
    this.loader.add('soundDraw', 'resources/sounds/Magic2.wav');
    this.loader.add('soundLose', 'resources/sounds/Monster2.wav');
    this.loader.add('soundNextLevel', 'resources/sounds/Find_Item.wav');
    /**
     * Alien Hits Player - Bomb_Explosion.wav
     * Human Hits Alien - Bomb_Explosion.wav
     * Alien Drops attack - Shoot3.wav
     * Human Drops defense - Health.wav
     * Win - Magic.wav
     * Draw - Magic2.wav
     * Lose - Monster1.wav
     */
  }

  /**
   * Load all resources
   */
  load() {
    this.loadingContainer = new PIXI.Container();
    this.stage.addChild(this.loadingContainer);

    // Show loading...
    var loadingText = new PIXI.Text("Loading...", new PIXI.TextStyle({
      fontSize: 25,
      fill: '#d74e09',//red ,//'#f0f0c9'// white,
      align: 'center'
    }));
    loadingText.x = (this.app.view.width / 2) - (loadingText.width / 2);
    loadingText.y = (this.app.view.height / 2);
    this.loadingContainer.addChild(loadingText);

    this.loader.load();
  }

  /**
   *
   */
  destroy() {
    this.loadingContainer.destroy();
  }

}
