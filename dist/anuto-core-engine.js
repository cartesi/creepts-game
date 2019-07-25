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
            this.value = Anuto.GameVars.enemyData.enemies[this.type].value;
            this.speed = Anuto.GameVars.enemyData.enemies[this.type].speed;
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
            Anuto.GameVars.credits = gameConfig.credits;
            Anuto.GameVars.timeStep = gameConfig.timeStep;
            Anuto.GameVars.runningInClientSide = gameConfig.runningInClientSide;
            Anuto.GameVars.paused = false;
            Anuto.GameVars.enemiesPathCells = gameConfig.enemiesPathCells;
            Anuto.GameVars.enemyData = enemyData;
            Anuto.GameVars.turretData = turretData;
            this.waveActivated = false;
            this.t = 0;
            Anuto.GameVars.waveTotalEnemies = 0;
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
            Anuto.GameVars.waveTotalEnemies = waveConfig.totalEnemies;
            Anuto.GameVars.enemiesCounter = 0;
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
            var turret = new Anuto.Turret(type, p, Anuto.GameVars.ticksCounter);
            this.turrets.push(turret);
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
                Anuto.GameVars.enemiesCounter++;
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
    var Turret = (function () {
        function Turret(type, p, creationTick) {
            this.id = Turret.id;
            Turret.id++;
            this.type = type;
            this.f = 0;
            this.level = 1;
            this.gunLoaded = false;
            this.position = p;
            this.x = this.position.c + .5;
            this.y = this.position.r + .5;
            this.damage = Anuto.GameVars.turretData.turrets[type].damage;
            this.range = Anuto.GameVars.turretData.turrets[type].range;
            this.reload = Anuto.GameVars.turretData.turrets[type].reload;
            this.creationTick = creationTick;
            this.reloadTicks = Math.floor(Anuto.GameConstants.RELOAD_BASE_TICKS * this.reload);
            this.value = 0;
        }
        Turret.prototype.destroy = function () {
        };
        Turret.prototype.update = function () {
            if (this.gunLoaded) {
                var hasTurretShot = this.shoot();
                if (hasTurretShot) {
                    this.gunLoaded = false;
                }
            }
            else {
                this.f++;
                if (this.f === this.reloadTicks) {
                    this.gunLoaded = true;
                    this.f = 0;
                }
            }
        };
        Turret.prototype.upgrade = function () {
            this.level++;
        };
        Turret.prototype.shoot = function () {
            var ret = false;
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
                    var bullet = new Anuto.Bullet(this.position, angle, enemyData.enemy, this.damage);
                    Anuto.Engine.currentInstance.addBullet(bullet, this);
                    ret = true;
                }
                else {
                    this.enemyWithinRange = null;
                }
            }
            else {
                this.enemyWithinRange = null;
            }
            return ret;
        };
        Turret.prototype.getEnemyWithinRange = function () {
            var enemy = null;
            var squareDist = 1e10;
            for (var i = 0; i < Anuto.GameVars.enemies.length; i++) {
                var dx = this.x - Anuto.GameVars.enemies[i].x;
                var dy = this.y - Anuto.GameVars.enemies[i].y;
                squareDist = Anuto.MathUtils.fixNumber(dx * dx + dy * dy);
                if (this.range * this.range >= squareDist) {
                    enemy = Anuto.GameVars.enemies[i];
                    break;
                }
            }
            return { enemy: enemy, squareDist: squareDist };
        };
        return Turret;
    }());
    Anuto.Turret = Turret;
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