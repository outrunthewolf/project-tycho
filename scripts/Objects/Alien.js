
// ES6 Class adding a method to the Person prototype
class Alien {
  constructor(app, loader, resources) {
    this.stage = app.stage;
    this.app = app;
    this.menuHolder = { };
    this.loader = loader;
    this.resources = resources;

    //
    this.levels_attack_array = this.generateLevelsAttackArray(); // The array of levels and attacks
    this.amount_of_attacks_per_level = 5;

    //
    this.current_attack = 0;
    this.current_level = 0;

    //
    this.alienContainer = new PIXI.Container();
    this.attack = false;

    // Load in the alien
    const alienTextures = [];
    var arraySize = Object.keys(this.resources.alienAnimated.spritesheet.data.frames).length;

    for (var i = 0; i < arraySize; i++) {
      const framekey = `alien-animated ${i}.aseprite`;
      const texture = PIXI.Texture.from(framekey);
      const time = this.resources.alienAnimated.spritesheet.data.frames[framekey].duration;
      alienTextures.push({ texture, time });
    }
    this.alien = new PIXI.AnimatedSprite(alienTextures);
    this.alien.height = 100;
    this.alien.width = 100;
    this.alien.alpha = 1;
    this.alien.vx = 0;
    this.alien.vy = 0;
    this.alien.name = "alien";
    this.alienContainer.addChild(this.alien);

    // Load in the alien explosion
    const alienExplosionTextures = [];
    var arraySize = Object.keys(this.resources.explosionAnimated.spritesheet.data.frames).length;

    for (var i = 0; i < arraySize; i++) {
      const framekey = `background-explosion-animated ${i}.aseprite`;
      const texture = PIXI.Texture.from(framekey);
      const time = this.resources.explosionAnimated.spritesheet.data.frames[framekey].duration;
      alienExplosionTextures.push({ texture, time });
    }
    this.alienExplosion = new PIXI.AnimatedSprite(alienExplosionTextures);
    this.alienExplosion.y = 0;
    this.alienExplosion.x = 0;
    this.alienExplosion.height = 100;
    this.alienExplosion.width = 100;
    this.alienExplosion.vx = 0;
    this.alienExplosion.vy = 0;
    this.alienExplosion.alpha = 0;
    this.alienExplosion.loop = false;
    this.alienExplosion.animationSpeed = 5;
    this.alienExplosion.name = "alienExplosion";
    this.alienContainer.addChild(this.alienExplosion);

    // Add in listener for win so we explode the alien
    var that = this;
    document.body.addEventListener("win", function (e) {
      gsap.to(that.alienExplosion, {alpha: 1, duration: 0, x: (that.alienContainer.width / 2) - (that.alienExplosion.width / 2), y: that.alien.y, onComplete: function() {
        that.alienExplosion.gotoAndPlay(0);
      }});
    });
  }

  /**
   *
   */
  generateLevelsAttackArray() {
    var attackPool = [{
        name: "rock",
        texture: "attackIconRock"
      },{
        name: "scissors",
        texture: "attackIconScissors"
      },{
        name: "paper",
        texture: "attackIconPaper"
      }];

    var levelsPool = [{
        name: "level-1",
        speed: 2,
        attacks: [ ]
      },
      {
        name: "level-2",
        speed: 3,
        attacks: [ ]
      },
      {
        name: "level-3",
        speed: 4,
        attacks: [ ]
      },
      {
        name: "level-4",
        speed: 5,
        attacks: [ ]
      },
      {
        name: "level-5",
        speed: 6,
        attacks: [ ]
      }];

    // Loop system and return the levels we need
    for (var y = 0; y < levelsPool.length; y++) {
      var attacks = [ ];
      for (var i = 0; i < 5; i++) {
           var randomChar = attackPool[Math.floor(Math.random() * attackPool.length)];
           attacks.push(randomChar);
      }
      levelsPool[y].attacks = attacks;
    }

    return levelsPool;
  }

  /**
   *
   */
  nextLevelOrAttack() {
    // have we reached the end of the level?
    if (this.reachedEndOfLevel() == true) {
      // Have we reached the end of the game?
      if (this.reachedEndOfGame() == true) {
        return false;
      }else{
        document.body.dispatchEvent(new CustomEvent("event:nextlevel", {
          bubbles: true
        }));

        ++this.current_level;
        this.current_attack = 0;
        return true;
      }
    }else{
      ++this.current_attack;
      return true;
    }
  }

  /**
   * Have we reached the end of the level?
   */
  reachedEndOfLevel() {
    var level = this.current_level;
    var attack = this.current_attack;

    var attack_length = this.levels_attack_array[level].attacks.length - 1;

    if (this.current_attack >= attack_length) {
      return true;
    }else{
      return false;
    }
  }

  /**
   * Have we reached the end of the level?
   */
  reachedEndOfGame() {
    var level = this.current_level;
    var level_length = this.levels_attack_array.length - 1;

    if (this.current_level >= level_length) {
      return true;
    }else{
      return false;
    }
  }

  /**
   * Get the next level or return false if we've reached the end
   */
  getNextLevel() {
    var level = this.current_level;

    if ((this.current_level + 1) > this.levels_attack_array.length) {
      return false;
    }

    if ((this.current_level + 1) <= this.levels_attack_array.length) {
      return this.current_level + 1;
    }
  }

  /**
   *
   */
  destroyCurrentAttack() {
    if (this.attack) {
      this.attack.destroy();
      this.attack = false;
    }
  }

  /**
   *
   */
  renderCurrentAttack() {
    var currentAttack = this.levels_attack_array[this.current_level].attacks[this.current_attack];

    if (this.attack) {
      this.attack.y += this.levels_attack_array[this.current_level].speed;
    } else {
      this.attack = new PIXI.Sprite(this.resources[currentAttack.texture].texture);
      this.attack.width = 40;
      this.attack.height = 40;
      this.attack.tint = 0xd74e09;
      this.attack.x = (this.alienContainer.width / 2) - (this.attack.width / 2);
      this.attack.y = 55;
      this.attack.alpha = 1;
      this.attack.name = currentAttack.name;

      this.alienContainer.addChild(this.attack);
    }
  }


  /**
   * Render the alien and its objects
   */
  getRenderable() {
    return this.alienContainer;
  }
}
