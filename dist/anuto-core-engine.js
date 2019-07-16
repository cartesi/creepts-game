var Anuto;
(function (Anuto) {
    var CoreEngine = (function () {
        function CoreEngine() {
        }
        CoreEngine.init = function () {
            CoreEngine.ticksCounter = 0;
            CoreEngine.towers = [];
        };
        CoreEngine.update = function () {
            CoreEngine.ticksCounter++;
            CoreEngine.enemies.forEach(function (enemy) {
                enemy.update();
            });
            CoreEngine.towers.forEach(function (tower) {
                tower.update();
            });
        };
        CoreEngine.prototype.newWave = function () {
            Anuto.GameVars.waveActivated = true;
            CoreEngine.enemies = [];
        };
        CoreEngine.prototype.addEnemy = function (enemy) {
            CoreEngine.enemies.push(enemy);
        };
        CoreEngine.prototype.addTower = function (tower, p) {
            CoreEngine.towers.push(tower);
        };
        return CoreEngine;
    }());
    Anuto.CoreEngine = CoreEngine;
})(Anuto || (Anuto = {}));
var Anuto;
(function (Anuto) {
    var Enemy = (function () {
        function Enemy() {
        }
        Enemy.prototype.destroy = function () {
        };
        Enemy.prototype.update = function () {
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
    var GameConstants = (function () {
        function GameConstants() {
        }
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
        function Tower() {
        }
        Tower.prototype.update = function () {
        };
        Tower.prototype.upgrade = function () {
            this.level++;
        };
        return Tower;
    }());
    Anuto.Tower = Tower;
})(Anuto || (Anuto = {}));
//# sourceMappingURL=anuto-core-engine.js.map