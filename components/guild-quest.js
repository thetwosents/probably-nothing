// A phaser html5 game that is topdown and connected to Firebase with realtime db used for presence so that
// players can move around the 2d topdown tilemap and see other players.

// A simple react component with firebase and phaser.js
const Game = ({
    firebase,
    game,
    player,
    players,
    playerId,
}) => {
    // Get firebase refs
    const ref = firebase.database().ref();
    const playersRef = ref.child('players');
    const playerRef = playersRef.child(playerId);
    const playerNameRef = playerRef.child('name');
    const playerPosRef = playerRef.child('pos');
    const playerPosXRef = playerPosRef.child('x');
    const playerPosYRef = playerPosRef.child('y');
    const playerPosZRef = playerPosRef.child('z');
    const playerPosRRef = playerPosRef.child('r');

    // Initialize the phaser game
    const gameWidth = '100%';
    const gameHeight = '100vh';
    const gameScale = 1;
    const game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'guild-quest', {
        preload: preload,
        create: create,
        update: update,
        render: render,
    });

    // Initialize the player
    const player = {
        name: '',
        pos: {
            x: 0,
            y: 0,
            z: 0,
            r: 0,
        },
    };

    // Initialize the players
    const players = {};

    // Update the player
    const updatePlayer = () => {
        playerNameRef.set(player.name);
        playerPosXRef.set(player.pos.x);
        playerPosYRef.set(player.pos.y);
        playerPosZRef.set(player.pos.z);
        playerPosRRef.set(player.pos.r);
    };


    // Preload the game assets

    // SWITCH IN ROSCA
    const preload = () => {
        game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tiles.png');
        game.load.image('player', 'assets/player.png');
        game.load.image('enemy', 'assets/enemy.png'); // TODO: make this a sprite sheet
    };

    // Create the game world
    const create = () => {
        // Create the map
        const map = game.add.tilemap('map');
        map.addTilesetImage('tiles');
        const layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();

        // Create the player
        const player = game.add.sprite(0, 0, 'player');
        player.anchor.set(0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.bounce.set(0.8);
        player.body.drag.set(100);
        player.body.maxVelocity.set(200);

        // Create the enemy
        const enemy = game.add.sprite(0, 0, 'enemy');
        enemy.anchor.set(0.5);
        game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.body.collideWorldBounds = true;
        enemy.body.bounce.set(0.8);
        enemy.body.drag.set(100);
        enemy.body.maxVelocity.set(200);

        // Create the cursors
        const cursors = game.input.keyboard.createCursorKeys();

        // Get the players from firebase
        playersRef.on('child_added', (snapshot) => {
            const player = snapshot.val();
            player.id = snapshot.key;
            players[player.id] = player;
        });

        // Update the player
        playerRef.on('value', (snapshot) => {
            const player = snapshot.val();
            player.id = snapshot.key;
            this.player = player;
        });

        // Update the players
        playersRef.on('child_changed', (snapshot) => {
            const player = snapshot.val();
            player.id = snapshot.key;
            players[player.id] = player;
        });

        // Remove the players
        playersRef.on('child_removed', (snapshot) => {
            const player = snapshot.val();
            player.id = snapshot.key;
            delete players[player.id];
        });

        // Get the player's name from firebase
        const playerName = playerNameRef.once('value').then(snapshot => {
            return snapshot.val();
        });

        // Get the player's position from firebase
        const playerPos = playerPosRef.once('value').then(snapshot => {
            return snapshot.val();
        });

        // Get the player's rotation from firebase
        const playerRot = playerPosRef.once('value').then(snapshot => {
            return snapshot.val();
        });

        // Update the player's position
        const updatePlayerPos = () => {
            player.pos.x = playerPosXRef.once('value').then(snapshot => {
                return snapshot.val();
            });
            player.pos.y = playerPosYRef.once('value').then(snapshot => {
                return snapshot.val();
            });
            player.pos.z = playerPosZRef.once('value').then(snapshot => {
                return snapshot.val();
            });
            player.pos.r = playerPosRRef.once('value').then(snapshot => {
                return snapshot.val();
            });
        };

        // Update the player's rotation
        const updatePlayerRot = () => {
            player.pos.r = playerPosRRef.once('value').then(snapshot => {
                return snapshot.val();
            });
        };

        // Update the player's position and rotation
        const updatePlayerPosRot = () => {
            updatePlayerPos();
            updatePlayerRot();
        };

        // Update the player's position and rotation every second
        setInterval(updatePlayerPosRot, 1000);

        // Update the player's position and rotation every second
        setInterval(updatePlayerPosRot, 1000);

        // Render the game
        const render = () => {
            const playerPos = player.pos;
            const playerRot = player.pos.r;
            game.debug.text(`Player: ${playerName}`, 32, 32);
            game.debug.text(`Pos: ${playerPos.x}, ${playerPos.y}, ${playerPos.z}`, 32, 64);
            game.debug.text(`Rot: ${playerRot}`, 32, 96);
        };

        // Update the game
        const update = () => {
            // Update the player's position
            updatePlayerPos();

            // Update the player's rotation
            updatePlayerRot();

            // Update the player
            updatePlayer();

            // Update the players
            Object.keys(players).forEach((playerId) => {
                const player = players[playerId];
                const playerPos = player.pos;
                const playerRot = player.pos.r;
                game.debug.text(`Player: ${player.name}`, 32, 32);
                game.debug.text(`Pos: ${playerPos.x}, ${playerPos.y}, ${playerPos.z}`, 32, 64);
                game.debug.text(`Rot: ${playerRot}`, 32, 96);
            });
        }
        
    };

    // Update the game
    const update = () => {
        // Update the player's position
        updatePlayerPos();

        // Update the player's rotation
        updatePlayerRot();

        // Update the player
        updatePlayer();

        // Update the players
        Object.keys(players).forEach((playerId) => {
            const player = players[playerId];
            const playerPos = player.pos;
            const playerRot = player.pos.r;
            game.debug.text(`Player: ${player.name}`, 32, 32);
            game.debug.text(`Pos: ${playerPos.x}, ${playerPos.y}, ${playerPos.z}`, 32, 64);
            game.debug.text(`Rot: ${playerRot}`, 32, 96);
        });
    }

    // Start the game
    const start = () => {
        game.state.start('main');
    }

    // Create the game
    game.state.add('boot', boot);
    game.state.add('preload', preload);
    game.state.add('main', main);
    game.state.start('boot');
}

export default Game;