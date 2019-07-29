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
    var EnemiesSpawner = (function () {
        function EnemiesSpawner() {
        }
        EnemiesSpawner.prototype.getEnemy = function () {
            var enemy = null;
            if (Anuto.GameVars.ticksCounter % Anuto.GameVars.enemySpawningDeltaTicks === 0 && Anuto.GameVars.waveEnemies.length > 0) {
                var nextEnemyData = Anuto.GameVars.waveEnemies[0];
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
                    Anuto.GameVars.waveEnemies.splice(0, 1);
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
        function Turret(type, p, creationTick) {
            this.id = Turret.id;
            Turret.id++;
            this.type = type;
            this.f = 0;
            this.level = 1;
            this.readyToShoot = false;
            this.justShot = false;
            this.position = p;
            this.x = this.position.c + .5;
            this.y = this.position.r + .5;
            this.damage = Anuto.GameVars.turretData[type].damage;
            this.range = Anuto.GameVars.turretData[type].range;
            this.reload = Anuto.GameVars.turretData[type].reload;
            this.value = Anuto.GameVars.turretData[type].price;
            this.creationTick = creationTick;
            this.reloadTicks = Math.floor(Anuto.GameConstants.RELOAD_BASE_TICKS * this.reload);
        }
        Turret.prototype.destroy = function () {
        };
        Turret.prototype.update = function () {
            if (this.readyToShoot) {
                this.shoot();
                if (this.justShot) {
                    this.readyToShoot = false;
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
        Turret.prototype.upgrade = function () {
            this.level++;
        };
        Turret.prototype.shoot = function () {
        };
        Turret.prototype.getEnemiesWithinRange = function () {
            var enemies = [];
            var squareDist = 1e10;
            for (var i = 0; i < Anuto.GameVars.enemies.length; i++) {
                var dx = this.x - Anuto.GameVars.enemies[i].x;
                var dy = this.y - Anuto.GameVars.enemies[i].y;
                squareDist = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                if (this.range * this.range >= squareDist) {
                    enemies.push({ enemy: Anuto.GameVars.enemies[i], squareDist: squareDist });
                }
            }
            return enemies;
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
            this.type = type;
            this.enemyData = Anuto.GameVars.enemyData[this.type];
            this.life = this.enemyData.life;
            this.value = this.enemyData.value;
            this.speed = this.enemyData.speed;
            this.creationTick = creationTick;
            this.l = 0;
            var p = Anuto.Engine.getPathPosition(this.l);
            this.x = p.x;
            this.y = p.y;
            this.boundingRadius = .4;
        }
        Enemy.prototype.destroy = function () {
        };
        Enemy.prototype.update = function () {
            this.l = Anuto.MathUtils.fixNumber(this.l + this.speed);
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
        Enemy.prototype.hit = function (damage) {
            this.life -= damage;
            if (this.life <= 0) {
                Anuto.Engine.currentInstance.onEnemyKilled(this);
            }
        };
        Enemy.prototype.restoreHealth = function () {
            this.life = this.enemyData.life;
        };
        Enemy.prototype.getNextPosition = function (deltaTicks) {
            var l = Anuto.MathUtils.fixNumber(this.l + this.speed * deltaTicks);
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
            this.removeBulletsAndAccountDamage();
            this.checkCollisions();
            this.spawnEnemies();
            Anuto.GameVars.enemies.forEach(function (enemy) {
                enemy.update();
            });
            this.turrets.forEach(function (turret) {
                turret.update();
            });
            this.bullets.forEach(function (bullet) {
                bullet.update();
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
            this.bulletsColliding = [];
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
                    turret = new Anuto.ProjectileTurret(p, Anuto.GameVars.ticksCounter);
                    break;
                case Anuto.GameConstants.TURRET_LASER:
                    turret = new Anuto.LaserTurret(p, Anuto.GameVars.ticksCounter);
                    break;
                case Anuto.GameConstants.TURRET_LAUNCH:
                    turret = new Anuto.LaunchTurret(p, Anuto.GameVars.ticksCounter);
                    break;
                case Anuto.GameConstants.TURRET_GLUE:
                    turret = new Anuto.GlueTurret(p, Anuto.GameVars.ticksCounter);
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
        Engine.prototype.addBullet = function (bullet, turret) {
            this.bullets.push(bullet);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.BULLET_SHOT, [bullet, turret]));
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
            var i = Anuto.GameVars.enemies.indexOf(enemy);
            Anuto.GameVars.enemies.splice(i, 1);
            enemy.destroy();
            Anuto.GameVars.credits += enemy.value;
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_KILLED, [enemy]));
            if (Anuto.GameVars.enemies.length === 0) {
                this.waveOver();
            }
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
                var bp1 = { x: bullet.x, y: bullet.y };
                var bp2 = bullet.getPositionNextTick();
                var enemyPosition = { x: enemy.x, y: enemy.y };
                var enemyHit = Anuto.MathUtils.isLineSegmentIntersectingCircle(bp1, bp2, enemyPosition, enemy.boundingRadius);
                if (enemyHit) {
                    this.bulletsColliding.push(bullet);
                }
            }
        };
        Engine.prototype.removeBulletsAndAccountDamage = function () {
            if (this.bulletsColliding.length > 0) {
                for (var i = 0; i < this.bulletsColliding.length; i++) {
                    var bullet = this.bulletsColliding[i];
                    var enemy = bullet.assignedEnemy;
                    enemy.hit(bullet.damage);
                    var index = this.bullets.indexOf(bullet);
                    this.bullets.splice(index, 1);
                    this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.ENEMY_HIT, [enemy, bullet]));
                    bullet.destroy();
                }
                this.bulletsColliding.length = 0;
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
        GameConstants.ENEMY_SOLDIER = "soldier";
        GameConstants.ENEMY_RUNNER = "runner";
        GameConstants.ENEMY_HEALER = "healer";
        GameConstants.ENEMY_BLOB = "blob";
        GameConstants.ENEMY_FLIER = "flier";
        GameConstants.TURRET_PROJECTILE = "projectile";
        GameConstants.TURRET_LASER = "laser";
        GameConstants.TURRET_LAUNCH = "launch";
        GameConstants.TURRET_GLUE = "glue";
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
                    if (distanceSquare < Anuto.GameConstants.HEALER_HEALING_RADIUS * Anuto.GameConstants.HEALER_HEALING_RADIUS) {
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
        Event.ENEMY_HIT = "enemy hit";
        Event.ENEMY_REACHED_EXIT = "enemy reached exit";
        Event.WAVE_OVER = "wave over";
        Event.BULLET_SHOT = "bullet shot";
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
    var GlueTurret = (function (_super) {
        __extends(GlueTurret, _super);
        function GlueTurret(p, creationTick) {
            return _super.call(this, Anuto.GameConstants.TURRET_GLUE, p, creationTick) || this;
        }
        GlueTurret.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        return GlueTurret;
    }(Anuto.Turret));
    Anuto.GlueTurret = GlueTurret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var LaserTurret = (function (_super) {
        __extends(LaserTurret, _super);
        function LaserTurret(p, creationTick) {
            return _super.call(this, Anuto.GameConstants.TURRET_LASER, p, creationTick) || this;
        }
        LaserTurret.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        return LaserTurret;
    }(Anuto.Turret));
    Anuto.LaserTurret = LaserTurret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var LaunchTurret = (function (_super) {
        __extends(LaunchTurret, _super);
        function LaunchTurret(p, creationTick) {
            return _super.call(this, Anuto.GameConstants.TURRET_LAUNCH, p, creationTick) || this;
        }
        LaunchTurret.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        return LaunchTurret;
    }(Anuto.Turret));
    Anuto.LaunchTurret = LaunchTurret;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var ProjectileTurret = (function (_super) {
        __extends(ProjectileTurret, _super);
        function ProjectileTurret(p, creationTick) {
            return _super.call(this, Anuto.GameConstants.TURRET_PROJECTILE, p, creationTick) || this;
        }
        ProjectileTurret.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        ProjectileTurret.prototype.shoot = function () {
            _super.prototype.shoot.call(this);
            this.justShot = false;
            var enemyData = this.getEnemiesWithinRange();
            if (enemyData.length > 0) {
                this.enemyWithinRange = enemyData[0].enemy;
                var d = Anuto.MathUtils.fixNumber(Math.sqrt(enemyData[0].squareDist));
                var ticksToImpact = Math.floor(Anuto.MathUtils.fixNumber(d / Anuto.GameConstants.BULLET_SPEED));
                var impactPosition = this.enemyWithinRange.getNextPosition(ticksToImpact);
                var dx = impactPosition.x - this.x;
                var dy = impactPosition.y - this.y;
                var impactSquareDistance = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                if (this.range * this.range > impactSquareDistance) {
                    var angle = Anuto.MathUtils.fixNumber(Math.atan2(dy, dx));
                    var bullet = new Anuto.Bullet(this.position, angle, enemyData[0].enemy, this.damage);
                    Anuto.Engine.currentInstance.addBullet(bullet, this);
                    this.justShot = true;
                }
                else {
                    this.enemyWithinRange = null;
                }
            }
            else {
                this.enemyWithinRange = null;
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