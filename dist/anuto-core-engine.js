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
    var Enemy = (function () {
        function Enemy(id, creationTick) {
            this.id = id;
            this.life = 100;
            this.speed = .1;
            this.creationTick = creationTick;
            this.x = 0;
            this.y = 0;
        }
        Enemy.prototype.destroy = function () {
        };
        Enemy.prototype.update = function () {
            this.y += this.speed;
        };
        Enemy.prototype.hit = function (damage) {
            this.life -= damage;
            if (this.life <= 0) {
                this.destroy();
            }
        };
        return Enemy;
    }());
    Anuto.Enemy = Enemy;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Engine = (function () {
        function Engine(gameConfig, enemyData, towerData) {
            Anuto.GameVars.credits = 500;
            this.waveActivated = false;
            this.t = 0;
            this.totalEnemies = 0;
            this.eventDispatcher = new Anuto.EventDispatcher();
            Anuto.GameVars.timeStep = gameConfig.timeStep;
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
            this.ticksCounter++;
        };
        Engine.prototype.newWave = function (config) {
            Anuto.GameVars.level = config.level;
            this.towers = [];
            for (var i = 0; i < config.towers.length; i++) {
            }
            this.waveActivated = true;
            this.ticksCounter = 0;
            this.t = Date.now();
            this.totalEnemies = config.totalEnemies;
            Anuto.GameVars.enemiesCounter = 0;
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
            var tower = new Anuto.Tower(towerConfig, this.ticksCounter);
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
        Engine.prototype.addEventListener = function (type, listenerFunction, scope) {
            this.eventDispatcher.addEventListener(type, listenerFunction, scope);
        };
        Engine.prototype.removeEventListener = function (type, listenerFunction) {
            this.eventDispatcher.removeEventListener(type, listenerFunction);
        };
        Engine.prototype.removeEnentListener = function (event) {
        };
        Engine.prototype.checkCollisions = function () {
        };
        Engine.prototype.spawnEnemies = function () {
            if (this.ticksCounter % 25 === 0 && Anuto.GameVars.enemiesCounter < this.totalEnemies) {
                var enemy = new Anuto.Enemy(1, this.ticksCounter);
                this.enemies.push(enemy);
                Anuto.GameVars.enemiesCounter++;
                this.eventDispatcher.dispatchEvent(new Anuto.Event(Anuto.Event.EVENT_ENEMY_SPAWNED, [enemy, { r: 0, c: 0 }]));
            }
        };
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
    var Constants;
    (function (Constants) {
        Constants.INITIAL_CREDITS = 500;
        Constants.TOWER_1 = "tower_1";
        Constants.TOWER_2 = "tower_2";
        Constants.TOWER_3 = "tower_3";
        Constants.TOWER_4 = "tower_4";
    })(Constants = Anuto.Constants || (Anuto.Constants = {}));
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
            this.type = config.id;
            this.level = config.level;
            this.position = config.position;
            this.value = 0;
        }
        Tower.prototype.destroy = function () {
        };
        Tower.prototype.update = function () {
        };
        Tower.prototype.upgrade = function () {
            this.level++;
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