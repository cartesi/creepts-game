var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Anuto;
(function (Anuto) {
    var EnemiesSpawner = (function () {
        function EnemiesSpawner() {
        }
        EnemiesSpawner.prototype.getEnemy = function () {
            var enemy = null;
            if (Anuto.GameVars.ticksCounter % Anuto.GameVars.enemySpawningDeltaTicks === 0 && Anuto.GameVars.waveEnemies.length > 0) {
                var nextEnemyData = Anuto.GameVars.waveEnemies.shift();
                if (nextEnemyData.t === Anuto.GameVars.ticksCounter / Anuto.GameVars.enemySpawningDeltaTicks) {
                    switch (nextEnemyData.type) {
                        case Anuto.GameConstants.ENEMY_SOLDIER:
                            enemy = new Anuto.Enemy(Anuto.GameConstants.ENEMY_SOLDIER, Anuto.GameVars.ticksCounter);
                            break;
                        case Anuto.GameConstants.ENEMY_RUNNER:
                            enemy = new Anuto.Enemy(Anuto.GameConstants.ENEMY_RUNNER, Anuto.GameVars.ticksCounter);
                            break;
                        case Anuto.GameConstants.ENEMY_HEALER:
                            enemy = new Anuto.HealerEnemy(Anuto.GameVars.ticksCounter);
                            break;
                        case Anuto.GameConstants.ENEMY_BLOB:
                            enemy = new Anuto.Enemy(Anuto.GameConstants.ENEMY_BLOB, Anuto.GameVars.ticksCounter);
                            break;
                        case Anuto.GameConstants.ENEMY_FLIER:
                            enemy = new Anuto.Enemy(Anuto.GameConstants.ENEMY_FLIER, Anuto.GameVars.ticksCounter);
                            break;
                        default:
                    }
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
    var Turret = (function () {
        function Turret(type, p) {
            this.id = Turret.id;
            Turret.id++;
            this.creationTick = Anuto.GameVars.ticksCounter;
            this.type = type;
            this.f = 0;
            this.level = 1;
            this.grade = 1;
            this.position = p;
            this.fixedTarget = true;
            this.shootingStrategy = Anuto.GameConstants.STRATEGY_SHOOT_FIRST;
            this.readyToShoot = false;
            this.enemiesWithinRange = [];
            this.followedEnemy = null;
            this.x = this.position.c + .5;
            this.y = this.position.r + .5;
        }
        Turret.prototype.destroy = function () {
        };
        Turret.prototype.update = function () {
            this.enemiesWithinRange = this.getEnemiesWithinRange();
            if (this.readyToShoot) {
                if (this.enemiesWithinRange.length > 0) {
                    this.readyToShoot = false;
                    this.shoot();
                }
            }
            else {
                this.f++;
                if (this.f === this.reloadTicks) {
                    this.readyToShoot = true;
                    this.f = 0;
                }
            }
        };
        Turret.prototype.improve = function () {
            this.level++;
            this.calculateTurretParameters();
        };
        Turret.prototype.upgrade = function () {
            this.grade++;
            this.level = 1;
            this.calculateTurretParameters();
        };
        Turret.prototype.calculateTurretParameters = function () {
            this.reloadTicks = Math.floor(Anuto.GameConstants.RELOAD_BASE_TICKS * this.reload);
        };
        Turret.prototype.shoot = function () {
        };
        Turret.prototype.getEnemiesWithinRange = function () {
            var enemiesAndSquaredDistances = [];
            var squaredRange = Anuto.MathUtils.fixNumber(this.range * this.range);
            for (var i = 0; i < Anuto.GameVars.enemies.length; i++) {
                var enemy = Anuto.GameVars.enemies[i];
                if (enemy.life > 0 && Anuto.GameVars && !enemy.teleporting) {
                    var dx = this.x - enemy.x;
                    var dy = this.y - enemy.y;
                    var squaredDist = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                    if (squaredRange >= squaredDist) {
                        enemiesAndSquaredDistances.push({ enemy: enemy, squareDist: squaredDist });
                    }
                }
            }
            if (enemiesAndSquaredDistances.length > 1 && (this.type === Anuto.GameConstants.TURRET_PROJECTILE || this.type === Anuto.GameConstants.TURRET_LASER)) {
                switch (this.shootingStrategy) {
                    case Anuto.GameConstants.STRATEGY_SHOOT_LAST:
                        enemiesAndSquaredDistances = enemiesAndSquaredDistances.sort(function (e1, e2) { return e1.enemy.l - e2.enemy.l; });
                        break;
                    case Anuto.GameConstants.STRATEGY_SHOOT_CLOSEST:
                        enemiesAndSquaredDistances = enemiesAndSquaredDistances.sort(function (e1, e2) { return e1.squareDist - e2.squareDist; });
                        break;
                    case Anuto.GameConstants.STRATEGY_SHOOT_WEAKEST:
                        enemiesAndSquaredDistances = enemiesAndSquaredDistances.sort(function (e1, e2) { return e1.enemy.life - e2.enemy.life; });
                        break;
                    case Anuto.GameConstants.STRATEGY_SHOOT_STRONGEST:
                        enemiesAndSquaredDistances = enemiesAndSquaredDistances.sort(function (e1, e2) { return e2.enemy.life - e1.enemy.life; });
                        break;
                    case Anuto.GameConstants.STRATEGY_SHOOT_FIRST:
                        enemiesAndSquaredDistances = enemiesAndSquaredDistances.sort(function (e1, e2) { return e2.enemy.l - e1.enemy.l; });
                        break;
                    default:
                }
            }
            var e = [];
            for (var i = 0; i < enemiesAndSquaredDistances.length; i++) {
                e.push(enemiesAndSquaredDistances[i].enemy);
            }
            return e;
        };
        return Turret;
    }());
    Anuto.Turret = Turret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Enemy = (function () {
        function Enemy(type, creationTick) {
            this.id = Enemy.id;
            Enemy.id++;
            this.creationTick = creationTick;
            this.type = type;
            this.enemyData = Anuto.GameVars.enemyData[this.type];
            this.life = this.enemyData.life;
            this.value = this.enemyData.value;
            this.speed = this.enemyData.speed;
            this.affectedByGlue = false;
            this.glueIntensity = 0;
            this.hasBeenTeleported = false;
            this.teleporting = false;
            this.l = 0;
            this.t = 0;
            var p = Anuto.Engine.getPathPosition(this.l);
            this.x = p.x;
            this.y = p.y;
            this.boundingRadius = .4;
        }
        Enemy.prototype.destroy = function () {
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
            if (this.affectedByGlue) {
                speed = Anuto.MathUtils.fixNumber(this.speed / this.glueIntensity);
            }
            this.l = Anuto.MathUtils.fixNumber(this.l + speed);
            if (this.l >= Anuto.GameVars.enemiesPathCells.length - 1) {
                this.x = Anuto.GameVars.enemiesPathCells[Anuto.GameVars.enemiesPathCells.length - 1].c;
                this.y = Anuto.GameVars.enemiesPathCells[Anuto.GameVars.enemiesPathCells.length - 1].r;
                Anuto.Engine.currentInstance.onEnemyReachedExit(this);
            }
            else {
                var p = Anuto.Engine.getPathPosition(this.l);
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
            var p = Anuto.Engine.getPathPosition(this.l);
            this.x = p.x;
            this.y = p.y;
        };
        Enemy.prototype.glue = function (glueIntensity) {
            this.affectedByGlue = true;
            this.glueIntensity = glueIntensity;
        };
        Enemy.prototype.hit = function (damage, bullet, mortar, laserTurret) {
            this.life -= damage;
            if (this.life <= 0) {
                this.life = 0;
                Anuto.Engine.currentInstance.onEnemyKilled(this);
            }
        };
        Enemy.prototype.restoreHealth = function () {
            this.life = this.enemyData.life;
        };
        Enemy.prototype.getNextPosition = function (deltaTicks) {
            var speed = this.speed;
            if (this.affectedByGlue) {
                speed = Anuto.MathUtils.fixNumber(this.speed / this.glueIntensity);
            }
            var l = Anuto.MathUtils.fixNumber(this.l + speed * deltaTicks);
            var p = Anuto.Engine.getPathPosition(l);
            return { x: p.x, y: p.y };
        };
        return Enemy;
    }());
    Anuto.Enemy = Enemy;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Engine = (function () {
        function Engine(gameConfig, enemyData, turretData) {
            Engine.currentInstance = this;
            Anuto.Turret.id = 0;
            Anuto.Enemy.id = 0;
            Anuto.Bullet.id = 0;
            Anuto.Mortar.id = 0;
            Anuto.Glue.id = 0;
            Anuto.GameVars.runningInClientSide = gameConfig.runningInClientSide;
            Anuto.GameVars.credits = gameConfig.credits;
            Anuto.GameVars.timeStep = gameConfig.timeStep;
            Anuto.GameVars.enemySpawningDeltaTicks = gameConfig.enemySpawningDeltaTicks;
            Anuto.GameVars.paused = false;
            Anuto.GameVars.enemiesPathCells = gameConfig.enemiesPathCells;
            Anuto.GameVars.enemyData = enemyData;
            Anuto.GameVars.turretData = turretData;
            this.waveActivated = false;
            this.t = 0;
            this.eventDispatcher = new Anuto.EventDispatcher();
            this.enemiesSpawner = new Anuto.EnemiesSpawner();
            Anuto.GameVars.ticksCounter = 0;
            this.turrets = [];
        }
        Engine.getPathPosition = function (l) {
            var x;
            var y;
            var i = Math.floor(l);
            if (i === Anuto.GameVars.enemiesPathCells.length - 1) {
                x = Anuto.GameVars.enemiesPathCells[Anuto.GameVars.enemiesPathCells.length - 1].c;
                y = Anuto.GameVars.enemiesPathCells[Anuto.GameVars.enemiesPathCells.length - 1].r;
            }
            else {
                var dl = Anuto.MathUtils.fixNumber(l - i);
                x = Anuto.GameVars.enemiesPathCells[i].c + .5;
                y = Anuto.GameVars.enemiesPathCells[i].r + .5;
                var dx = Anuto.MathUtils.fixNumber(Anuto.GameVars.enemiesPathCells[i + 1].c - Anuto.GameVars.enemiesPathCells[i].c);
                var dy = Anuto.MathUtils.fixNumber(Anuto.GameVars.enemiesPathCells[i + 1].r - Anuto.GameVars.enemiesPathCells[i].r);
                x = Anuto.MathUtils.fixNumber(x + dx * dl);
                y = Anuto.MathUtils.fixNumber(y + dy * dl);
            }
            return { x: x, y: y };
        };
        Engine.prototype.update = function () {
            if (Anuto.GameVars.runningInClientSide) {
                var t = Date.now();
                if (t - this.t < Anuto.GameVars.timeStep) {
                    return;
                }
                this.t = t;
            }
            if (!this.waveActivated || Anuto.GameVars.paused) {
                return;
            }
            this.removeProjectilesAndAccountDamage();
            this.teleport();
            this.checkCollisions();
            this.spawnEnemies();
            Anuto.GameVars.enemies.forEach(function (enemy) {
                enemy.update();
            }, this);
            this.turrets.forEach(function (turret) {
                turret.update();
            });
            this.bullets.forEach(function (bullet) {
                bullet.update();
            });
            this.mortars.forEach(function (mortars) {
                mortars.update();
            });
            this.glues.forEach(function (glue) {
                glue.update();
            });
            Anuto.GameVars.ticksCounter++;
        };
        Engine.prototype.newWave = function (waveConfig) {
            Anuto.GameVars.level = waveConfig.level;
            Anuto.GameVars.waveEnemies = waveConfig.enemies.slice(0);
            Anuto.GameVars.ticksCounter = 0;
            for (var i = 0; i < waveConfig.turrets.length; i++) {
            }
            this.waveActivated = true;
            this.t = Date.now();
            Anuto.GameVars.enemies = [];
            this.bullets = [];
            this.mortars = [];
            this.glues = [];
            this.bulletsColliding = [];
            this.mortarsImpacting = [];
            this.consumedGlues = [];
            this.teleportedEnemies = [];
        };
        Engine.prototype.removeEnemy = function (enemy) {
            var i = Anuto.GameVars.enemies.indexOf(enemy);
            if (i !== -1) {
                Anuto.GameVars.enemies.splice(i, 1);
            }
            enemy.destroy();
        };
        Engine.prototype.addTurret = function (type, p) {
            var turret = null;
            switch (type) {
                case Anuto.GameConstants.TURRET_PROJECTILE:
                    turret = new Anuto.ProjectileTurret(p);
                    break;
                case Anuto.GameConstants.TURRET_LASER:
                    turret = new Anuto.LaserTurret(p);
                    break;
                case Anuto.GameConstants.TURRET_LAUNCH:
                    turret = new Anuto.LaunchTurret(p);
                    break;
                case Anuto.GameConstants.TURRET_GLUE:
                    turret = new Anuto.GlueTurret(p);
                    break;
                default:
            }
            this.turrets.push(turret);
            Anuto.GameVars.credits -= turret.value;
            return turret;
        };
        Engine.prototype.sellTurret = function (turret) {
            var i = this.turrets.indexOf(turret);
            if (i !== -1) {
                this.turrets.splice(i, 1);
            }
            Anuto.GameVars.credits += turret.value;
            turret.destroy();
        };
        Engine.prototype.addBullet = function (bullet, projectileTurret) {
            this.bullets.push(bullet);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.BULLET_SHOT, [bullet, projectileTurret]));
        };
        Engine.prototype.addGlue = function (glue, glueTurret) {
            this.glues.push(glue);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.GLUE_SHOT, [glue, glueTurret]));
        };
        Engine.prototype.addMortar = function (mortar, launchTurret) {
            this.mortars.push(mortar);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.MORTAR_SHOT, [mortar, launchTurret]));
        };
        Engine.prototype.addLaserRay = function (laserTurret, enemy) {
            enemy.hit(laserTurret.damage, null, null, laserTurret);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.LASER_SHOT, [laserTurret, enemy]));
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_HIT, [[enemy]]));
        };
        Engine.prototype.flagEnemyToTeleport = function (enemy, glueTurret) {
            this.teleportedEnemies.push({ enemy: enemy, glueTurret: glueTurret });
            for (var i = 0; i < this.bullets.length; i++) {
                var bullet = this.bullets[i];
                if (bullet.assignedEnemy.id === enemy.id && this.bulletsColliding.indexOf(bullet) === -1) {
                    bullet.assignedEnemy = null;
                    this.bulletsColliding.push(bullet);
                }
            }
        };
        Engine.prototype.onEnemyReachedExit = function (enemy) {
            var i = Anuto.GameVars.enemies.indexOf(enemy);
            Anuto.GameVars.enemies.splice(i, 1);
            enemy.destroy();
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_REACHED_EXIT, [enemy]));
            if (Anuto.GameVars.enemies.length === 0) {
                this.waveOver();
            }
        };
        Engine.prototype.onEnemyKilled = function (enemy) {
            Anuto.GameVars.credits += enemy.value;
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_KILLED, [enemy]));
            var i = Anuto.GameVars.enemies.indexOf(enemy);
            Anuto.GameVars.enemies.splice(i, 1);
            enemy.destroy();
            if (Anuto.GameVars.enemies.length === 0) {
                this.waveOver();
            }
        };
        Engine.prototype.improveTurret = function (id) {
            var success = false;
            var turret = this.getTurretById(id);
            if (turret.level < 10 && Anuto.GameVars.credits >= turret.priceImprovement) {
                Anuto.GameVars.credits -= turret.priceImprovement;
                turret.improve();
                success = true;
            }
            return success;
        };
        Engine.prototype.upgradeTurret = function (id) {
            var success = false;
            var turret = this.getTurretById(id);
            if (turret.grade < 3 && Anuto.GameVars.credits >= turret.priceUpgrade) {
                Anuto.GameVars.credits -= turret.priceUpgrade;
                turret.upgrade();
                success = true;
            }
            return success;
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
            for (var i = 0; i < this.mortars.length; i++) {
                if (this.mortars[i].detonate) {
                    this.mortarsImpacting.push(this.mortars[i]);
                }
            }
            for (var i = 0; i < Anuto.GameVars.enemies.length; i++) {
                var enemy = Anuto.GameVars.enemies[i];
                if (enemy.type !== Anuto.GameConstants.ENEMY_FLIER) {
                    enemy.affectedByGlue = false;
                    for (var j = 0; j < this.glues.length; j++) {
                        var glue = this.glues[j];
                        if (glue.consumed && this.consumedGlues.indexOf(glue) === -1) {
                            this.consumedGlues.push(glue);
                        }
                        else {
                            var dx = enemy.x - glue.x;
                            var dy = enemy.y - glue.y;
                            var squaredDist = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                            var squaredRange = Anuto.MathUtils.fixNumber(glue.range * glue.range);
                            if (squaredRange >= squaredDist) {
                                enemy.glue(glue.intensity);
                                break;
                            }
                        }
                    }
                }
            }
        };
        Engine.prototype.removeProjectilesAndAccountDamage = function () {
            for (var i = 0; i < this.bulletsColliding.length; i++) {
                var bullet = this.bulletsColliding[i];
                var enemy = bullet.assignedEnemy;
                if (enemy === null || enemy.life === 0) {
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
            if (teleportedEnemiesData.length) {
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMIES_TELEPORTED, [teleportedEnemiesData]));
            }
        };
        Engine.prototype.spawnEnemies = function () {
            var enemy = this.enemiesSpawner.getEnemy();
            if (enemy) {
                Anuto.GameVars.enemies.push(enemy);
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_SPAWNED, [enemy, Anuto.GameVars.enemiesPathCells[0]]));
            }
        };
        Engine.prototype.waveOver = function () {
            this.waveActivated = false;
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.WAVE_OVER));
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
        Object.defineProperty(Engine.prototype, "ticksCounter", {
            get: function () {
                return Anuto.GameVars.ticksCounter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "credits", {
            get: function () {
                return Anuto.GameVars.credits;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "timeStep", {
            get: function () {
                return Anuto.GameVars.timeStep;
            },
            set: function (value) {
                Anuto.GameVars.timeStep = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "paused", {
            set: function (value) {
                Anuto.GameVars.paused = value;
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
    var GameConstants = (function () {
        function GameConstants() {
        }
        GameConstants.RELOAD_BASE_TICKS = 10;
        GameConstants.BULLET_SPEED = .5;
        GameConstants.MORTAR_SPEED = .1;
        GameConstants.ENEMY_SOLDIER = "soldier";
        GameConstants.ENEMY_RUNNER = "runner";
        GameConstants.ENEMY_HEALER = "healer";
        GameConstants.ENEMY_BLOB = "blob";
        GameConstants.ENEMY_FLIER = "flier";
        GameConstants.TURRET_PROJECTILE = "projectile";
        GameConstants.TURRET_LASER = "laser";
        GameConstants.TURRET_LAUNCH = "launch";
        GameConstants.TURRET_GLUE = "glue";
        GameConstants.STRATEGY_SHOOT_CLOSEST = "shoot closest";
        GameConstants.STRATEGY_SHOOT_WEAKEST = "shoot weakest";
        GameConstants.STRATEGY_SHOOT_STRONGEST = "shoot strongest";
        GameConstants.STRATEGY_SHOOT_FIRST = "shoot first";
        GameConstants.STRATEGY_SHOOT_LAST = "shoot last";
        GameConstants.HEALER_HEALING_TICKS = 100;
        GameConstants.HEALER_STOP_TICKS = 30;
        GameConstants.HEALER_HEALING_RADIUS = 2;
        return GameConstants;
    }());
    Anuto.GameConstants = GameConstants;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var GameVars = (function () {
        function GameVars() {
        }
        return GameVars;
    }());
    Anuto.GameVars = GameVars;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var HealerEnemy = (function (_super) {
        __extends(HealerEnemy, _super);
        function HealerEnemy(creationTick) {
            var _this = _super.call(this, Anuto.GameConstants.ENEMY_HEALER, creationTick) || this;
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
                if (this.f === Anuto.GameConstants.HEALER_HEALING_TICKS && this.l < Anuto.GameVars.enemiesPathCells.length - 2) {
                    this.f = 0;
                    this.healing = true;
                }
            }
        };
        HealerEnemy.prototype.heal = function () {
            for (var i = 0; i < Anuto.GameVars.enemies.length; i++) {
                var enemy = Anuto.GameVars.enemies[i];
                if (enemy.id === this.id) {
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
    var Event = (function () {
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
        Event.ENEMY_REACHED_EXIT = "enemy reached exit";
        Event.WAVE_OVER = "wave over";
        Event.BULLET_SHOT = "bullet shot";
        Event.LASER_SHOT = "laser shot";
        Event.MORTAR_SHOT = "mortar shot";
        Event.GLUE_SHOT = "glue shot";
        Event.GLUE_CONSUMED = "glue consumed";
        Event.ENEMIES_TELEPORTED = "enemies teleported";
        return Event;
    }());
    Anuto.Event = Event;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var EventDispatcher = (function () {
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
    var Bullet = (function () {
        function Bullet(p, angle, assignedEnemy, damage) {
            this.id = Bullet.id;
            Bullet.id++;
            this.x = p.c + .5;
            this.y = p.r + .5;
            this.assignedEnemy = assignedEnemy;
            this.damage = damage;
            this.vx = Anuto.MathUtils.fixNumber(Anuto.GameConstants.BULLET_SPEED * Math.cos(angle));
            this.vy = Anuto.MathUtils.fixNumber(Anuto.GameConstants.BULLET_SPEED * Math.sin(angle));
        }
        Bullet.prototype.destroy = function () {
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
    var Glue = (function () {
        function Glue(p, intensity, duration, range) {
            this.id = Glue.id;
            Glue.id++;
            this.x = p.c + .5;
            this.y = p.r + .5;
            this.intensity = intensity;
            this.duration = duration;
            this.range = range;
            this.consumed = false;
            this.f = 0;
        }
        Glue.prototype.destroy = function () {
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
    var GlueTurret = (function (_super) {
        __extends(GlueTurret, _super);
        function GlueTurret(p) {
            var _this = _super.call(this, Anuto.GameConstants.TURRET_GLUE, p) || this;
            _this.calculateTurretParameters();
            return _this;
        }
        GlueTurret.prototype.calculateTurretParameters = function () {
            switch (this.grade) {
                case 1:
                    this.damage = Math.floor(1 / 3 * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + 95 / 3 * this.level + 66);
                    this.reload = 5;
                    this.range = Math.round((2 / 45 * this.level + 12 / 9) * 10) / 10;
                    this.duration = 3;
                    this.durationTicks = Math.floor(Anuto.GameConstants.RELOAD_BASE_TICKS * this.duration);
                    this.intensity = 2;
                    this.priceImprovement = Math.floor(29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
                    break;
                case 2:
                    this.damage = Math.floor(1 / 3 * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + 95 / 3 * this.level + 66);
                    this.reload = 5;
                    this.range = Math.round((2 / 45 * this.level + 12 / 9) * 10) / 10;
                    this.duration = 3;
                    this.durationTicks = Math.floor(Anuto.GameConstants.RELOAD_BASE_TICKS * this.duration);
                    this.intensity = 2;
                    this.priceImprovement = Math.floor(29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
                    break;
                case 3:
                    this.teleportDistance = 5;
                    this.reload = 5;
                    this.range = Math.round((4 / 45 * this.level + 24 / 9) * 10) / 10;
                    this.priceImprovement = Math.floor(29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
                    break;
                default:
            }
            this.priceUpgrade = 800 * this.grade;
            if (this.level === 1 && this.grade === 1) {
                this.value = Anuto.GameVars.turretData[this.type].price;
            }
            else {
            }
            _super.prototype.calculateTurretParameters.call(this);
        };
        GlueTurret.prototype.shoot = function () {
            _super.prototype.shoot.call(this);
            switch (this.grade) {
                case 1:
                    var glue = new Anuto.Glue(this.position, this.intensity, this.durationTicks, this.range);
                    Anuto.Engine.currentInstance.addGlue(glue, this);
                    break;
                case 2:
                    break;
                case 3:
                    var enemy = void 0;
                    if (this.fixedTarget) {
                        enemy = this.followedEnemy || this.enemiesWithinRange[0];
                    }
                    else {
                        enemy = this.enemiesWithinRange[0];
                    }
                    if (enemy.life > 0 && !enemy.hasBeenTeleported) {
                        Anuto.Engine.currentInstance.flagEnemyToTeleport(enemy, this);
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
    var LaserTurret = (function (_super) {
        __extends(LaserTurret, _super);
        function LaserTurret(p) {
            var _this = _super.call(this, Anuto.GameConstants.TURRET_LASER, p) || this;
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
        LaserTurret.prototype.calculateTurretParameters = function () {
            this.damage = Math.floor(271 / 630 * Math.pow(this.level, 3) + 283 / 315 * Math.pow(this.level, 2) + 2437 / 70 * this.level + 1357 / 7);
            this.reload = Math.round((-.1 * this.level + 1.6) * 10) / 10;
            this.range = Math.round((.04 * this.level + 2.96) * 10) / 10;
            this.priceImprovement = Math.floor(9 / 80 * Math.pow(this.level, 3) + 17 / 120 * Math.pow(this.level, 2) + 2153 / 240 * this.level + 1631 / 40);
            this.priceUpgrade = 7000 * this.grade;
            if (this.level === 1) {
                this.value = Anuto.GameVars.turretData[this.type].price;
            }
            else {
            }
            _super.prototype.calculateTurretParameters.call(this);
        };
        LaserTurret.prototype.shoot = function () {
            _super.prototype.shoot.call(this);
            var enemy;
            if (this.fixedTarget) {
                enemy = this.followedEnemy || this.enemiesWithinRange[0];
            }
            else {
                enemy = this.enemiesWithinRange[0];
            }
            if (enemy.life > 0) {
                Anuto.Engine.currentInstance.addLaserRay(this, enemy);
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
    var LaunchTurret = (function (_super) {
        __extends(LaunchTurret, _super);
        function LaunchTurret(p) {
            var _this = _super.call(this, Anuto.GameConstants.TURRET_LAUNCH, p) || this;
            _this.calculateTurretParameters();
            return _this;
        }
        LaunchTurret.prototype.calculateTurretParameters = function () {
            this.damage = Math.floor(1 / 3 * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + 95 / 3 * this.level + 66);
            this.reload = Math.round(((-2 / 18) * this.level + 38 / 18) * 10) / 10;
            this.range = Math.round((2 / 45 * this.level + 221 / 90) * 10) / 10;
            this.explosionRange = this.range * .6;
            this.priceImprovement = Math.floor(29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
            this.priceUpgrade = 10000 * this.grade;
            if (this.level === 1) {
                this.value = Anuto.GameVars.turretData[this.type].price;
            }
            else {
            }
            _super.prototype.calculateTurretParameters.call(this);
        };
        LaunchTurret.prototype.shoot = function () {
            _super.prototype.shoot.call(this);
            var enemy;
            if (this.fixedTarget) {
                enemy = this.followedEnemy || this.enemiesWithinRange[0];
            }
            else {
                enemy = this.enemiesWithinRange[0];
            }
            var d = Anuto.MathUtils.fixNumber(Math.sqrt((this.x - enemy.x) * (this.x - enemy.x) + (this.y - enemy.y) * (this.y - enemy.y)));
            var ticksToImpact = Math.floor(Anuto.MathUtils.fixNumber(d / Anuto.GameConstants.MORTAR_SPEED));
            var impactPosition = enemy.getNextPosition(ticksToImpact);
            var deviation_x = Anuto.MathUtils.fixNumber(LaunchTurret.deviationRadius * Math.cos(LaunchTurret.deviationAngle * Math.PI / 180));
            var deviation_y = Anuto.MathUtils.fixNumber(LaunchTurret.deviationRadius * Math.sin(LaunchTurret.deviationAngle * Math.PI / 180));
            impactPosition.x += deviation_x;
            impactPosition.y += deviation_y;
            LaunchTurret.deviationRadius = LaunchTurret.deviationRadius === .75 ? 0 : LaunchTurret.deviationRadius + .25;
            LaunchTurret.deviationAngle = LaunchTurret.deviationAngle === 315 ? 0 : LaunchTurret.deviationAngle + 45;
            d = Anuto.MathUtils.fixNumber(Math.sqrt((this.x - impactPosition.x) * (this.x - impactPosition.x) + (this.y - impactPosition.y) * (this.y - impactPosition.y)));
            if (d < this.range) {
                ticksToImpact = Math.floor(Anuto.MathUtils.fixNumber(d / Anuto.GameConstants.MORTAR_SPEED));
                var dx = impactPosition.x - this.x;
                var dy = impactPosition.y - this.y;
                this.shootAngle = Anuto.MathUtils.fixNumber(Math.atan2(dy, dx));
                var mortar = new Anuto.Mortar(this.position, this.shootAngle, ticksToImpact, this.explosionRange, this.damage);
                Anuto.Engine.currentInstance.addMortar(mortar, this);
            }
            else {
                this.readyToShoot = true;
            }
        };
        LaunchTurret.deviationRadius = 0;
        LaunchTurret.deviationAngle = 0;
        return LaunchTurret;
    }(Anuto.Turret));
    Anuto.LaunchTurret = LaunchTurret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Mortar = (function () {
        function Mortar(p, angle, ticksToImpact, explosionRange, damage) {
            this.id = Mortar.id;
            Mortar.id++;
            this.creationTick = Anuto.GameVars.ticksCounter;
            this.x = p.c + .5;
            this.y = p.r + .5;
            this.ticksToImpact = ticksToImpact;
            this.explosionRange = explosionRange;
            this.damage = damage;
            this.detonate = false;
            this.f = 0;
            this.vx = Anuto.MathUtils.fixNumber(Anuto.GameConstants.MORTAR_SPEED * Math.cos(angle));
            this.vy = Anuto.MathUtils.fixNumber(Anuto.GameConstants.MORTAR_SPEED * Math.sin(angle));
        }
        Mortar.prototype.destroy = function () {
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
            for (var i = 0; i < Anuto.GameVars.enemies.length; i++) {
                var enemy = Anuto.GameVars.enemies[i];
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
    var ProjectileTurret = (function (_super) {
        __extends(ProjectileTurret, _super);
        function ProjectileTurret(p) {
            var _this = _super.call(this, Anuto.GameConstants.TURRET_PROJECTILE, p) || this;
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
        ProjectileTurret.prototype.calculateTurretParameters = function () {
            this.damage = Math.floor(1 / 3 * Math.pow(this.level, 3) + 2 * Math.pow(this.level, 2) + 95 / 3 * this.level + 66);
            this.reload = Math.round(((-1 / 18) * this.level + 19 / 18) * 10) / 10;
            this.range = Math.round((2 / 45 * this.level + 221 / 90) * 10) / 10;
            this.priceImprovement = Math.floor(29 / 336 * Math.pow(this.level, 3) + 27 / 56 * Math.pow(this.level, 2) + 2671 / 336 * this.level + 2323 / 56);
            this.priceUpgrade = 5600 * this.grade;
            if (this.level === 1) {
                this.value = Anuto.GameVars.turretData[this.type].price;
            }
            else {
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
            var ticksToImpact = Math.floor(Anuto.MathUtils.fixNumber(d / Anuto.GameConstants.BULLET_SPEED));
            var impactPosition = enemy.getNextPosition(ticksToImpact);
            var dx = impactPosition.x - this.x;
            var dy = impactPosition.y - this.y;
            var impactSquareDistance = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
            if (this.range * this.range > impactSquareDistance) {
                this.shootAngle = Anuto.MathUtils.fixNumber(Math.atan2(dy, dx));
                var bullet = new Anuto.Bullet(this.position, this.shootAngle, enemy, this.damage);
                Anuto.Engine.currentInstance.addBullet(bullet, this);
            }
            else {
                this.readyToShoot = true;
            }
        };
        return ProjectileTurret;
    }(Anuto.Turret));
    Anuto.ProjectileTurret = ProjectileTurret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var MathUtils = (function () {
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
        return MathUtils;
    }());
    Anuto.MathUtils = MathUtils;
})(Anuto || (Anuto = {}));
//# sourceMappingURL=anuto-core-engine.js.map