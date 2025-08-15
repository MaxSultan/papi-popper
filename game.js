class PapiPopperGame {
    constructor() {
        this.app = null;
        this.player = null;
        this.playerSprites = [];
        this.currentSpriteIndex = 0;
        this.ground = null;
        this.obstacles = [];
        this.powerups = [];
        this.enemies = [];
        this.clouds = [];
        this.score = 0;
        this.gameSpeed = 5;
        this.isGameOver = false;
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.gravity = 0.8;
        this.jumpPower = -15;
        this.groundY = 0;
        this.powerupActive = false;
        this.powerupType = null;
        this.powerupTimer = 0;
        
        this.keys = {};
        this.spriteSheet = null;
        
        this.init();
    }
    
    async init() {
        // Create PIXI Application
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x87CEEB,
            antialias: true
        });
        
        document.getElementById('gameContainer').appendChild(this.app.view);
        
        // Load sprite sheet
        await this.loadSpriteSheet();
        
        // Setup game elements
        this.setupGround();
        this.setupPlayer();
        this.setupClouds();
        this.setupEventListeners();
        
        // Start game loop
        this.app.ticker.add(this.gameLoop.bind(this));
    }
    
    async loadSpriteSheet() {
        try {
            // Use the modern Pixi.js asset loading system
            const texture = await PIXI.Assets.load('./papi-sprite.png');
            console.log('✅ Successfully loaded papi-sprite.png');
            this.createSpritesFromSheet(texture);
        } catch (error) {
            console.log('❌ Error loading sprite sheet, using fallback graphics');
            console.log('Error details:', error);
            this.createFallbackSprites();
        }
    }
    
    createSpritesFromSheet(texture) {
        console.log(`Creating sprites from texture: ${texture.width}x${texture.height}`);
        
        // Define the sprite regions based on the 3x4 grid layout
        // Each sprite should be approximately 1/4 of the width and 1/3 of the height
        const spriteWidth = Math.floor(texture.width / 4);
        const spriteHeight = Math.floor(texture.height / 3);
        
        console.log(`Sprite dimensions: ${spriteWidth}x${spriteHeight}`);
        
        // Create sprites for each of the 8 unique poses (we'll use the first 8 from the 12 total)
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
                const spriteIndex = row * 4 + col;
                if (spriteIndex >= 8) break; // Only use first 8 poses
                
                const rect = new PIXI.Rectangle(
                    col * spriteWidth,
                    row * spriteHeight,
                    spriteWidth,
                    spriteHeight
                );
                
                const spriteTexture = new PIXI.Texture(texture.baseTexture, rect);
                const sprite = new PIXI.Sprite(spriteTexture);
                
                // Scale the sprite to a reasonable size
                const scale = Math.min(120 / spriteHeight, 60 / spriteWidth);
                sprite.scale.set(scale);
                
                sprite.anchor.set(0.5, 1);
                sprite.visible = false;
                this.playerSprites.push(sprite);
                
                console.log(`Created sprite ${spriteIndex}: ${rect.x},${rect.y} ${rect.width}x${rect.height}`);
            }
        }
        
        // Set initial sprite
        if (this.playerSprites.length > 0) {
            this.playerSprites[0].visible = true;
            console.log(`✅ Successfully created ${this.playerSprites.length} sprites`);
        }
    }
    
    createFallbackSprites() {
        // Create placeholder sprites for each pose
        const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFFEAA7, 0xDDA0DD, 0x98D8C8, 0xF7DC6F];
        
        for (let i = 0; i < 8; i++) {
            const sprite = new PIXI.Graphics();
            sprite.beginFill(colors[i % colors.length]);
            sprite.drawRect(0, 0, 60, 120);
            sprite.endFill();
            
            // Add Home Depot apron
            sprite.beginFill(0xFF6600);
            sprite.drawRect(10, 40, 40, 60);
            sprite.endFill();
            
            // Add some details to differentiate poses
            sprite.beginFill(0xFFFFFF);
            if (i === 0) { // Waving
                sprite.drawRect(45, 20, 10, 20);
            } else if (i === 1) { // Double point
                sprite.drawRect(45, 30, 10, 15);
                sprite.drawRect(5, 30, 10, 15);
            } else if (i === 2) { // Jumping
                sprite.drawRect(45, 10, 10, 25);
                sprite.drawRect(5, 80, 10, 15);
            } else if (i === 3) { // Hands up
                sprite.drawRect(45, 20, 10, 20);
                sprite.drawRect(5, 20, 10, 20);
            } else if (i === 4) { // Holding object
                sprite.drawRect(45, 30, 5, 30);
            } else if (i === 5) { // Pointing forward
                sprite.drawRect(45, 40, 10, 15);
            } else if (i === 6) { // Pointing up (bent)
                sprite.drawRect(45, 25, 10, 15);
            } else if (i === 7) { // Pointing up (extended)
                sprite.drawRect(45, 15, 10, 20);
            }
            sprite.endFill();
            
            sprite.anchor.set(0.5, 1);
            sprite.visible = false;
            this.playerSprites.push(sprite);
        }
        
        // Set initial sprite
        this.playerSprites[0].visible = true;
    }
    
    setupGround() {
        this.ground = new PIXI.Graphics();
        this.ground.beginFill(0x8FBC8F);
        this.ground.drawRect(0, 0, this.app.screen.width, 100);
        this.ground.endFill();
        this.ground.y = this.app.screen.height - 100;
        this.groundY = this.app.screen.height - 100;
        
        this.app.stage.addChild(this.ground);
    }
    
    setupPlayer() {
        this.player = new PIXI.Container();
        
        // Add all sprites to player container
        this.playerSprites.forEach(sprite => {
            this.player.addChild(sprite);
        });
        
        this.player.x = 150;
        this.player.y = this.groundY;
        
        this.app.stage.addChild(this.player);
    }
    
    setupClouds() {
        for (let i = 0; i < 5; i++) {
            const cloud = new PIXI.Graphics();
            cloud.beginFill(0xFFFFFF);
            cloud.drawEllipse(0, 0, 30 + Math.random() * 20, 20 + Math.random() * 10);
            cloud.endFill();
            
            cloud.x = Math.random() * this.app.screen.width;
            cloud.y = 50 + Math.random() * 100;
            cloud.speed = 0.5 + Math.random() * 1;
            
            this.clouds.push(cloud);
            this.app.stage.addChild(cloud);
        }
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space' && !this.isJumping && !this.isGameOver) {
                this.jump();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Restart button
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
    }
    
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = this.jumpPower;
            this.changeSprite(2); // Jumping/Leaping pose (top-right in sprite sheet)
        }
    }
    
    changeSprite(index) {
        // Hide all sprites
        this.playerSprites.forEach(sprite => sprite.visible = false);
        
        // Show the selected sprite
        this.playerSprites[index].visible = true;
        this.currentSpriteIndex = index;
    }
    
    createObstacle() {
        // Reduce spawn rate and add minimum distance between obstacles
        if (Math.random() < 0.008) { // Reduced from 0.02 to 0.008
            // Check if there's enough space between obstacles
            const minDistance = 300; // Minimum distance between obstacles
            const lastObstacle = this.obstacles[this.obstacles.length - 1];
            
            if (!lastObstacle || (this.app.screen.width + 50 - lastObstacle.x) > minDistance) {
                const obstacle = new PIXI.Graphics();
                obstacle.beginFill(0x8B4513);
                obstacle.drawRect(0, 0, 30, 60);
                obstacle.endFill();
                
                obstacle.x = this.app.screen.width + 50;
                obstacle.y = this.groundY - 60;
                obstacle.speed = this.gameSpeed;
                
                this.obstacles.push(obstacle);
                this.app.stage.addChild(obstacle);
            }
        }
    }
    
    createPowerup() {
        // Slightly increase powerup spawn rate for better gameplay
        if (Math.random() < 0.008) { // Increased from 0.005 to 0.008
            // Check if there's enough space between powerups
            const minDistance = 500; // Minimum distance between powerups
            const lastPowerup = this.powerups[this.powerups.length - 1];
            
            if (!lastPowerup || (this.app.screen.width + 50 - lastPowerup.x) > minDistance) {
                const powerup = new PIXI.Graphics();
                const types = ['speed', 'shield', 'doubleJump'];
                const type = types[Math.floor(Math.random() * types.length)];
                
                switch(type) {
                    case 'speed':
                        powerup.beginFill(0xFFD700);
                        break;
                    case 'shield':
                        powerup.beginFill(0x4169E1);
                        break;
                    case 'doubleJump':
                        powerup.beginFill(0xFF69B4);
                        break;
                }
                
                powerup.drawCircle(0, 0, 15);
                powerup.endFill();
                
                powerup.x = this.app.screen.width + 50;
                powerup.y = this.groundY - 100;
                powerup.speed = this.gameSpeed;
                powerup.type = type;
                
                this.powerups.push(powerup);
                this.app.stage.addChild(powerup);
            }
        }
    }
    
    createEnemy() {
        // Reduce enemy spawn rate and add spacing
        if (Math.random() < 0.005) { // Reduced from 0.01 to 0.005
            // Check if there's enough space between enemies
            const minDistance = 400; // Minimum distance between enemies
            const lastEnemy = this.enemies[this.enemies.length - 1];
            
            if (!lastEnemy || (this.app.screen.width + 50 - lastEnemy.x) > minDistance) {
                const enemy = new PIXI.Graphics();
                enemy.beginFill(0xFF0000);
                enemy.drawRect(0, 0, 40, 40);
                enemy.endFill();
                
                // Add eyes
                enemy.beginFill(0xFFFFFF);
                enemy.drawCircle(-8, -8, 5);
                enemy.drawCircle(8, -8, 5);
                enemy.endFill();
                
                enemy.beginFill(0x000000);
                enemy.drawCircle(-8, -8, 2);
                enemy.drawCircle(8, -8, 2);
                enemy.endFill();
                
                enemy.x = this.app.screen.width + 50;
                enemy.y = this.groundY - 40;
                enemy.speed = this.gameSpeed;
                
                this.enemies.push(enemy);
                this.app.stage.addChild(enemy);
            }
        }
    }
    
    updatePlayer() {
        // Handle jumping physics
        if (this.isJumping) {
            this.player.y += this.jumpVelocity;
            this.jumpVelocity += this.gravity;
            
            if (this.player.y >= this.groundY) {
                this.player.y = this.groundY;
                this.isJumping = false;
                this.jumpVelocity = 0;
                this.changeSprite(0); // Back to normal waving pose
            }
        }
        
        // Handle horizontal movement
        if (this.keys['ArrowLeft'] && this.player.x > 50) {
            this.player.x -= 5;
            this.changeSprite(5); // Pointing forward pose (middle-middle in sprite sheet)
        } else if (this.keys['ArrowRight'] && this.player.x < this.app.screen.width - 50) {
            this.player.x += 5;
            this.changeSprite(6); // Pointing up bent arm pose (middle-right in sprite sheet)
        } else if (!this.isJumping) {
            this.changeSprite(0); // Normal waving pose (top-left in sprite sheet)
        }
        
        // Power-up effects
        if (this.powerupActive) {
            this.powerupTimer--;
            if (this.powerupTimer <= 0) {
                this.powerupActive = false;
                this.powerupType = null;
                document.getElementById('powerup').textContent = 'Power-up: None';
            }
        }
    }
    
    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.x -= obstacle.speed;
            
            if (obstacle.x < -50) {
                this.app.stage.removeChild(obstacle);
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    updatePowerups() {
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.x -= powerup.speed;
            
            if (powerup.x < -50) {
                this.app.stage.removeChild(powerup);
                this.powerups.splice(i, 1);
            }
        }
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.x -= enemy.speed;
            
            if (enemy.x < -50) {
                this.app.stage.removeChild(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }
    
    updateClouds() {
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x < -100) {
                cloud.x = this.app.screen.width + 100;
                cloud.y = 50 + Math.random() * 100;
            }
        });
    }
    
    checkCollisions() {
        const playerBounds = this.player.getBounds();
        
        // Check obstacle collisions
        this.obstacles.forEach(obstacle => {
            if (this.checkCollision(playerBounds, obstacle.getBounds())) {
                if (!this.powerupActive || this.powerupType !== 'shield') {
                    this.gameOver();
                }
            }
        });
        
        // Check enemy collisions
        this.enemies.forEach(enemy => {
            if (this.checkCollision(playerBounds, enemy.getBounds())) {
                if (!this.powerupActive || this.powerupType !== 'shield') {
                    this.gameOver();
                }
            }
        });
        
        // Check powerup collisions
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            if (this.checkCollision(playerBounds, powerup.getBounds())) {
                this.activatePowerup(powerup.type);
                this.app.stage.removeChild(powerup);
                this.powerups.splice(i, 1);
                this.changeSprite(3); // Hands up celebration pose (top-far-right in sprite sheet)
                setTimeout(() => {
                    if (!this.isJumping) this.changeSprite(0);
                }, 500);
            }
        }
    }
    
    checkCollision(bounds1, bounds2) {
        return bounds1.x < bounds2.x + bounds2.width &&
               bounds1.x + bounds1.width > bounds2.x &&
               bounds1.y < bounds2.y + bounds2.height &&
               bounds1.y + bounds1.height > bounds2.y;
    }
    
    activatePowerup(type) {
        this.powerupActive = true;
        this.powerupType = type;
        this.powerupTimer = 300; // 5 seconds at 60fps
        
        switch(type) {
            case 'speed':
                this.gameSpeed = 8;
                document.getElementById('powerup').textContent = 'Power-up: Speed Boost!';
                break;
            case 'shield':
                document.getElementById('powerup').textContent = 'Power-up: Shield Active!';
                break;
            case 'doubleJump':
                document.getElementById('powerup').textContent = 'Power-up: Double Jump!';
                break;
        }
    }
    
    updateScore() {
        this.score++;
        document.getElementById('score').textContent = `Score: ${this.score}`;
        
        // Increase game speed over time (more gradually)
        if (this.score % 2000 === 0) { // Changed from 1000 to 2000 for slower progression
            this.gameSpeed += 0.3; // Reduced from 0.5 to 0.3 for gentler difficulty increase
            this.obstacles.forEach(obstacle => obstacle.speed = this.gameSpeed);
            this.powerups.forEach(powerup => powerup.speed = this.gameSpeed);
            this.enemies.forEach(enemy => enemy.speed = this.gameSpeed);
        }
    }
    
    gameOver() {
        this.isGameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
        this.changeSprite(4); // Holding object pose (middle-left in sprite sheet) - defeated look
    }
    
    restart() {
        // Reset game state
        this.score = 0;
        this.gameSpeed = 5;
        this.isGameOver = false;
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.powerupActive = false;
        this.powerupType = null;
        this.powerupTimer = 0;
        
        // Reset player position
        this.player.x = 150;
        this.player.y = this.groundY;
        this.changeSprite(0);
        
        // Clear all game objects
        this.obstacles.forEach(obstacle => this.app.stage.removeChild(obstacle));
        this.powerups.forEach(powerup => this.app.stage.removeChild(powerup));
        this.enemies.forEach(enemy => this.app.stage.removeChild(enemy));
        
        this.obstacles = [];
        this.powerups = [];
        this.enemies = [];
        
        // Reset UI
        document.getElementById('score').textContent = 'Score: 0';
        document.getElementById('powerup').textContent = 'Power-up: None';
        document.getElementById('gameOver').style.display = 'none';
    }
    
    gameLoop(delta) {
        if (this.isGameOver) return;
        
        this.updatePlayer();
        this.updateObstacles();
        this.updatePowerups();
        this.updateEnemies();
        this.updateClouds();
        this.checkCollisions();
        this.updateScore();
        
        this.createObstacle();
        this.createPowerup();
        this.createEnemy();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new PapiPopperGame();
});
