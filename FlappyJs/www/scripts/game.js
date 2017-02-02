// Create our 'main' state that will contain the game
var mainState = {
    preload: function () {
        // This function will be executed at the beginning
        // That's where we load the images and sounds
        // Load the bird sprite
        game.load.image('bird', 'images/bird.png');

        // Load the logos
        game.load.image('ionic', 'images/ionic.png');
        game.load.image('typescript', 'images/typescript.png');
        game.load.image('jquery', 'images/jquery.png');
        game.load.image('angular', 'images/angular.png');
        game.load.image('react', 'images/react.png');
        game.load.image('ember', 'images/ember.png');
        game.load.image('aurelia', 'images/aurelia.png');
        game.load.image('meteor', 'images/meteor.png');
        game.load.image('backbone', 'images/backbone.png');
        game.load.image('polymer', 'images/polymer.png');
        game.load.image('knockout', 'images/knockout.png');
        game.load.image('vue', 'images/vue.png');
        game.load.image('node', 'images/nodejs.png');
        game.load.image('electron', 'images/electron.png');
        game.load.image('webpack', 'images/webpack.png');
        game.load.image('yo', 'images/yo.png');
        game.load.image('grunt', 'images/grunt.png');
        game.load.image('bower', 'images/bower.png');
        game.load.image('gulp', 'images/gulp.png');

        game.load.audio('jump', 'sounds/jump.wav');
        game.load.audio('gameover', 'sounds/gameover.wav');
    },

    create: function () {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.

        // Change the background color of the game to blue
        game.stage.backgroundColor = '#b9feff';

        this.jumpSound = game.add.audio('jump');
        this.gameOverSound = game.add.audio('gameover');

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1000;

        // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, 0.5);

        // Call the 'jump' function when the screen is taped
        game.input.onTap.add(this.jump, this);

        // Create an empty group
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });
    },

    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > window.innerHeight) {
            this.restartGame();
        }

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        if (this.bird.angle < 20)
            this.bird.angle += 1;
    },

    // Make the bird jump
    jump: function () {
        if (this.bird.alive == false)
            return;

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({ angle: -20 }, 100);

        // And start the animation
        animation.start();

        this.jumpSound.play();
    },

    // Restart the game
    restartGame: function () {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

    pipeLogos: [
        'ionic',
        'typescript',
        'jquery',
        'angular',
        'react',
        'ember',
        'aurelia',
        'meteor',
        'backbone',
        'polymer',
        'knockout',
        'vue',
        'node',
        'electron',
        'webpack',
        'yo',
        'grunt',
        'bower',
        'gulp'
    ],

    addOnePipe: function (x, y) {
        var logo = this.pipeLogos[Math.floor(Math.random() * this.pipeLogos.length)];

        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, logo);

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function () {
        var pipeHeight = (window.innerHeight) / 8;

        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * pipeHeight + 10);

        this.score += 1;
        this.labelScore.text = this.score;
    },

    hitPipe: function () {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        this.gameOverSound.play();

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    },
};

var game = new Phaser.Game(window.innerWidth, window.innerHeight);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');