var Scene0 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Scene0 ()
    {
        Phaser.Scene.call(this, { key: 'Scene0' });
    },

    preload: function ()
    {
      // map in json format
      this.load.tilemapTiledJSON('map1', 'assets/map/map2.json');
    },

    create: function ()
    {
      // create the map
      var map = this.make.tilemap({ key: 'map1' });

      // first parameter is the name of the tilemap in tiled
      var tiles = map.addTilesetImage('Sol1', 'tiles');
      var tiles0 = map.addTilesetImage('Palmier', 'tiles0');
      var tiles1 = map.addTilesetImage('Palmier', 'tiles0');
      var tiles2 = map.addTilesetImage('Sol1_1', 'tiles2');


      // creating the layers
      var grass = map.createStaticLayer('Grass1', tiles, 0, 0);
      var obstacles = map.createStaticLayer('Obstacles1', tiles0, 0, 0);
      var head = map.createStaticLayer('Head2', tiles1, 0, 0);
      var chemins1 = map.createStaticLayer('Chemins1', tiles2, 0, 0);

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
      this.player = this.physics.add.sprite(50, 100, 'player', 6);

      // don't go out of the map
      this.physics.world.bounds.width = map.widthInPixels;
      this.physics.world.bounds.height = map.heightInPixels;
      this.player.setCollideWorldBounds(true);

      // don't walk on trees
      this.physics.add.collider(this.player, obstacles);
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
      }
      // add collider
      this.physics.add.overlap(this.player, this.spawns, this.nextscene, false, this);
  },

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
