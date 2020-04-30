
var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        // map tiles
        this.load.image('tiles', 'assets/map/Sol1.png');
        this.load.image('tiles0', 'assets/map/Decors.png');
        this.load.image('tiles3', 'assets/map/Palmier.png');
        this.load.image('tiles2', 'assets/map/Sol1_1.png');
        this.load.image('tilesE', 'assets/map/epee.png');
        this.load.image('life1','assets/vie1.png');
        this.load.image('life2','assets/vie2.png');
        this.load.image('life3','assets/vie3.png');
        this.load.image('gold','assets/or.png');
        this.load.image('arme1','assets/epee.png');
        this.load.image('passage','assets/passage.png');

        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/map/mapun.json');

        // our two characters
        this.load.spritesheet('player', 'assets/Perso11.png', { frameWidth: 31, frameHeight: 31 });
        this.load.spritesheet('loup', 'assets/Loup2.png', { frameWidth: 32, frameHeight: 32 });
    },

    create: function ()
    {
        // start the WorldScene
        this.scene.start('WorldScene');
    }
});
var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },
    preload: function ()
    {

    },

    create: function ()
    {


        this.vie = 3;
        this.score = 0;
        this.niveau = 1;
        // create the map
        var map = this.make.tilemap({ key: 'map' });

        // Tiles
          //Herbe :
          var tiles = map.addTilesetImage('Sol1', 'tiles');
          //Obstacles :
          var tiles0 = map.addTilesetImage('Decors', 'tiles0');
          //Haut des arbres :
          var tiles1 = map.addTilesetImage('Decors', 'tiles0');
          //Chemins :
          var tiles2 = map.addTilesetImage('Sol1_1', 'tiles2');
          //Map2
            //Obstacles :
            var tiles3 = map.addTilesetImage('Palmier', 'tiles3');
            //Haut des arbres :
            var tiles4 = map.addTilesetImage('Palmier', 'tiles3');


        //Layers :
        //Map 1 :
        var grass = map.createStaticLayer('Grass1', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles1', tiles0, 0, 0);
        var head = map.createStaticLayer('Head2', tiles1, 0, 0);
        var chemins1 = map.createStaticLayer('Chemins1', tiles2, 0, 0);
        //Map 2 :
        var headss = map.createStaticLayer('Headss', tiles4, 0, 0);

        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);

        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [3, 4, 5 ]}),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [6, 7, 8 ] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [9, 10, 11 ]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1, 2 ] }),
            frameRate: 10,
            repeat: -1
        });
        this.life1 = this.add.image(60,20,'life1').setScale(0.15);
        this.life2 = this.add.image(60,20,'life2').setScale(0.15);
        this.life3 = this.add.image(60,20,'life3').setScale(0.15);
        // our player sprite created through the phycis system
        this.loup = this.physics.add.sprite(50, 450, 'loup').setScale(1.5);
        this.loup2 = this.physics.add.sprite(600, 200, 'loup').setScale(1.5);
        this.spawns = this.physics.add.group({ key: 'passage',setXY: {x:790,y:65,stepX:50} });

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(50, 200, 'player', 6);

        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);




        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);
        this.physics.add.collider(this.loup, this.player, this.hitMonstre, null, this);
        this.physics.add.collider(this.loup, this.player, this.deadLoup, null, this);
        this.physics.add.collider(this.loup2, this.player, this.hitMonstre, null, this);
        this.physics.add.collider(this.loup2, this.player, this.deadLoup2, null, this);
        this.physics.add.collider(this.loup, obstacles);
        this.physics.add.collider(this.loup2, obstacles);


        this.gold = this.physics.add.group({ key: 'gold',setXY: {x:400,y:500,stepX:50} });
        this.gold1 = this.physics.add.group({ key: 'gold',setXY: {x:790,y:250,stepX:50} });
        this.arme1 = this.physics.add.group({ key: 'arme1',setXY: {x:200,y:500,stepX:50} });
        // add collider
        this.physics.add.overlap(this.player, this.gold, this.collectgold, false, this);
        this.physics.add.overlap(this.player, this.gold1, this.collectgold1, false, this);
        this.physics.add.overlap(this.player, this.arme1, this.collectarme1, false, this);
        this.physics.add.overlap(this.player, this.spawns, this.nextscene, false, this);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
        //anim loup
  this.tweens.add({
      targets: this.loup,
      x: 270,
      duration: 4500,
      ease: 'Power2',
      yoyo: true,
      delay: 1500,
      repeat: -1

  });
  this.tweens.add({
      targets: this.loup2,
      y: 270,
      duration: 4500,
      ease: 'Power2',
      yoyo: true,
      delay: 1500,
      repeat: -1

  });

  scoreText = this.add.text(0,40, 'Gold : 0', {fontSize: '25px', fontFamily: 'Courier', strokeThickness: '5', color:'#FFF', stroke:'#000'});
  niveauText = this.add.text(2,70, 'Level : 1', {fontSize: '20px', fontFamily: 'Courier', strokeThickness: '5', color:'#FFF', stroke:'#000'});
  textcapa1 = this.add.text(200, 200," ", { font: "20px Arial", fill: "#FFF", backgroundColor:'black'	,align: "center" });
  this.input.on('pointerdown', function (pointer) {
    if(pointer.leftButtonDown())
      {
        textcapa1.destroy(true);
      }
    }, this);
    // limit camera to map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true; // avoid tile bleed
    },


    //Fonction collect gold
  collectgold: function(player, gold){
    gold.destroy(true);
    	this.score += 100;
      scoreText.setText('Gold : '+this.score);
    },
    collectgold1: function(player, gold1){
      gold1.destroy(true);
      	this.score += 100;
        scoreText.setText('Gold : '+this.score);
      },
    collectarme1:function(player, arme1){
      arme1.destroy(true);
      this.niveau += 1;
      niveauText.setText('Level : '+this.niveau);
    },
    //Fonction Hit loup
    hitMonstre: function (player, loup, loup2){
    	this.vie --;
    },
    deadLoup: function (player, loup){
      this.loup.destroy(true);
      this.gold = this.physics.add.group({ key: 'gold',setXY: {x:50,y:450,stepX:50} });
      this.physics.add.overlap(this.player, this.gold, this.collectgold, false, this);
    },
    deadLoup2: function (player, loup2){
      this.loup2.destroy(true);
      this.gold = this.physics.add.group({ key: 'gold',setXY: {x:600,y:200,stepX:50} });
      this.physics.add.overlap(this.player, this.gold, this.collectgold, false, this);
    },
    nextscene: function (player, obstacles){
       //start battle
      this.scene.switch('Scene0');
    },
    update: function (time, delta)
    {
      var pointer = this.input.activePointer;
    //    this.controls.update(delta);
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-300);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(300);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-300);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(300);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);

        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);

        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
        if (this.niveau == 1){
        if (this.vie == 2){
          this.life3.destroy(true);
        }
        else if (this.vie == 1){
          this.life2.destroy(true);
        }
        else if (this.vie == 0){
          this.life1.destroy(true);
          this.physics.pause();
          this.player.setTint(0xff0000);
          this.player.anims.play('turn');
          gameOver = true;
          this.vie = 3;
        }
      }
      else if (this.niveau == 2){
        this.deadLoup;
        textcapa1.setText( "Bien joué tu a passé le niveau 2 !\nTu a débloquer la capacité de tué les loups !");
      }
    }
});
