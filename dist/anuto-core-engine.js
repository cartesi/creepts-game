var Anuto;
(function (Anuto) {
    var Bullet = (function () {
        function Bullet(p, angle) {
            this.id = Bullet.id;
            Bullet.id++;
            this.x = p.c + .5;
            this.y = p.r + .5;
            this.vx = Anuto.GameConstants.BULLET_SPEED * Math.cos(angle);
            this.vy = Anuto.GameConstants.BULLET_SPEED * Math.sin(angle);
        }
        Bullet.prototype.update = function () {
            this.x += this.vx;
            this.y += this.vy;
        };
        Bullet.prototype.getPositionNextTick = function () {
            return { x: this.x + this.vx, y: this.y + this.vy };
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
            if (Anuto.GameVars.ticksCounter % 25 === 0 && Anuto.GameVars.enemiesCounter < Anuto.GameVars.waveTotalEnemies) {
                enemy = new Anuto.Enemy("enemy_1", Anuto.GameVars.ticksCounter);
            }
            return enemy;
        };
        return EnemiesSpawner;
    }());
    Anuto.EnemiesSpawner = EnemiesSpawner;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Enemy = (function () {
        function Enemy(type, creationTick) {
            this.id = Enemy.id;
            Enemy.id++;
            this.type = type;
            this.life = Anuto.GameVars.enemyData.enemies[this.type].life;
            this.speed = Anuto.GameVars.enemyData.enemies[this.type].speed;
            this.creationTick = creationTick;
            this.x = Anuto.GameVars.enemyStartPosition.c + .5;
            this.y = Anuto.GameVars.enemyStartPosition.r + .5;
        }
        Enemy.prototype.destroy = function () {
        };
        Enemy.prototype.update = function () {
            this.y += this.speed;
            if (this.y > Anuto.GameVars.enemyEndPosition.r + .5) {
                Anuto.Engine.currentInstance.onEnemyReachedExit(this);
            }
        };
        Enemy.prototype.hit = function (damage) {
            this.life -= damage;
            if (this.life <= 0) {
                Anuto.Engine.currentInstance.onEnemyKilled(this);
            }
        };
        Enemy.prototype.getNextPosition = function (ticks) {
            var x = this.x;
            var y = this.y + this.speed * ticks;
            return { x: x, y: y };
        };
        return Enemy;
    }());
    Anuto.Enemy = Enemy;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Engine = (function () {
        function Engine(gameConfig, enemyData, towerData) {
            Engine.currentInstance = this;
            Anuto.Tower.id = 0;
            Anuto.Enemy.id = 0;
            Anuto.Bullet.id = 0;
            Anuto.GameVars.credits = gameConfig.credits;
            Anuto.GameVars.timeStep = gameConfig.timeStep;
            Anuto.GameVars.enemiesPathCells = gameConfig.enemiesPathCells;
            Anuto.GameVars.enemyStartPosition = { r: Anuto.GameVars.enemiesPathCells[0].r - 1, c: Anuto.GameVars.enemiesPathCells[0].c };
            Anuto.GameVars.enemyEndPosition = { r: Anuto.GameVars.enemiesPathCells[Anuto.GameVars.enemiesPathCells.length - 1].r + 1, c: Anuto.GameVars.enemiesPathCells[Anuto.GameVars.enemiesPathCells.length - 1].c };
            Anuto.GameVars.enemyData = enemyData;
            Anuto.GameVars.towerData = towerData;
            this.waveActivated = false;
            this.t = 0;
            Anuto.GameVars.waveTotalEnemies = 0;
            this.eventDispatcher = new Anuto.EventDispatcher();
            this.enemiesSpawner = new Anuto.EnemiesSpawner();
            Anuto.GameVars.ticksCounter = 0;
            this.towers = [];
        }
        Engine.prototype.update = function () {
            var t = Date.now();
            if (t - this.t < Anuto.GameVars.timeStep || !this.waveActivated) {
                return;
            }
            this.t = t;
            Anuto.GameVars.enemies.forEach(function (enemy) {
                enemy.update();
            });
            this.towers.forEach(function (tower) {
                tower.update();
            });
            this.bullets.forEach(function (bullet) {
                bullet.update();
            });
            this.checkCollisions();
            this.spawnEnemies();
            Anuto.GameVars.ticksCounter++;
        };
        Engine.prototype.newWave = function (waveConfig) {
            Anuto.GameVars.level = waveConfig.level;
            Anuto.GameVars.waveTotalEnemies = waveConfig.totalEnemies;
            Anuto.GameVars.enemiesCounter = 0;
            Anuto.GameVars.ticksCounter = 0;
            for (var i = 0; i < waveConfig.towers.length; i++) {
            }
            this.waveActivated = true;
            this.t = Date.now();
            Anuto.GameVars.enemies = [];
            this.bullets = [];
        };
        Engine.prototype.removeEnemy = function (enemy) {
            var i = Anuto.GameVars.enemies.indexOf(enemy);
            if (i !== -1) {
                Anuto.GameVars.enemies.splice(i, 1);
            }
            enemy.destroy();
        };
        Engine.prototype.addTower = function (type, p) {
            var tower = new Anuto.Tower(type, p, Anuto.GameVars.ticksCounter);
            this.towers.push(tower);
            return tower;
        };
        Engine.prototype.sellTower = function (tower) {
            var i = this.towers.indexOf(tower);
            if (i !== -1) {
                this.towers.splice(i, 1);
            }
            Anuto.GameVars.credits += tower.value;
            tower.destroy();
        };
        Engine.prototype.addBullet = function (bullet, tower) {
            this.bullets.push(bullet);
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.EVENT_BULLET_SHOT, [bullet, tower]));
        };
        Engine.prototype.onEnemyReachedExit = function (enemy) {
            var i = Anuto.GameVars.enemies.indexOf(enemy);
            Anuto.GameVars.enemies.splice(i, 1);
            enemy.destroy();
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.EVENT_ENEMY_REACHED_EXIT, [enemy]));
        };
        Engine.prototype.onEnemyKilled = function (enemy) {
            var i = Anuto.GameVars.enemies.indexOf(enemy);
            Anuto.GameVars.enemies.splice(i, 1);
            enemy.destroy();
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.EVENT_ENEMY_KILLED, [enemy]));
        };
        Engine.prototype.addEventListener = function (type, listenerFunction, scope) {
            this.eventDispatcher.addEventListener(type, listenerFunction, scope);
        };
        Engine.prototype.removeEventListener = function (type, listenerFunction) {
            this.eventDispatcher.removeEventListener(type, listenerFunction);
        };
        Engine.prototype.checkCollisions = function () {
        };
        Engine.prototype.spawnEnemies = function () {
            var enemy = this.enemiesSpawner.getEnemy();
            if (enemy) {
                Anuto.GameVars.enemies.push(enemy);
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.EVENT_ENEMY_SPAWNED, [enemy, Anuto.GameVars.enemyStartPosition]));
                Anuto.GameVars.enemiesCounter++;
            }
        };
        Object.defineProperty(Engine.prototype, "ticksCounter", {
            get: function () {
                return Anuto.GameVars.ticksCounter;
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
        GameConstants.BULLET_SPEED = .65;
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
    var Tower = (function () {
        function Tower(type, p, creationTick) {
            this.id = Tower.id;
            Tower.id++;
            this.type = type;
            this.f = 0;
            this.level = 1;
            this.position = p;
            this.x = this.position.c + .5;
            this.y = this.position.r + .5;
            this.damage = Anuto.GameVars.towerData.towers[type].damage;
            this.range = Anuto.GameVars.towerData.towers[type].range;
            this.reload = Anuto.GameVars.towerData.towers[type].reload;
            this.creationTick = creationTick;
            this.reloadTicks = Math.floor(Anuto.GameConstants.RELOAD_BASE_TICKS * this.reload);
            this.value = 0;
        }
        Tower.prototype.destroy = function () {
        };
        Tower.prototype.update = function () {
            this.f++;
            if (this.f === this.reloadTicks) {
                this.shoot();
                this.f = 0;
            }
        };
        Tower.prototype.upgrade = function () {
            this.level++;
        };
        Tower.prototype.shoot = function () {
            var enemyData = this.getEnemyWithinRange();
            if (enemyData.enemy) {
                this.enemyWithinRange = enemyData.enemy;
                var d = Anuto.MathUtils.fixNumber(Math.sqrt(enemyData.squareDist));
                var ticksToImpact = Math.floor(Anuto.MathUtils.fixNumber(d / Anuto.GameConstants.BULLET_SPEED));
                var impactPosition = this.enemyWithinRange.getNextPosition(ticksToImpact);
                var dx = impactPosition.x - this.x;
                var dy = impactPosition.y - this.y;
                var impactSquareDistance = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                if (this.range * this.range > impactSquareDistance) {
                    var angle = Anuto.MathUtils.fixNumber(Math.atan2(dy, dx));
                    var bullet = new Anuto.Bullet(this.position, angle);
                    Anuto.Engine.currentInstance.addBullet(bullet, this);
                }
                else {
                    this.enemyWithinRange = null;
                }
            }
            else {
                this.enemyWithinRange = null;
            }
        };
        Tower.prototype.getEnemyWithinRange = function () {
            var enemy = null;
            var squareDist = 1e10;
            for (var i = 0; i < Anuto.GameVars.enemies.length; i++) {
                var dx = this.x - Anuto.GameVars.enemies[i].x;
                var dy = this.y - Anuto.GameVars.enemies[i].y;
                squareDist = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                if (this.range * this.range > squareDist) {
                    enemy = Anuto.GameVars.enemies[i];
                    break;
                }
            }
            return { enemy: enemy, squareDist: squareDist };
        };
        return Tower;
    }());
    Anuto.Tower = Tower;
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
        Event.EVENT_ENEMY_SPAWNED = "enemy spawned";
        Event.EVENT_ENEMY_KILLED = "enemy killed";
        Event.EVENT_ENEMY_REACHED_EXIT = "enemy reached exit";
        Event.EVENT_BULLET_SHOT = "bullet shot";
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
    var MathUtils = (function () {
        function MathUtils() {
        }
        MathUtils.fixNumber = function (n) {
            return isNaN(n) ? 0 : Math.round(1e5 * n) / 1e5;
        };
        return MathUtils;
    }());
    Anuto.MathUtils = MathUtils;
})(Anuto || (Anuto = {}));
//# sourceMappingURL=anuto-core-engine.js.map