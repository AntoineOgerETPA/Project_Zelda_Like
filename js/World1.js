
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
        this.load.image('tiles2', 'assets/map/Sol1_1.png');
        this.load.image('tilesE', 'assets/map/epee.png');
        this.load.image('life1','assets/vie1.png');
        this.load.image('life2','assets/vie2.png');
        this.load.image('life3','assets/vie3.png');

        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/map/map3.json');

        // our two characters
        this.load.spritesheet('player', 'assets/Perso11.png', { frameWidth: 31, frameHeight: 31 });
        this.load.spritesheet('loup', 'assets/loup.png', { frameWidth: 32, frameHeight: 32 });
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


      life1 = this.add.image(400,300,'life1').setScale(0.25);
      life2 = this.add.image(400,300,'life2').setScale(0.25);
      life3 = this.add.image(400,300,'life3').setScale(0.25);
        // create the map
        var map = this.make.tilemap({ key: 'map' });

        // first parameter is the name of the tilemap in tiled
        var tiles = map.addTilesetImage('Sol1', 'tiles');
        var tiles0 = map.addTilesetImage('Decors', 'tiles0');
        var tiles1 = map.addTilesetImage('Decors', 'tiles0');
        var tiles2 = map.addTilesetImage('Sol1_1', 'tiles2');
        var tilesE = map.addTilesetImage('epee', 'tilesE');


        // creating the layers
        var grass = map.createStaticLayer('Grass1', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles1', tiles0, 0, 0);
        var head = map.createStaticLayer('Head2', tiles1, 0, 0);
        var chemins1 = map.createStaticLayer('Chemins1', tiles2, 0, 0);
        var epee3 = map.createStaticLayer('Epee3', tilesE, 0, 0);

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

        // our player sprite created through the phycis system
        this.loup = this.physics.add.sprite(50, 450, 'loup', 6);


        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(50, 200, 'player', 6);

        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        // don't walk on trees
        this.physics.add.collider(this.player, this.loup, obstacles, epee3);
        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();

        // where the enemies will be
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for(var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 20, 20);


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
        }
        // add collider
        this.physics.add.overlap(this.player, this.spawns, false, this);

    },
      //nextscene: function (player, obstacles){
        // start battle
        //this.scene.switch('Scene0');
  //  },

    update: function (time, delta)
    {

    //    this.controls.update(delta);

        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
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
      }
});
