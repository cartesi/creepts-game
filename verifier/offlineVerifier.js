var Anuto = require("anuto-core-engine");

// LOGS TYPES
var TYPE_NEXT_WAVE = "type next wave";
var TYPE_ADD_TURRET = "type add turret";
var TYPE_SELL_TURRET = "type sell turret";
var TYPE_UPGRADE_TURRET = "type upgrade turret";
var TYPE_LEVEL_UP_TURRET = "type level up turret";
var TYPE_CHANGE_STRATEGY_TURRET = "type change strategy turret";
var TYPE_CHANGE_FIXED_TARGET_TURRET = "type change fixed target turret";

var file1 = readFile(scriptArgs[1]);
var file2 = readFile(scriptArgs[2]);

var logs = JSON.parse(file1.replace(/\r?\n/g, ""));
var level = JSON.parse(file2.replace(/\r?\n/g, ""));

level.gameConfig.runningInClientSide = false;

var anutoEngine = new Anuto.Engine(level.gameConfig, level.enemiesData, level.turretsData, level.wavesData);

while(!anutoEngine.gameOver) {

    while (logs.actions.length && logs.actions[0].tick === anutoEngine.ticksCounter) {

        var action = logs.actions.shift();

        switch(action.type) {
            case TYPE_NEXT_WAVE:
                anutoEngine.newWave();
                break;
            case TYPE_ADD_TURRET:
                anutoEngine.addTurret(action.typeTurret, action.position);
                break;
            case TYPE_SELL_TURRET:
                anutoEngine.sellTurret(action.id);
                break;
            case TYPE_UPGRADE_TURRET:
                anutoEngine.upgradeTurret(action.id);
                break;
            case TYPE_LEVEL_UP_TURRET:
                anutoEngine.improveTurret(action.id);
                break;
            case TYPE_CHANGE_STRATEGY_TURRET:
                anutoEngine.setNextStrategy(action.id);
                break;
            case TYPE_CHANGE_FIXED_TARGET_TURRET:
                anutoEngine.setFixedTarget(action.id);
                break;
            default:
                break;
        }
    }

    anutoEngine.update();
}