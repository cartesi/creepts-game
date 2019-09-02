var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Anuto;
(function (Anuto) {
    var EnemiesSpawner = /** @class */ (function () {
        function EnemiesSpawner(engine) {
            this.engine = engine;
        }
        EnemiesSpawner.prototype.getEnemy = function () {
            var enemy = null;
            var partialTicks = this.engine.ticksCounter - this.engine.lastWaveTick;
            if (partialTicks % this.engine.enemySpawningDeltaTicks === 0 && this.engine.waveEnemies.length > 0) {
                var nextEnemyData = this.engine.waveEnemies[0];
                if (nextEnemyData.t === partialTicks / this.engine.enemySpawningDeltaTicks) {
                    switch (nextEnemyData.type) {
                        case Anuto.GameConstants.ENEMY_SOLDIER:
                            enemy = new Anuto.Enemy(Anuto.GameConstants.ENEMY_SOLDIER, this.engine.ticksCounter, this.engine);
                            break;
                        case Anuto.GameConstants.ENEMY_RUNNER:
                            enemy = new Anuto.Enemy(Anuto.GameConstants.ENEMY_RUNNER, this.engine.ticksCounter, this.engine);
                            break;
                        case Anuto.GameConstants.ENEMY_HEALER:
                            enemy = new Anuto.HealerEnemy(this.engine.ticksCounter, this.engine);
                            break;
                        case Anuto.GameConstants.ENEMY_BLOB:
                            enemy = new Anuto.Enemy(Anuto.GameConstants.ENEMY_BLOB, this.engine.ticksCounter, this.engine);
                            break;
                        case Anuto.GameConstants.ENEMY_FLIER:
                            enemy = new Anuto.Enemy(Anuto.GameConstants.ENEMY_FLIER, this.engine.ticksCounter, this.engine);
                            break;
                        default:
                    }
                    // cada ronda que pasa los enemigos tienen mas vida
                    var extraLife = Math.round(enemy.life * (this.engine.round / 10));
                    enemy.life += extraLife;
                    enemy.maxLife = enemy.life;
                    this.engine.waveEnemies.shift();
                }
            }
            return enemy;
        };
        return EnemiesSpawner;
    }());
    Anuto.EnemiesSpawner = EnemiesSpawner;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Turret = /** @class */ (function () {
        function Turret(type, p, engine) {
            this.engine = engine;
            this.id = engine.turretId;
            engine.turretId++;
            this.creationTick = this.engine.ticksCounter;
            this.type = type;
            this.f = 0;
            this.level = 1;
            this.maxLevel = 10;
            this.grade = 1;
            this.inflicted = 0;
            this.position = p;
            this.fixedTarget = true;
            this.shootingStrategyIndex = 0;
            this.shootingStrategy = Anuto.GameConstants.STRATEGYS_ARRAY[this.shootingStrategyIndex];
            this.readyToShoot = true;
            this.enemiesWithinRange = [];
            this.followedEnemy = null;
            this.x = this.position.c + .5;
            this.y = this.position.r + .5;
            this.value = this.engine.turretData[this.type].price;
            this.sellValue = Math.round(this.engine.turretData[this.type].price * Turret.DOWNGRADE_PERCENT);
        }
        Turret.prototype.destroy = function () {
            //
        };
        Turret.prototype.update = function () {
            this.enemiesWithinRange = this.getEnemiesWithinRange();
            if (this.readyToShoot) {
                // si es la de las minas no necesita tener a enemigos en rango
                if (this.type === Anuto.GameConstants.TURRET_LAUNCH && this.grade === 2) {
                    this.readyToShoot = false;
                    this.shoot();
                }
                else {
                    if (this.enemiesWithinRange.length > 0) {
                        this.readyToShoot = false;
                        this.shoot();
                    }
                }
            }
            else {
                this.f++;
                if (this.f >= this.reloadTicks) {
                    this.readyToShoot = true;
                    this.f = 0;
                }
            }
        };
        Turret.prototype.improve = function () {
            this.value += this.priceImprovement;
            this.sellValue += Math.round(this.priceImprovement * Turret.DOWNGRADE_PERCENT);
            this.level++;
            this.calculateTurretParameters();
        };
        Turret.prototype.upgrade = function () {
            this.value += this.priceUpgrade;
            this.sellValue += Math.round(this.priceUpgrade * Turret.DOWNGRADE_PERCENT);
            this.grade++;
            this.level = 1;
            if (this.grade === 3 && this.type !== Anuto.GameConstants.TURRET_GLUE) {
                this.maxLevel = 15;
            }
            this.f = 0;
            this.calculateTurretParameters();
        };
        Turret.prototype.setNextStrategy = function () {
            this.shootingStrategyIndex = this.shootingStrategyIndex === Anuto.GameConstants.STRATEGYS_ARRAY.length - 1 ? 0 : this.shootingStrategyIndex + 1;
            this.shootingStrategy = Anuto.GameConstants.STRATEGYS_ARRAY[this.shootingStrategyIndex];
        };
        Turret.prototype.setFixedTarget = function () {
            this.fixedTarget = !this.fixedTarget;
        };
        Turret.prototype.calculateTurretParameters = function () {
            this.reloadTicks = Math.floor(Anuto.GameConstants.RELOAD_BASE_TICKS * this.reload);
        };
        Turret.prototype.shoot = function () {
            // override
        };
        Turret.prototype.getEnemiesWithinRange = function () {
            var enemiesAndSquaredDistances = [];
            var squaredRange = Anuto.MathUtils.fixNumber(this.range * this.range);
            for (var i = 0; i < this.engine.enemies.length; i++) {
                var enemy = this.engine.enemies[i];
                if (enemy.life > 0 && enemy.l < this.engine.enemiesPathCells.length - 1.5 && !enemy.teleporting) {
                    var dx = this.x - enemy.x;
                    var dy = this.y - enemy.y;
                    var squaredDist = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                    if (squaredRange >= squaredDist) {
                        enemiesAndSquaredDistances.push({ enemy: enemy, squareDist: squaredDist });
                    }
                }
            }
            if (enemiesAndSquaredDistances.length > 1 && (this.type === Anuto.GameConstants.TURRET_PROJECTILE || this.type === Anuto.GameConstants.TURRET_LASER)) {
                // ordenar a los enemigos dentro del radio de acción según la estrategia de disparo
                switch (this.shootingStrategy) {
                    case Anuto.GameConstants.STRATEGY_SHOOT_LAST:
                        enemiesAndSquaredDistances = Anuto.MathUtils.mergeSort(enemiesAndSquaredDistances, function (e1, e2) { return e1.enemy.l - e2.enemy.l; });
                        break;
                    case Anuto.GameConstants.STRATEGY_SHOOT_CLOSEST:
                        enemiesAndSquaredDistances = Anuto.MathUtils.mergeSort(enemiesAndSquaredDistances, function (e1, e2) { return e1.squareDist - e2.squareDist; });
                        break;
                    case Anuto.GameConstants.STRATEGY_SHOOT_WEAKEST:
                        enemiesAndSquaredDistances = Anuto.MathUtils.mergeSort(enemiesAndSquaredDistances, function (e1, e2) { return e1.enemy.life - e2.enemy.life; });
                        break;
                    case Anuto.GameConstants.STRATEGY_SHOOT_STRONGEST:
                        enemiesAndSquaredDistances = Anuto.MathUtils.mergeSort(enemiesAndSquaredDistances, function (e1, e2) { return e2.enemy.life - e1.enemy.life; });
                        break;
                    case Anuto.GameConstants.STRATEGY_SHOOT_FIRST:
                        enemiesAndSquaredDistances = Anuto.MathUtils.mergeSort(enemiesAndSquaredDistances, function (e1, e2) { return e2.enemy.l - e1.enemy.l; });
                        break;
                    default:
                }
            }
            var enemies = [];
            for (var i = 0; i < enemiesAndSquaredDistances.length; i++) {
                enemies.push(enemiesAndSquaredDistances[i].enemy);
            }
            return enemies;
        };
        Turret.DOWNGRADE_PERCENT = .9;
        return Turret;
    }());
    Anuto.Turret = Turret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Enemy = /** @class */ (function () {
        function Enemy(type, creationTick, engine) {
            this.id = engine.enemyId;
            engine.enemyId++;
            this.creationTick = creationTick;
            this.engine = engine;
            this.type = type;
            this.enemyData = this.engine.enemyData[this.type];
            this.life = this.enemyData.life;
            this.maxLife = this.enemyData.life;
            this.value = this.enemyData.value;
            this.speed = this.enemyData.speed;
            this.affectedByGlue = false;
            this.glueIntensity = 0;
            this.affectedByGlueBullet = false;
            this.glueIntensityBullet = 0;
            this.glueDuration = 0;
            this.glueTime = 0;
            this.hasBeenTeleported = false;
            this.teleporting = false;
            this.l = 0;
            this.t = 0;
            var p = this.engine.getPathPosition(this.l);
            this.x = p.x;
            this.y = p.y;
            this.boundingRadius = .4; // en proporcion al tamaño de las celdas
        }
        Enemy.prototype.destroy = function () {
            // de momento nada
        };
        Enemy.prototype.update = function () {
            if (this.teleporting) {
                this.t++;
                if (this.t === 8) {
                    this.teleporting = false;
                }
                return;
            }
            var speed = this.speed;
            // si esta encima de pegamento hacer que vaya mas lento
            if (this.affectedByGlue) {
                speed = Anuto.MathUtils.fixNumber(this.speed / this.glueIntensity);
            }
            if (this.affectedByGlueBullet) {
                speed = Anuto.MathUtils.fixNumber(this.speed / this.glueIntensityBullet);
                if (this.glueDuration <= this.glueTime) {
                    this.affectedByGlueBullet = false;
                    this.glueTime = 0;
                }
                else {
                    this.glueTime++;
                }
            }
            this.l = Anuto.MathUtils.fixNumber(this.l + speed);
            if (this.l >= this.engine.enemiesPathCells.length - 1) {
                this.x = this.engine.enemiesPathCells[this.engine.enemiesPathCells.length - 1].c;
                this.y = this.engine.enemiesPathCells[this.engine.enemiesPathCells.length - 1].r;
                this.engine.onEnemyReachedExit(this);
            }
            else {
                var p = this.engine.getPathPosition(this.l);
                this.x = p.x;
                this.y = p.y;
            }
        };
        Enemy.prototype.teleport = function (teleportDistance) {
            this.hasBeenTeleported = true;
            this.teleporting = true;
            this.t = 0;
            this.l -= teleportDistance;
            if (this.l < 0) {
                this.l = 0;
            }
            var p = this.engine.getPathPosition(this.l);
            this.x = p.x;
            this.y = p.y;
        };
        Enemy.prototype.glue = function (glueIntensity) {
            this.affectedByGlue = true;
            this.glueIntensity = glueIntensity;
        };
        Enemy.prototype.hit = function (damage, bullet, mortar, mine, laserTurret) {
            if (this.life <= 0) {
                return;
            }
            this.life -= damage;
            if (bullet && bullet.turret) {
                // console.log("BULLET " + bullet.turret.id + ": " + Math.round(damage) + " " + GameVars.ticksCounter);
                bullet.turret.inflicted += Math.round(damage);
            }
            else if (mortar && mortar.turret) {
                // console.log("MORTAR " + mortar.turret.id + ": " + Math.round(damage) + " " + GameVars.ticksCounter);
                mortar.turret.inflicted += Math.round(damage);
            }
            else if (mine && mine.turret) {
                // console.log("MINE " + mine.turret.id + ": " + Math.round(damage) + " " + GameVars.ticksCounter);
                mine.turret.inflicted += Math.round(damage);
            }
            else if (laserTurret) {
                // console.log("LASER " + laserTurret.id + ": " + Math.round(damage) + " " + GameVars.ticksCounter);
                laserTurret.inflicted += Math.round(damage);
            }
            if (this.life <= 0) {
                this.life = 0;
                this.engine.onEnemyKilled(this);
            }
        };
        Enemy.prototype.glueHit = function (intensity, duration, bullet) {
            this.affectedByGlueBullet = true;
            this.glueIntensityBullet = intensity;
            this.glueDuration = duration;
        };
        Enemy.prototype.restoreHealth = function () {
            this.life = this.maxLife;
        };
        Enemy.prototype.getNextPosition = function (deltaTicks) {
            var speed = this.speed;
            if (this.affectedByGlue) {
                speed = Anuto.MathUtils.fixNumber(this.speed / this.glueIntensity);
            }
            var l = Anuto.MathUtils.fixNumber(this.l + speed * deltaTicks);
            var p = this.engine.getPathPosition(l);
            return { x: p.x, y: p.y };
        };
        return Enemy;
    }());
    Anuto.Enemy = Enemy;
})(Anuto || (Anuto = {}));
/// <reference path="./turrets/Turret.ts"/>
/// <reference path="./enemies/Enemy.ts"/>
var Anuto;
(function (Anuto) {
    var Engine = /** @class */ (function () {
        function Engine(gameConfig, enemyData, turretData, wavesData) {
            this.turretId = 0;
            this.enemyId = 0;
            this.bulletId = 0;
            this.mortarId = 0;
            this.glueId = 0;
            this.mineId = 0;
            this.enemySpawningDeltaTicks = gameConfig.enemySpawningDeltaTicks;
            this.runningInClientSide = gameConfig.runningInClientSide;
            this._credits = gameConfig.credits;
            this._lifes = gameConfig.lifes;
            this._paused = false;
            this._timeStep = gameConfig.timeStep;
            this.enemiesPathCells = gameConfig.enemiesPathCells;
            this.enemyData = enemyData;
            this.turretData = turretData;
            this.wavesData = wavesData;
            this._score = 0;
            this._gameOver = false;
            this._round = 0;
            this.waveActivated = false;
            this.t = 0;
            this.eventDispatcher = new Anuto.EventDispatcher();
            this.enemiesSpawner = new Anuto.EnemiesSpawner(this);
            this._ticksCounter = 0;
            this.lastWaveTick = 0;
            this.turrets = [];
            this.mines = [];
            this.minesImpacting = [];
            this.initWaveVars();
        }
        Engine.prototype.initWaveVars = function () {
            this.t = Date.now();
            this.enemies = [];
            this.bullets = [];
            this.glueBullets = [];
            this.mortars = [];
            this.glues = [];
            this.bulletsColliding = [];
            this.glueBulletsColliding = [];
            this.mortarsImpacting = [];
            this.consumedGlues = [];
            this.teleportedEnemies = [];
            this.noEnemiesOnStage = false;
            this.allEnemiesSpawned = false;
            this.enemiesSpawned = 0;
        };
        Engine.prototype.update = function () {
            if (this.runningInClientSide) {
                var t = Date.now();
                if (t - this.t < this._timeStep) {
                    return;
                }
                this.t = t;
            }
            if (this._paused) {
                return;
            }
            // Esto esta comentado ya que las minas se pueden poner aunque las rondas no esten en marcha y los tiempos de recarga tienen que completarse por lo que el motor tiene que seguir funcionando
            // if (!this.waveActivated) {
            //     return;
            // }
            if (this._lifes <= 0 && !this._gameOver) {
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.GAME_OVER));
                this._gameOver = true;
                console.log("TICKS: " + this._ticksCounter);
                console.log("SCORE: " + this._score);
            }
            if (this.noEnemiesOnStage && this.allEnemiesSpawned && this.bullets.length === 0 && this.glueBullets.length === 0 && this.glues.length === 0 && this.mortars.length === 0) {
                this.waveActivated = false;
                if (this._lifes > 0) {
                    this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.WAVE_OVER));
                }
                else {
                    return;
                }
            }
            if (this.waveActivated) {
                this.removeProjectilesAndAccountDamage();
                this.teleport();
                this.checkCollisions();
                this.spawnEnemies();
            }
            this.enemies.forEach(function (enemy) {
                enemy.update();
            }, this);
            this.turrets.forEach(function (turret) {
                turret.update();
            });
            this.bullets.forEach(function (bullet) {
                bullet.update();
            });
            this.glueBullets.forEach(function (bullet) {
                bullet.update();
            });
            this.mortars.forEach(function (mortars) {
                mortars.update();
            });
            this.mines.forEach(function (mine) {
                mine.update();
            });
            this.glues.forEach(function (glue) {
                glue.update();
            });
            this._ticksCounter++;
        };
        Engine.prototype.newWave = function () {
            if (this.waveActivated) {
                return false;
            }
            var length = Object.keys(this.wavesData).length;
            var initialWaveEnemies = this.wavesData["wave_" + (this._round % length + 1)].slice(0);
            this.waveEnemies = JSON.parse(JSON.stringify(initialWaveEnemies));
            var extraWaves = Math.floor(this._round / length) * 2;
            this._round++;
            for (var i = 0; i < extraWaves; i++) {
                var nextWaveEnemies = JSON.parse(JSON.stringify(initialWaveEnemies));
                var lastTickValue = this.waveEnemies[this.waveEnemies.length - 1].t;
                for (var j = 0; j < nextWaveEnemies.length; j++) {
                    nextWaveEnemies[j].t += (lastTickValue + 2);
                }
                this.waveEnemies = this.waveEnemies.concat(nextWaveEnemies);
            }
            this.lastWaveTick = this._ticksCounter;
            this.waveActivated = true;
            this.initWaveVars();
            this.waveEnemiesLength = this.waveEnemies.length;
            return true;
        };
        Engine.prototype.removeEnemy = function (enemy) {
            var i = this.enemies.indexOf(enemy);
            if (i !== -1) {
                this.enemies.splice(i, 1);
            }
            enemy.destroy();
        };
        Engine.prototype.addTurret = function (type, p) {
            // mirar si estamos poniendo la torreta encima del camino
            for (var i = 0; i < this.enemiesPathCells.length; i++) {
                if (p.c === this.enemiesPathCells[i].c && p.r === this.enemiesPathCells[i].r) {
                    return null;
                }
            }
            // mirar si ya hay una torreta
            for (var i = 0; i < this.turrets.length; i++) {
                if (p.c === this.turrets[i].position.c && p.r === this.turrets[i].position.r) {
                    return null;
                }
            }
            var turret = null;
            switch (type) {
                case Anuto.GameConstants.TURRET_PROJECTILE:
                    turret = new Anuto.ProjectileTurret(p, this);
                    break;
                case Anuto.GameConstants.TURRET_LASER:
                    turret = new Anuto.LaserTurret(p, this);
                    break;
                case Anuto.GameConstants.TURRET_LAUNCH:
                    turret = new Anuto.LaunchTurret(p, this);
                    break;
                case Anuto.GameConstants.TURRET_GLUE:
                    turret = new Anuto.GlueTurret(p, this);
                    break;
                default:
            }
            if (this._credits < turret.value) {
                return null;
            }
            this.turrets.push(turret);
            this._credits -= turret.value;
            return turret;
        };
        Engine.prototype.sellTurret = function (id) {
            var turret = this.getTurretById(id);
            if (!turret) {
                return false;
            }
            var i = this.turrets.indexOf(turret);
            if (i !== -1) {
                this.turrets.splice(i, 1);
            }
            this._credits += turret.sellValue;
            turret.destroy();
            return true;
        };
        Engine.prototype.setNextStrategy = function (id) {
            var turret = this.getTurretById(id);
            if (turret) {
                turret.setNextStrategy();
                return true;
            }
            return false;
        };
        Engine.prototype.setFixedTarget = function (id) {
            var turret = this.getTurretById(id);
            if (turret) {
                turret.setFixedTarget();
                return true;
            }
            return false;
        };
        Engine.prototype.addBullet = function (bullet, projectileTurret) {
            this.bullets.push(bullet);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.BULLET_SHOT, [bullet, projectileTurret]));
        };
        Engine.prototype.addGlueBullet = function (bullet, glueTurret) {
            this.glueBullets.push(bullet);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.GLUE_BULLET_SHOT, [bullet, glueTurret]));
        };
        Engine.prototype.addGlue = function (glue, glueTurret) {
            this.glues.push(glue);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.GLUE_SHOT, [glue, glueTurret]));
        };
        Engine.prototype.addMortar = function (mortar, launchTurret) {
            this.mortars.push(mortar);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.MORTAR_SHOT, [mortar, launchTurret]));
        };
        Engine.prototype.addMine = function (mine, launchTurret) {
            this.mines.push(mine);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.MINE_SHOT, [mine, launchTurret]));
        };
        Engine.prototype.addLaserRay = function (laserTurret, enemies) {
            for (var i = 0; i < enemies.length; i++) {
                enemies[i].hit(laserTurret.damage, null, null, null, laserTurret);
            }
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.LASER_SHOT, [laserTurret, enemies]));
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_HIT, [[enemies]]));
        };
        Engine.prototype.flagEnemyToTeleport = function (enemy, glueTurret) {
            this.teleportedEnemies.push({ enemy: enemy, glueTurret: glueTurret });
            // ¿hay balas que tenian asignadas a este enemigo?
            for (var i = 0; i < this.bullets.length; i++) {
                var bullet = this.bullets[i];
                if (bullet.assignedEnemy.id === enemy.id && this.bulletsColliding.indexOf(bullet) === -1) {
                    bullet.assignedEnemy = null;
                    this.bulletsColliding.push(bullet);
                }
            }
            for (var i = 0; i < this.glueBullets.length; i++) {
                var bullet = this.glueBullets[i];
                if (bullet.assignedEnemy.id === enemy.id && this.glueBulletsColliding.indexOf(bullet) === -1) {
                    bullet.assignedEnemy = null;
                    this.glueBulletsColliding.push(bullet);
                }
            }
        };
        Engine.prototype.onEnemyReachedExit = function (enemy) {
            var i = this.enemies.indexOf(enemy);
            if (i !== -1) {
                this.enemies.splice(i, 1);
            }
            enemy.destroy();
            this._lifes -= 1;
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_REACHED_EXIT, [enemy]));
            if (this.enemies.length === 0 && this.allEnemiesSpawned) {
                this.onNoEnemiesOnStage();
            }
        };
        Engine.prototype.onEnemyKilled = function (enemy) {
            this._credits += enemy.value;
            this._score += enemy.value;
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_KILLED, [enemy]));
            var i = this.enemies.indexOf(enemy);
            if (i !== -1) {
                this.enemies.splice(i, 1);
            }
            enemy.destroy();
            if (this.enemies.length === 0 && this.allEnemiesSpawned) {
                this.onNoEnemiesOnStage();
            }
        };
        Engine.prototype.improveTurret = function (id) {
            var success = false;
            var turret = this.getTurretById(id);
            if (turret && turret.level < turret.maxLevel && this._credits >= turret.priceImprovement) {
                this._credits -= turret.priceImprovement;
                turret.improve();
                success = true;
            }
            return success;
        };
        Engine.prototype.upgradeTurret = function (id) {
            var success = false;
            var turret = this.getTurretById(id);
            if (turret && turret.grade < 3 && this._credits >= turret.priceUpgrade) {
                this._credits -= turret.priceUpgrade;
                turret.upgrade();
                success = true;
            }
            return success;
        };
        Engine.prototype.getPathPosition = function (l) {
            var x;
            var y;
            var i = Math.floor(l);
            if (i === this.enemiesPathCells.length - 1) {
                x = this.enemiesPathCells[this.enemiesPathCells.length - 1].c;
                y = this.enemiesPathCells[this.enemiesPathCells.length - 1].r;
            }
            else {
                var dl = Anuto.MathUtils.fixNumber(l - i);
                // interpolar entre i e i + 1
                x = this.enemiesPathCells[i].c + .5;
                y = this.enemiesPathCells[i].r + .5;
                var dx = Anuto.MathUtils.fixNumber(this.enemiesPathCells[i + 1].c - this.enemiesPathCells[i].c);
                var dy = Anuto.MathUtils.fixNumber(this.enemiesPathCells[i + 1].r - this.enemiesPathCells[i].r);
                x = Anuto.MathUtils.fixNumber(x + dx * dl);
                y = Anuto.MathUtils.fixNumber(y + dy * dl);
            }
            return { x: x, y: y };
        };
        Engine.prototype.addEventListener = function (type, listenerFunction, scope) {
            this.eventDispatcher.addEventListener(type, listenerFunction, scope);
        };
        Engine.prototype.removeEventListener = function (type, listenerFunction) {
            this.eventDispatcher.removeEventListener(type, listenerFunction);
        };
        Engine.prototype.checkCollisions = function () {
            for (var i = 0; i < this.bullets.length; i++) {
                var bullet = this.bullets[i];
                var enemy = this.bullets[i].assignedEnemy;
                if (enemy) {
                    if (enemy.life === 0) {
                        this.bulletsColliding.push(bullet);
                    }
                    else {
                        var bp1 = { x: bullet.x, y: bullet.y };
                        var bp2 = bullet.getPositionNextTick();
                        var enemyPosition = { x: enemy.x, y: enemy.y };
                        var enemyHit = Anuto.MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, enemy.boundingRadius);
                        if (enemyHit) {
                            this.bulletsColliding.push(bullet);
                        }
                    }
                }
            }
            for (var i = 0; i < this.glueBullets.length; i++) {
                var bullet = this.glueBullets[i];
                var enemy = this.glueBullets[i].assignedEnemy;
                if (enemy) {
                    var bp1 = { x: bullet.x, y: bullet.y };
                    var bp2 = bullet.getPositionNextTick();
                    var enemyPosition = { x: enemy.x, y: enemy.y };
                    var enemyHit = Anuto.MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, enemy.boundingRadius);
                    if (enemyHit) {
                        this.glueBulletsColliding.push(bullet);
                    }
                }
            }
            for (var i = 0; i < this.mortars.length; i++) {
                if (this.mortars[i].detonate) {
                    this.mortarsImpacting.push(this.mortars[i]);
                }
            }
            for (var i = 0; i < this.mines.length; i++) {
                if (this.mines[i].detonate) {
                    this.minesImpacting.push(this.mines[i]);
                }
            }
            for (var i = 0; i < this.glues.length; i++) {
                if (this.glues[i].consumed) {
                    this.consumedGlues.push(this.glues[i]);
                }
            }
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                if (enemy.type !== Anuto.GameConstants.ENEMY_FLIER) {
                    enemy.affectedByGlue = false;
                    for (var j = 0; j < this.glues.length; j++) {
                        var glue = this.glues[j];
                        if (!glue.consumed) {
                            var dx = enemy.x - glue.x;
                            var dy = enemy.y - glue.y;
                            var squaredDist = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                            var squaredRange = Anuto.MathUtils.fixNumber(glue.range * glue.range);
                            if (squaredRange >= squaredDist) {
                                enemy.glue(glue.intensity);
                                break; // EL EFECTO DEL PEGAMENTO NO ES ACUMULATIVO, NO HACE FALTA COMPROBAR CON MAS PEGAMENTOS
                            }
                        }
                    }
                }
            }
        };
        Engine.prototype.removeProjectilesAndAccountDamage = function () {
            // las balas
            for (var i = 0; i < this.bulletsColliding.length; i++) {
                var bullet = this.bulletsColliding[i];
                var enemy = bullet.assignedEnemy;
                if (enemy === null || enemy.life <= 0) {
                    // ya esta muerto o el enemigo ha sido teletransportado
                    this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_HIT, [[], bullet]));
                }
                else {
                    this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_HIT, [[enemy], bullet]));
                    enemy.hit(bullet.damage, bullet);
                }
                var index = this.bullets.indexOf(bullet);
                this.bullets.splice(index, 1);
                bullet.destroy();
            }
            this.bulletsColliding.length = 0;
            // las balas de pegamento
            for (var i = 0; i < this.glueBulletsColliding.length; i++) {
                var bullet = this.glueBulletsColliding[i];
                var enemy = bullet.assignedEnemy;
                if (enemy === null || enemy.life === 0) {
                    // ya esta muerto o el enemigo ha sido teletransportado
                    this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_GLUE_HIT, [[], bullet]));
                }
                else {
                    this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_GLUE_HIT, [[enemy], bullet]));
                    enemy.glueHit(bullet.intensity, bullet.durationTicks, bullet);
                }
                var index = this.glueBullets.indexOf(bullet);
                this.glueBullets.splice(index, 1);
                bullet.destroy();
            }
            this.glueBulletsColliding.length = 0;
            // los morteros
            for (var i = 0; i < this.mortarsImpacting.length; i++) {
                var mortar = this.mortarsImpacting[i];
                var hitEnemiesData = mortar.getEnemiesWithinExplosionRange();
                var hitEnemies = [];
                if (hitEnemiesData.length > 0) {
                    for (var j = 0; j < hitEnemiesData.length; j++) {
                        var enemy = hitEnemiesData[j].enemy;
                        if (enemy.life > 0) {
                            enemy.hit(hitEnemiesData[j].damage, null, mortar);
                            hitEnemies.push(enemy);
                        }
                    }
                }
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_HIT, [hitEnemies, null, mortar]));
                var index = this.mortars.indexOf(mortar);
                this.mortars.splice(index, 1);
                mortar.destroy();
            }
            this.mortarsImpacting.length = 0;
            // las minas
            for (var i = 0; i < this.minesImpacting.length; i++) {
                var mine = this.minesImpacting[i];
                var hitEnemiesData = mine.getEnemiesWithinExplosionRange();
                var hitEnemies = [];
                if (hitEnemiesData.length > 0) {
                    for (var j = 0; j < hitEnemiesData.length; j++) {
                        var enemy = hitEnemiesData[j].enemy;
                        if (enemy.life > 0) {
                            enemy.hit(hitEnemiesData[j].damage, null, null, mine);
                            hitEnemies.push(enemy);
                        }
                    }
                }
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_HIT, [hitEnemies, null, null, mine]));
                var index = this.mines.indexOf(mine);
                this.mines.splice(index, 1);
                var turret = mine.turret;
                if (turret) {
                    turret.numMines--;
                }
                mine.destroy();
            }
            this.minesImpacting.length = 0;
            // los pegamentos
            for (var i = 0; i < this.consumedGlues.length; i++) {
                var glue = this.consumedGlues[i];
                var index = this.glues.indexOf(glue);
                this.glues.splice(index, 1);
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.GLUE_CONSUMED, [glue]));
                glue.destroy();
            }
            this.consumedGlues.length = 0;
        };
        Engine.prototype.teleport = function () {
            var teleportedEnemiesData = [];
            for (var i = 0; i < this.teleportedEnemies.length; i++) {
                var enemy = this.teleportedEnemies[i].enemy;
                enemy.teleport(this.teleportedEnemies[i].glueTurret.teleportDistance);
                teleportedEnemiesData.push({ enemy: enemy, glueTurret: this.teleportedEnemies[i].glueTurret });
            }
            this.teleportedEnemies.length = 0;
            if (teleportedEnemiesData.length > 0) {
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMIES_TELEPORTED, [teleportedEnemiesData]));
            }
        };
        Engine.prototype.spawnEnemies = function () {
            var enemy = this.enemiesSpawner.getEnemy();
            if (enemy) {
                this.enemiesSpawned++;
                if (this.enemiesSpawned === this.waveEnemiesLength) {
                    this.allEnemiesSpawned = true;
                }
                this.enemies.push(enemy);
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_SPAWNED, [enemy, this.enemiesPathCells[0]]));
            }
        };
        Engine.prototype.onNoEnemiesOnStage = function () {
            this.noEnemiesOnStage = true;
            // nos cargamos de golpe todas las balas si las hubieren
            for (var i = 0; i < this.bullets.length; i++) {
                var bullet = this.bullets[i];
                bullet.assignedEnemy = null;
                this.bulletsColliding.push(bullet);
            }
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.NO_ENEMIES_ON_STAGE));
        };
        Engine.prototype.getTurretById = function (id) {
            var turret = null;
            for (var i = 0; i < this.turrets.length; i++) {
                if (this.turrets[i].id === id) {
                    turret = this.turrets[i];
                    break;
                }
            }
            return turret;
        };
        Object.defineProperty(Engine.prototype, "credits", {
            // GETTERS Y SETTERS
            get: function () {
                return this._credits;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "ticksCounter", {
            get: function () {
                return this._ticksCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "score", {
            get: function () {
                return this._score;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "gameOver", {
            get: function () {
                return this._gameOver;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "lifes", {
            get: function () {
                return this._lifes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "round", {
            get: function () {
                return this._round;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "timeStep", {
            get: function () {
                return this._timeStep;
            },
            set: function (value) {
                this._timeStep = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "paused", {
            set: function (value) {
                this._paused = value;
            },
            enumerable: true,
            configurable: true
        });
        return Engine;
    }());
    Anuto.Engine = Engine;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var GameConstants = /** @class */ (function () {
        function GameConstants() {
        }
        GameConstants.RELOAD_BASE_TICKS = 10;
        GameConstants.BULLET_SPEED = .5; // in cells / tick
        GameConstants.MORTAR_SPEED = .1;
        // los nombres de los enemigos
        GameConstants.ENEMY_SOLDIER = "soldier";
        GameConstants.ENEMY_RUNNER = "runner";
        GameConstants.ENEMY_HEALER = "healer";
        GameConstants.ENEMY_BLOB = "blob";
        GameConstants.ENEMY_FLIER = "flier";
        // los nombres de las torretas
        GameConstants.TURRET_PROJECTILE = "projectile";
        GameConstants.TURRET_LASER = "laser";
        GameConstants.TURRET_LAUNCH = "launch";
        GameConstants.TURRET_GLUE = "glue";
        // estrategia de disparo
        GameConstants.STRATEGY_SHOOT_FIRST = "First";
        GameConstants.STRATEGY_SHOOT_LAST = "Last";
        GameConstants.STRATEGY_SHOOT_CLOSEST = "Closest";
        GameConstants.STRATEGY_SHOOT_WEAKEST = "Weakest";
        GameConstants.STRATEGY_SHOOT_STRONGEST = "Strongest";
        GameConstants.STRATEGYS_ARRAY = [GameConstants.STRATEGY_SHOOT_FIRST,
            GameConstants.STRATEGY_SHOOT_LAST,
            GameConstants.STRATEGY_SHOOT_CLOSEST,
            GameConstants.STRATEGY_SHOOT_WEAKEST,
            GameConstants.STRATEGY_SHOOT_STRONGEST];
        // caracteristicas de los enemigos
        GameConstants.HEALER_HEALING_TICKS = 100;
        GameConstants.HEALER_STOP_TICKS = 30;
        GameConstants.HEALER_HEALING_RADIUS = 2;
        return GameConstants;
    }());
    Anuto.GameConstants = GameConstants;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var HealerEnemy = /** @class */ (function (_super) {
        __extends(HealerEnemy, _super);
        function HealerEnemy(creationTick, engine) {
            var _this = _super.call(this, Anuto.GameConstants.ENEMY_HEALER, creationTick, engine) || this;
            // para que no se paren todos en el mismo lugar y al mismo tiempo
            _this.f = Anuto.GameConstants.HEALER_HEALING_TICKS - creationTick % Anuto.GameConstants.HEALER_HEALING_TICKS;
            _this.healing = false;
            return _this;
        }
        HealerEnemy.prototype.update = function () {
            this.f++;
            if (this.healing) {
                this.heal();
                if (this.f === Anuto.GameConstants.HEALER_STOP_TICKS) {
                    this.f = 0;
                    this.healing = false;
                }
            }
            else {
                _super.prototype.update.call(this);
                // no cura si ya esta muy cerca de la salida
                if (this.f === Anuto.GameConstants.HEALER_HEALING_TICKS && this.l < this.engine.enemiesPathCells.length - 2) {
                    this.f = 0;
                    this.healing = true;
                }
            }
        };
        HealerEnemy.prototype.heal = function () {
            // encontrar a todos los enemigos que esten dentro de un determinado radio y restaurarles la salud
            for (var i = 0; i < this.engine.enemies.length; i++) {
                var enemy = this.engine.enemies[i];
                if (enemy.id === this.id) {
                    // se cura a si mismo
                    enemy.restoreHealth();
                }
                else {
                    var distanceSquare = Anuto.MathUtils.fixNumber((enemy.x - this.x) * (enemy.x - this.x) + (enemy.y - this.y) * (enemy.y - this.y));
                    if (distanceSquare <= Anuto.GameConstants.HEALER_HEALING_RADIUS * Anuto.GameConstants.HEALER_HEALING_RADIUS) {
                        enemy.restoreHealth();
                    }
                }
            }
        };
        return HealerEnemy;
    }(Anuto.Enemy));
    Anuto.HealerEnemy = HealerEnemy;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Event = /** @class */ (function () {
        function Event(type, params) {
            this.type = type;
            this.params = params;
        }
        Event.prototype.getParams = function () {
            return this.params;
        };
        Event.prototype.getType = function () {
            return this.type;
        };
        Event.ENEMY_SPAWNED = "enemy spawned";
        Event.ENEMY_KILLED = "enemy killed";
        Event.ENEMY_HIT = "enemy hit by bullet";
        Event.ENEMY_GLUE_HIT = "enemy hit by glue bullet";
        Event.ENEMY_REACHED_EXIT = "enemy reached exit";
        Event.WAVE_OVER = "wave over";
        Event.GAME_OVER = "game over";
        Event.NO_ENEMIES_ON_STAGE = "no enemies on stage";
        Event.BULLET_SHOT = "bullet shot";
        Event.GLUE_BULLET_SHOT = "glue bullet shot";
        Event.LASER_SHOT = "laser shot";
        Event.MORTAR_SHOT = "mortar shot";
        Event.MINE_SHOT = "mine shot";
        Event.GLUE_SHOT = "glue shot";
        Event.GLUE_CONSUMED = "glue consumed";
        Event.ENEMIES_TELEPORTED = "enemies teleported";
        return Event;
    }());
    Anuto.Event = Event;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var EventDispatcher = /** @class */ (function () {
        function EventDispatcher() {
            this.listeners = [];
        }
        EventDispatcher.prototype.hasEventListener = function (type, listener) {
            var exists = false;
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === type && this.listeners[i].listener === listener) {
                    exists = true;
                }
            }
            return exists;
        };
        EventDispatcher.prototype.addEventListener = function (type, listenerFunc, scope) {
            if (this.hasEventListener(type, listenerFunc)) {
                return;
            }
            this.listeners.push({ type: type, listener: listenerFunc, scope: scope });
        };
        EventDispatcher.prototype.removeEventListener = function (type, listenerFunc) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === type && this.listeners[i].listener === listenerFunc) {
                    this.listeners.splice(i, 1);
                }
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (evt) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].type === evt.getType()) {
                    this.listeners[i].listener.apply(this.listeners[i].scope, evt.getParams());
                }
            }
        };
        return EventDispatcher;
    }());
    Anuto.EventDispatcher = EventDispatcher;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Bullet = /** @class */ (function () {
        // bullet speed in cells / tick
        function Bullet(p, angle, assignedEnemy, damage, canonShoot, turret, engine) {
            this.id = engine.bulletId;
            engine.bulletId++;
            this.x = p.c + .5;
            this.y = p.r + .5;
            this.assignedEnemy = assignedEnemy;
            this.damage = damage;
            this.canonShoot = canonShoot;
            this.turret = turret;
            this.vx = Anuto.MathUtils.fixNumber(Anuto.GameConstants.BULLET_SPEED * Math.cos(angle));
            this.vy = Anuto.MathUtils.fixNumber(Anuto.GameConstants.BULLET_SPEED * Math.sin(angle));
        }
        Bullet.prototype.destroy = function () {
            //
        };
        Bullet.prototype.update = function () {
            this.x = Anuto.MathUtils.fixNumber(this.x + this.vx);
            this.y = Anuto.MathUtils.fixNumber(this.y + this.vy);
        };
        Bullet.prototype.getPositionNextTick = function () {
            return { x: Anuto.MathUtils.fixNumber(this.x + this.vx), y: Anuto.MathUtils.fixNumber(this.y + this.vy) };
        };
        return Bullet;
    }());
    Anuto.Bullet = Bullet;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Glue = /** @class */ (function () {
        function Glue(p, intensity, duration, range, engine) {
            this.id = engine.glueId;
            engine.glueId++;
            this.x = p.c + .5;
            this.y = p.r + .5;
            this.intensity = intensity;
            this.duration = duration;
            this.range = range;
            this.consumed = false;
            this.f = 0;
        }
        Glue.prototype.destroy = function () {
            // nada de momento
        };
        Glue.prototype.update = function () {
            this.f++;
            if (this.f === this.duration) {
                this.consumed = true;
            }
        };
        return Glue;
    }());
    Anuto.Glue = Glue;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var GlueBullet = /** @class */ (function () {
        // bullet speed in cells / tick
        function GlueBullet(p, angle, assignedEnemy, intensity, durationTicks, engine) {
            this.id = engine.bulletId;
            engine.bulletId++;
            this.x = p.c + .5;
            this.y = p.r + .5;
            this.assignedEnemy = assignedEnemy;
            this.intensity = intensity;
            this.durationTicks = durationTicks;
            this.vx = Anuto.MathUtils.fixNumber(Anuto.GameConstants.BULLET_SPEED * Math.cos(angle));
            this.vy = Anuto.MathUtils.fixNumber(Anuto.GameConstants.BULLET_SPEED * Math.sin(angle));
        }
        GlueBullet.prototype.destroy = function () {
            //
        };
        GlueBullet.prototype.update = function () {
            this.x = Anuto.MathUtils.fixNumber(this.x + this.vx);
            this.y = Anuto.MathUtils.fixNumber(this.y + this.vy);
        };
        GlueBullet.prototype.getPositionNextTick = function () {
            return { x: Anuto.MathUtils.fixNumber(this.x + this.vx), y: Anuto.MathUtils.fixNumber(this.y + this.vy) };
        };
        return GlueBullet;
    }());
    Anuto.GlueBullet = GlueBullet;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var GlueTurret = /** @class */ (function (_super) {
        __extends(GlueTurret, _super);
        function GlueTurret(p, engine) {
            var _this = _super.call(this, Anuto.GameConstants.TURRET_GLUE, p, engine) || this;
            _this.maxLevel = 5;
            _this.teleportDistance = 0;
            _this.calculateTurretParameters();
            return _this;
        }
        // mirar en el ANUTO y generar las formulas que correspondan
        GlueTurret.prototype.calculateTurretParameters = function () {
            switch (this.grade) {
                case 1:
                    this.intensity = Math.round((.2 * this.level + 1) * 100) / 100;
                    this.duration = 1.5;
                    this.reload = 2;
                    this.range = Math.round((.1 * this.level + 1.4) * 100) / 100;
                    this.priceImprovement = Math.floor((1 / 6) * Math.pow(this.level, 3) + 1 * Math.pow(this.level, 2) + (95 / 6) * this.level + 83);
                    this.priceUpgrade = 800;
                    break;
                case 2:
                    this.intensity = Math.round((.3 * this.level + .9) * 100) / 100;
                    this.duration = 2.5;
                    this.reload = 3;
                    this.range = Math.round((.2 * this.level + 2.3) * 100) / 100;
                    this.priceImprovement = Math.floor((1 / 3) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (95 / 3) * this.level + 166);
                    this.priceUpgrade = 1700;
                    break;
                case 3:
                    this.teleportDistance = Math.round((5 * this.level + 10) * 100) / 100;
                    this.reload = Math.round((-.5 * this.level + 5.5) * 100) / 100;
                    this.range = 3.5;
                    this.priceImprovement = Math.floor((10 / 3) * Math.pow(this.level, 3) + 20 * Math.pow(this.level, 2) + (950 / 3) * this.level + 1660);
                    break;
                default:
            }
            this.durationTicks = Math.floor(Anuto.GameConstants.RELOAD_BASE_TICKS * this.duration);
            _super.prototype.calculateTurretParameters.call(this);
        };
        GlueTurret.prototype.shoot = function () {
            _super.prototype.shoot.call(this);
            var enemy;
            switch (this.grade) {
                case 1:
                    var glue = new Anuto.Glue(this.position, this.intensity, this.durationTicks, this.range, this.engine);
                    this.engine.addGlue(glue, this);
                    break;
                case 2:
                    if (this.fixedTarget) {
                        enemy = this.followedEnemy || this.enemiesWithinRange[0];
                    }
                    else {
                        enemy = this.enemiesWithinRange[0];
                    }
                    var d = Anuto.MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) + (this.y - enemy.y) * (this.y - enemy.y)));
                    // cuantos ticks va a tardar la bala en llegar?
                    var ticksToImpact = Math.floor(Anuto.MathUtils.fixNumber(d / Anuto.GameConstants.BULLET_SPEED));
                    // encontrar la posicion del enemigo dentro de estos ticks
                    var impactPosition = enemy.getNextPosition(ticksToImpact);
                    // la posicion de impacto sigue estando dentro del radio de accion?
                    var dx = impactPosition.x - this.x;
                    var dy = impactPosition.y - this.y;
                    var impactSquareDistance = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                    if (this.range * this.range > impactSquareDistance) {
                        this.shootAngle = Anuto.MathUtils.fixNumber(Math.atan2(dy, dx));
                        var bullet = new Anuto.GlueBullet({ c: this.position.c, r: this.position.r }, this.shootAngle, enemy, this.intensity, this.durationTicks, this.engine);
                        this.engine.addGlueBullet(bullet, this);
                    }
                    else {
                        // no se dispara y se vuelve a estar disponible para disparar
                        this.readyToShoot = true;
                    }
                    break;
                case 3:
                    if (this.fixedTarget) {
                        enemy = this.followedEnemy || this.enemiesWithinRange[0];
                    }
                    else {
                        enemy = this.enemiesWithinRange[0];
                    }
                    if (enemy.life > 0 && !enemy.hasBeenTeleported) {
                        this.engine.flagEnemyToTeleport(enemy, this);
                    }
                    else {
                        this.readyToShoot = true;
                    }
                    break;
                default:
            }
        };
        return GlueTurret;
    }(Anuto.Turret));
    Anuto.GlueTurret = GlueTurret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var LaserTurret = /** @class */ (function (_super) {
        __extends(LaserTurret, _super);
        function LaserTurret(p, engine) {
            var _this = _super.call(this, Anuto.GameConstants.TURRET_LASER, p, engine) || this;
            _this.calculateTurretParameters();
            return _this;
        }
        LaserTurret.prototype.update = function () {
            if (this.fixedTarget) {
                if (this.enemiesWithinRange.length > 0) {
                    if (this.enemiesWithinRange.indexOf(this.followedEnemy) === -1) {
                        this.followedEnemy = this.enemiesWithinRange[0];
                    }
                }
                else {
                    this.followedEnemy = null;
                }
            }
            else {
                this.followedEnemy = this.enemiesWithinRange[0];
            }
            _super.prototype.update.call(this);
        };
        // mirar en el ANUTO y generar las formulas que correspondan
        LaserTurret.prototype.calculateTurretParameters = function () {
            switch (this.grade) {
                case 1:
                    this.damage = Math.round((1 / 3) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (95 / 3) * this.level + 196);
                    this.reload = Math.round((-.1 * this.level + 1.6) * 100) / 100;
                    this.range = Math.round((.05 * this.level + 2.95) * 100) / 100;
                    this.priceImprovement = Math.round(1 * Math.pow(this.level, 2) + 7 * this.level + 42);
                    this.priceUpgrade = 7000;
                    break;
                case 2:
                    this.damage = Math.round((13 / 3) * Math.pow(this.level, 3) + 6 * Math.pow(this.level, 2) + (335 / 3) * this.level + 4178);
                    this.reload = Math.round((-.1 * this.level + 1.6) * 100) / 100;
                    this.range = Math.round((.05 * this.level + 2.95) * 100) / 100;
                    this.priceImprovement = Math.round((37 / 6) * Math.pow(this.level, 3) + (19 / 2) * Math.pow(this.level, 2) + (481 / 3) * this.level + 404);
                    this.priceUpgrade = 96400;
                    break;
                case 3:
                    this.damage = Math.round((50 / 3) * Math.pow(this.level, 2) - (850 / 3) * this.level + 43700);
                    this.reload = Math.round((-.05 * this.level + 3.05) * 100) / 100;
                    this.range = Math.round((.05 * this.level + 3) * 100) / 100;
                    this.priceImprovement = Math.round((39 / 2) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (665 / 3) * this.level + 596);
                    break;
                default:
            }
            _super.prototype.calculateTurretParameters.call(this);
        };
        LaserTurret.prototype.getEnemiesWithinLine = function (enemy) {
            var newEnemies = [];
            for (var i = 0; i < this.engine.enemies.length; i++) {
                var newEnemy = this.engine.enemies[i];
                // if (newEnemy !== enemy && this.inLine({x: this.position.c, y: this.position.r}, {x: Math.floor(newEnemy.x), y: Math.floor(newEnemy.y)}, {x: Math.floor(enemy.x), y: Math.floor(enemy.y)})) {
                //     newEnemies.push(newEnemy);
                // }
                var infiniteX = newEnemy.x + (enemy.x - this.x) * 1000;
                var infiniteY = newEnemy.y + (enemy.y - this.y) * 1000;
                if (newEnemy !== enemy && Anuto.MathUtils.isLineSegmentIntersectingCircle({ x: this.x, y: this.y }, { x: infiniteX, y: infiniteY }, { x: newEnemy.x, y: newEnemy.y }, .3)) {
                    newEnemies.push(newEnemy);
                }
            }
            return newEnemies;
        };
        LaserTurret.prototype.inLine = function (A, B, C) {
            // if AC is vertical
            if (A.x === C.x) {
                return B.x === C.x;
            }
            // if AC is horizontal
            if (A.y === C.y) {
                return B.y === C.y;
            }
            // match the gradients
            return (A.x - C.x) * (A.y - C.y) === (C.x - B.x) * (C.y - B.y);
        };
        LaserTurret.prototype.shoot = function () {
            _super.prototype.shoot.call(this);
            var enemies = [];
            var enemiesNumber = 1;
            var enemiesCounter = 0;
            switch (this.grade) {
                case 1:
                    enemiesNumber = 1;
                    break;
                case 2:
                    enemiesNumber = 3;
                    break;
                case 3:
                default:
            }
            if (this.grade === 3) {
                if (this.fixedTarget) {
                    enemies.push(this.followedEnemy || this.enemiesWithinRange[0]);
                }
                else {
                    enemies.push(this.enemiesWithinRange[0]);
                }
                enemies = enemies.concat(this.getEnemiesWithinLine(enemies[0]));
            }
            else {
                if (this.fixedTarget) {
                    if (this.followedEnemy) {
                        enemies.push(this.followedEnemy);
                        if (this.followedEnemy === this.enemiesWithinRange[0]) {
                            enemiesCounter++;
                        }
                    }
                    else {
                        enemies.push(this.enemiesWithinRange[0]);
                        enemiesCounter++;
                    }
                }
                else {
                    enemies.push(this.enemiesWithinRange[0]);
                    enemiesCounter++;
                }
                while (enemies.length < enemiesNumber) {
                    if (this.enemiesWithinRange[enemiesCounter]) {
                        enemies.push(this.enemiesWithinRange[enemiesCounter]);
                        enemiesCounter++;
                    }
                    else {
                        break;
                    }
                }
            }
            if (enemies[0].life > 0) {
                this.engine.addLaserRay(this, enemies);
            }
            else {
                this.readyToShoot = true;
            }
        };
        return LaserTurret;
    }(Anuto.Turret));
    Anuto.LaserTurret = LaserTurret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var LaunchTurret = /** @class */ (function (_super) {
        __extends(LaunchTurret, _super);
        function LaunchTurret(p, engine) {
            var _this = _super.call(this, Anuto.GameConstants.TURRET_LAUNCH, p, engine) || this;
            _this.calculateTurretParameters();
            _this.minesCounter = 0;
            _this.numMines = 0;
            return _this;
        }
        // mirar en el ANUTO y generar las formulas que correspondan
        LaunchTurret.prototype.calculateTurretParameters = function () {
            switch (this.grade) {
                case 1:
                    this.damage = Math.round((1 / 3) * Math.pow(this.level, 3) + 4 * Math.pow(this.level, 2) + (137 / 3) * this.level + 50);
                    this.explosionRange = Math.round((.05 * this.level + 1.45) * 100) / 100;
                    this.reload = Math.round((-.05 * this.level + 2.05) * 100) / 100;
                    this.range = Math.round((.05 * this.level + 2.45) * 100) / 100;
                    this.priceImprovement = Math.round((1 / 6) * Math.pow(this.level, 3) + (3 / 2) * Math.pow(this.level, 2) + (58 / 3) * this.level + 104);
                    this.priceUpgrade = 10000;
                    break;
                case 2:
                    this.damage = Math.round((43 / 6) * Math.pow(this.level, 3) + 11 * Math.pow(this.level, 2) + (1121 / 3) * this.level + 2895);
                    this.explosionRange = Math.round((.05 * this.level + 1.95) * 100) / 100;
                    this.reload = Math.round((-.05 * this.level + 2.6) * 100) / 100;
                    this.range = 2.5;
                    this.priceImprovement = Math.round(8 * Math.pow(this.level, 3) + 12 * Math.pow(this.level, 2) + 208 * this.level + 522);
                    this.priceUpgrade = 103000;
                    break;
                case 3:
                    this.damage = Math.round((50 / 3) * Math.pow(this.level, 3) + (850 / 3) * this.level + 47700);
                    this.explosionRange = Math.round((.05 * this.level + 1.7) * 100) / 100;
                    this.reload = Math.round((-.05 * this.level + 3.05) * 100) / 100;
                    this.range = Math.round((.1 * this.level + 2.9) * 100) / 100;
                    this.priceImprovement = Math.round((39 / 2) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (665 / 2) * this.level + 596);
                    break;
                default:
            }
            _super.prototype.calculateTurretParameters.call(this);
        };
        LaunchTurret.prototype.getPathCellsInRange = function () {
            var cells = [];
            for (var i = 0; i < this.engine.enemiesPathCells.length; i++) {
                var cell = this.engine.enemiesPathCells[i];
                if (cell.c >= this.position.c && cell.c <= this.position.c + this.range ||
                    cell.c <= this.position.c && cell.c >= this.position.c - this.range) {
                    if (cell.r >= this.position.r && cell.r <= this.position.r + this.range ||
                        cell.r <= this.position.r && cell.r >= this.position.r - this.range) {
                        cells.push(cell);
                    }
                }
            }
            return cells;
        };
        LaunchTurret.prototype.shoot = function () {
            _super.prototype.shoot.call(this);
            if (this.grade === 2) {
                var cells = this.getPathCellsInRange();
                if (cells.length > 0 && this.numMines < this.level + 3) {
                    var cell = cells[this.minesCounter % cells.length];
                    this.minesCounter++;
                    this.numMines++;
                    var dx = (cell.c + .5) - this.x;
                    var dy = (cell.r + .5) - this.y;
                    this.shootAngle = Anuto.MathUtils.fixNumber(Math.atan2(dy, dx));
                    var mine = new Anuto.Mine({ c: cell.c, r: cell.r }, this.explosionRange, this.damage, this, this.engine);
                    this.engine.addMine(mine, this);
                }
                else {
                    this.readyToShoot = true;
                }
            }
            else {
                var enemy = void 0;
                if (this.fixedTarget) {
                    enemy = this.followedEnemy || this.enemiesWithinRange[0];
                }
                else {
                    enemy = this.enemiesWithinRange[0];
                }
                var d = Anuto.MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) + (this.y - enemy.y) * (this.y - enemy.y)));
                var speed = this.grade === 3 ? Anuto.GameConstants.MORTAR_SPEED * 5 : Anuto.GameConstants.MORTAR_SPEED;
                // cuantos ticks va a tardar el mortero en llegar?
                var ticksToImpact = Math.floor(Anuto.MathUtils.fixNumber(d / speed));
                // encontrar la posicion del enemigo dentro de estos ticks
                var impactPosition = enemy.getNextPosition(ticksToImpact);
                if (this.grade === 1) {
                    // le damos una cierta desviacion para que no explote directamente justo encima del enemigo
                    var deviation_x = Anuto.MathUtils.fixNumber(LaunchTurret.deviationRadius * Math.cos(LaunchTurret.deviationAngle * Math.PI / 180));
                    var deviation_y = Anuto.MathUtils.fixNumber(LaunchTurret.deviationRadius * Math.sin(LaunchTurret.deviationAngle * Math.PI / 180));
                    impactPosition.x += deviation_x;
                    impactPosition.y += deviation_y;
                    LaunchTurret.deviationRadius = LaunchTurret.deviationRadius === .75 ? 0 : LaunchTurret.deviationRadius + .25;
                    LaunchTurret.deviationAngle = LaunchTurret.deviationAngle === 315 ? 0 : LaunchTurret.deviationAngle + 45;
                }
                // el impacto se producirá dentro del alcance de la torreta?
                d = Anuto.MathUtils.fixNumber(Math.sqrt((this.x - impactPosition.x) * (this.x - impactPosition.x) + (this.y - impactPosition.y) * (this.y - impactPosition.y)));
                if (d < this.range) {
                    // recalculamos los ticks en los que va a impactar ya que estos determinan cuando se hace estallar al mortero
                    var speed_1 = this.grade === 3 ? Anuto.GameConstants.MORTAR_SPEED * 5 : Anuto.GameConstants.MORTAR_SPEED;
                    ticksToImpact = Math.floor(Anuto.MathUtils.fixNumber(d / speed_1));
                    var dx = impactPosition.x - this.x;
                    var dy = impactPosition.y - this.y;
                    this.shootAngle = Anuto.MathUtils.fixNumber(Math.atan2(dy, dx));
                    var mortar = new Anuto.Mortar(this.position, this.shootAngle, ticksToImpact, this.explosionRange, this.damage, this.grade, this, this.engine);
                    this.engine.addMortar(mortar, this);
                }
                else {
                    // no se lanza el mortero y se vuelve a estar disponible para disparar
                    this.readyToShoot = true;
                }
            }
        };
        // se va desviando del objetivo de una manera ciclica
        LaunchTurret.deviationRadius = 0; // puede ser 0, .25. .5 ó .75   1 de cada 4 veces disparara al enemigo en el centro
        LaunchTurret.deviationAngle = 0; // se va incrementando de 45 en 45 grados
        return LaunchTurret;
    }(Anuto.Turret));
    Anuto.LaunchTurret = LaunchTurret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Mine = /** @class */ (function () {
        function Mine(p, explosionRange, damage, turret, engine) {
            this.id = engine.mineId;
            engine.mineId++;
            this.x = p.c + .5;
            this.y = p.r + .5;
            this.explosionRange = explosionRange;
            this.damage = damage;
            this.range = .5;
            this.detonate = false;
            this.engine = engine;
            this.turret = turret;
        }
        Mine.prototype.destroy = function () {
            // nada de momento
        };
        Mine.prototype.update = function () {
            if (!this.detonate) {
                for (var i = 0; i < this.engine.enemies.length; i++) {
                    var enemy = this.engine.enemies[i];
                    var distance = Anuto.MathUtils.fixNumber(Math.sqrt((enemy.x - this.x) * (enemy.x - this.x) + (enemy.y - this.y) * (enemy.y - this.y)));
                    if (enemy.type === Anuto.GameConstants.ENEMY_FLIER) {
                        continue;
                    }
                    if (distance <= this.range) {
                        this.detonate = true;
                        break;
                    }
                }
            }
        };
        Mine.prototype.getEnemiesWithinExplosionRange = function () {
            var hitEnemiesData = [];
            for (var i = 0; i < this.engine.enemies.length; i++) {
                var enemy = this.engine.enemies[i];
                var distance = Anuto.MathUtils.fixNumber(Math.sqrt((enemy.x - this.x) * (enemy.x - this.x) + (enemy.y - this.y) * (enemy.y - this.y)));
                if (distance <= this.explosionRange) {
                    var damage = Anuto.MathUtils.fixNumber(this.damage * (1 - distance / this.explosionRange));
                    hitEnemiesData.push({ enemy: enemy, damage: damage });
                }
            }
            return hitEnemiesData;
        };
        return Mine;
    }());
    Anuto.Mine = Mine;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Mortar = /** @class */ (function () {
        // mortar speed in cells / tick
        function Mortar(p, angle, ticksToImpact, explosionRange, damage, grade, turret, engine) {
            this.id = engine.mortarId;
            engine.mortarId++;
            this.creationTick = engine.ticksCounter;
            this.x = p.c + .5;
            this.y = p.r + .5;
            this.ticksToImpact = ticksToImpact;
            this.explosionRange = explosionRange;
            this.damage = damage;
            this.grade = grade;
            this.turret = turret;
            this.engine = engine;
            this.detonate = false;
            this.f = 0;
            var speed = this.grade === 3 ? Anuto.GameConstants.MORTAR_SPEED * 5 : Anuto.GameConstants.MORTAR_SPEED;
            this.vx = Anuto.MathUtils.fixNumber(speed * Math.cos(angle));
            this.vy = Anuto.MathUtils.fixNumber(speed * Math.sin(angle));
        }
        Mortar.prototype.destroy = function () {
            //
        };
        Mortar.prototype.update = function () {
            this.x = Anuto.MathUtils.fixNumber(this.x + this.vx);
            this.y = Anuto.MathUtils.fixNumber(this.y + this.vy);
            this.f++;
            if (this.f === this.ticksToImpact) {
                this.detonate = true;
            }
        };
        Mortar.prototype.getEnemiesWithinExplosionRange = function () {
            var hitEnemiesData = [];
            for (var i = 0; i < this.engine.enemies.length; i++) {
                var enemy = this.engine.enemies[i];
                var distance = Anuto.MathUtils.fixNumber(Math.sqrt((enemy.x - this.x) * (enemy.x - this.x) + (enemy.y - this.y) * (enemy.y - this.y)));
                if (distance <= this.explosionRange) {
                    var damage = Anuto.MathUtils.fixNumber(this.damage * (1 - distance / this.explosionRange));
                    hitEnemiesData.push({ enemy: enemy, damage: damage });
                }
            }
            return hitEnemiesData;
        };
        return Mortar;
    }());
    Anuto.Mortar = Mortar;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var ProjectileTurret = /** @class */ (function (_super) {
        __extends(ProjectileTurret, _super);
        function ProjectileTurret(p, engine) {
            var _this = _super.call(this, Anuto.GameConstants.TURRET_PROJECTILE, p, engine) || this;
            _this.canonShoot = "center";
            switch (_this.grade) {
                case 2:
                case 3:
                    _this.canonShoot = "left";
                default:
            }
            _this.calculateTurretParameters();
            return _this;
        }
        ProjectileTurret.prototype.update = function () {
            if (this.fixedTarget) {
                if (this.enemiesWithinRange.length > 0) {
                    if (this.enemiesWithinRange.indexOf(this.followedEnemy) === -1) {
                        this.followedEnemy = this.enemiesWithinRange[0];
                    }
                }
                else {
                    this.followedEnemy = null;
                }
            }
            else {
                this.followedEnemy = this.enemiesWithinRange[0];
            }
            _super.prototype.update.call(this);
        };
        // estos valores estan sacados del anuto
        ProjectileTurret.prototype.calculateTurretParameters = function () {
            switch (this.grade) {
                case 1:
                    this.damage = Math.round((1 / 3) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (95 / 3) * this.level + 66);
                    this.reload = Math.round((-.05 * this.level + 1.05) * 100) / 100;
                    this.range = Math.round((.05 * this.level + 2.45) * 100) / 100;
                    this.priceImprovement = Math.round(1 * Math.pow(this.level, 2) + 7 * this.level + 42);
                    this.priceUpgrade = 5600;
                    break;
                case 2:
                    this.damage = Math.round((13 / 3) * Math.pow(this.level, 3) + 6 * Math.pow(this.level, 2) + (335 / 3) * this.level + 3278);
                    this.reload = Math.round((-.05 * this.level + .6) * 100) / 100;
                    this.range = Math.round((.05 * this.level + 2.95) * 100) / 100;
                    this.priceImprovement = Math.round((31 / 6) * Math.pow(this.level, 3) + (13 / 2) * Math.pow(this.level, 2) + (397 / 3) * this.level + 326);
                    this.priceUpgrade = 88500;
                    break;
                case 3:
                    this.damage = Math.round(50 * Math.pow(this.level, 2) - 50 * this.level + 20000);
                    this.reload = Math.round((-.01 * this.level + .21) * 100) / 100;
                    this.range = Math.round((.05 * this.level + 3.45) * 100) / 100;
                    this.priceImprovement = Math.round((46 / 3) * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + (785 / 3) * this.level + 471);
                    break;
                default:
            }
            _super.prototype.calculateTurretParameters.call(this);
        };
        ProjectileTurret.prototype.shoot = function () {
            _super.prototype.shoot.call(this);
            var enemy;
            if (this.fixedTarget) {
                enemy = this.followedEnemy || this.enemiesWithinRange[0];
            }
            else {
                enemy = this.enemiesWithinRange[0];
            }
            var d = Anuto.MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) + (this.y - enemy.y) * (this.y - enemy.y)));
            // cuantos ticks va a tardar la bala en llegar?
            var ticksToImpact = Math.floor(Anuto.MathUtils.fixNumber(d / Anuto.GameConstants.BULLET_SPEED));
            // encontrar la posicion del enemigo dentro de estos ticks
            var impactPosition = enemy.getNextPosition(ticksToImpact);
            // la posicion de impacto sigue estando dentro del radio de accion?
            var dx = impactPosition.x - this.x;
            var dy = impactPosition.y - this.y;
            var impactSquareDistance = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
            switch (this.grade) {
                case 2:
                case 3:
                    if (this.canonShoot === "left") {
                        this.canonShoot = "right";
                    }
                    else {
                        this.canonShoot = "left";
                    }
                default:
            }
            if (this.range * this.range > impactSquareDistance) {
                this.shootAngle = Anuto.MathUtils.fixNumber(Math.atan2(dy, dx));
                var bullet = new Anuto.Bullet({ c: this.position.c, r: this.position.r }, this.shootAngle, enemy, this.damage, this.canonShoot, this, this.engine);
                this.engine.addBullet(bullet, this);
            }
            else {
                // no se dispara y se vuelve a estar disponible para disparar
                this.readyToShoot = true;
            }
        };
        return ProjectileTurret;
    }(Anuto.Turret));
    Anuto.ProjectileTurret = ProjectileTurret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var MathUtils = /** @class */ (function () {
        function MathUtils() {
        }
        MathUtils.fixNumber = function (n) {
            return isNaN(n) ? 0 : Math.round(1e5 * n) / 1e5;
        };
        MathUtils.isLineSegmentIntersectingCircle = function (p1, p2, c, r) {
            var inside1 = MathUtils.isPointInsideCircle(p1.x, p1.y, c.x, c.y, r);
            if (inside1) {
                return true;
            }
            var inside2 = MathUtils.isPointInsideCircle(p2.x, p2.y, c.x, c.y, r);
            if (inside2) {
                return true;
            }
            var dx = p1.x - p2.x;
            var dy = p1.y - p2.y;
            var len = MathUtils.fixNumber(Math.sqrt(dx * dx + dy * dy));
            var dot = ((c.x - p1.x) * (p2.x - p1.x) + (c.y - p1.y) * (p2.y - p1.y)) / (len * len);
            var closestX = p1.x + (dot * (p2.x - p1.x));
            var closestY = p1.y + (dot * (p2.y - p1.y));
            var onSegment = MathUtils.isPointInLineSegment(p1.x, p1.y, p2.x, p2.y, closestX, closestY);
            if (!onSegment) {
                return false;
            }
            var distX = closestX - c.x;
            var distY = closestY - c.y;
            var distance = MathUtils.fixNumber(Math.sqrt((distX * distX) + (distY * distY)));
            if (distance <= r) {
                return true;
            }
            else {
                return false;
            }
        };
        MathUtils.isPointInLineSegment = function (x1, y1, x2, y2, px, py) {
            var d1 = MathUtils.fixNumber(Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1)));
            var d2 = MathUtils.fixNumber(Math.sqrt((px - x2) * (px - x2) + (py - y2) * (py - y2)));
            var lineLen = MathUtils.fixNumber(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));
            var buffer = .1;
            if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
                return true;
            }
            else {
                return false;
            }
        };
        MathUtils.isPointInsideCircle = function (x, y, cx, cy, r) {
            var dx = cx - x;
            var dy = cy - y;
            var d = MathUtils.fixNumber(Math.sqrt(dx * dx + dy * dy));
            if (d <= r) {
                return true;
            }
            else {
                return false;
            }
        };
        MathUtils.splitList = function (list) {
            if (list.length === 0) {
                return { leftHalf: [], rigthHalf: [] };
            }
            if (list.length === 1) {
                return { leftHalf: list, rigthHalf: [] };
            }
            var index = Math.floor(list.length / 2);
            return { leftHalf: list.slice(0, index), rigthHalf: list.slice(index) };
        };
        MathUtils.jointLists = function (list1, list2, compareFunction) {
            // defining auxiliar variables
            var result = [];
            var index1 = 0;
            var index2 = 0;
            // sortering previously ordered arrays
            while (true) {
                if (compareFunction(list1[index1], list2[index2])) {
                    result.push(list1[index1]);
                    index1++;
                }
                else {
                    result.push(list2[index2]);
                    index2++;
                }
                if (index1 === list1.length || index2 === list2.length) {
                    break;
                }
            }
            // some of the array still have elements that are not listed on the result arrays,
            // since this elements have a biggest value (according to the compare function)
            // we can just push this elements at the very end of the result
            if (index1 < list1.length) {
                return result.concat(list1.slice(index1));
            }
            if (index2 < list2.length) {
                return result.concat(list2.slice(index2));
            }
            return result;
        };
        MathUtils.mergeSort = function (list, compareFunction) {
            // Set a default compare function 
            if (!compareFunction) {
                compareFunction = function (x, y) {
                    return x < y;
                };
            }
            // breaking recursive call
            if (list.length <= 1) {
                return list;
            }
            var leftHalf;
            var rigthHalf;
            var splitingResult = MathUtils.splitList(list);
            leftHalf = splitingResult.leftHalf;
            rigthHalf = splitingResult.rigthHalf;
            // Recursive call.
            // Passing the compare function to recursive calls to prevent the creation of unnecessary
            // functions on each call.
            return MathUtils.jointLists(MathUtils.mergeSort(leftHalf, compareFunction), MathUtils.mergeSort(rigthHalf, compareFunction), compareFunction);
        };
        return MathUtils;
    }());
    Anuto.MathUtils = MathUtils;
})(Anuto || (Anuto = {}));
//# sourceMappingURL=anuto-core-engine.js.map