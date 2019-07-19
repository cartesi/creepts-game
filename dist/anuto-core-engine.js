var Anuto;
(function (Anuto) {
    var Bullet = (function () {
        function Bullet(p, angle, speed) {
            this.x = p.c;
            this.y = p.r;
            this.dx = speed * Math.cos(angle);
            this.dy = speed * Math.sin(angle);
        }
        Bullet.prototype.update = function () {
            this.x += this.dx;
            this.y += this.dy;
        };
        Bullet.prototype.getPositionNextTick = function () {
            return { x: this.x + this.dx, y: this.y + this.dy };
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
        Enemy.id = 0;
        return Enemy;
    }());
    Anuto.Enemy = Enemy;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Engine = (function () {
        function Engine(gameConfig, enemyData, towerData) {
            Engine.currentInstance = this;
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
            Anuto.Enemy.id = 0;
            Anuto.Tower.id = 0;
            this.towers = [];
        }
        Engine.prototype.update = function () {
            var t = Date.now();
            if (t - this.t < Anuto.GameVars.timeStep || !this.waveActivated) {
                return;
            }
            this.t = t;
            this.enemies.forEach(function (enemy) {
                enemy.update();
            });
            this.towers.forEach(function (tower) {
                tower.update();
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
            this.towers = [];
            for (var i = 0; i < waveConfig.towers.length; i++) {
            }
            this.waveActivated = true;
            this.t = Date.now();
            this.enemies = [];
            this.bullets = [];
        };
        Engine.prototype.removeEnemy = function (enemy) {
            var i = this.enemies.indexOf(enemy);
            if (i !== -1) {
                this.enemies.splice(i, 1);
            }
            enemy.destroy();
        };
        Engine.prototype.addTower = function (type, p) {
            var towerConfig = {
                id: type,
                level: 0,
                position: p
            };
            var tower = new Anuto.Tower(towerConfig, Anuto.GameVars.ticksCounter);
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
        Engine.prototype.addBullet = function (bullet) {
            this.bullets.push(bullet);
        };
        Engine.prototype.onEnemyReachedExit = function (enemy) {
            var i = this.enemies.indexOf(enemy);
            this.enemies.splice(i, 1);
            enemy.destroy();
            this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.EVENT_ENEMY_REACHED_EXIT, [enemy]));
        };
        Engine.prototype.onEnemyKilled = function (enemy) {
            var i = this.enemies.indexOf(enemy);
            this.enemies.splice(i, 1);
            enemy.destroy();
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
                this.enemies.push(enemy);
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
        function Tower(config, creationTick) {
            this.id = Tower.id;
            Tower.id++;
            this.type = config.id;
            this.level = config.level;
            this.position = config.position;
            this.creationTick = creationTick;
            this.value = 0;
        }
        Tower.prototype.destroy = function () {
        };
        Tower.prototype.update = function () {
        };
        Tower.prototype.upgrade = function () {
            this.level++;
        };
        Tower.id = 0;
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
//# sourceMappingURL=anuto-core-engine.js.map