var FinScene = new Phaser.Class({


    Extends: Phaser.Scene,

    initialize:

    function FinScene ()
    {
        Phaser.Scene.call(this, { key: 'FinScene' });
    },
preload: function ()
{

        // our two characters
        this.load.spritesheet('player', 'assets/Perso11.png', { frameWidth: 31, frameHeight: 31 });
    },

    create: function ()
    {

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
        this.player = this.physics.add.sprite(10, 50, 'player', 6);

        // don't go out of the map
        this.player.setCollideWorldBounds(true);

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();


  finText = this.add.text(325,100, 'FIN', {fontSize: '70px', fontFamily: 'Courier', strokeThickness: '5', color:'#FFF', stroke:'#000'});
  finText1 = this.add.text(290,200, 'Merci !', {fontSize: '70px', fontFamily: 'Courier', strokeThickness: '5', color:'#FFF', stroke:'#000'});

    },



    update: function (time, delta)
    {
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
      }
});
