var Anuto = require("anuto-core-engine");

// ERROR TYPES

var ERROR_VERSION_MISMATCH = "Engine version mismatch.";

var ERROR_NO_GAME_OVER = "All actions have been read without reaching game over.";

var ERROR_TICKS = "Ticks have to be greater than or equal than tick of the previous action.";

var ERROR_ACTION_ARRAY = "Actions array is empty or null.";
var ERROR_ACTION_TYPE = "Missing or wrong action type.";
var ERROR_ACTION_VALUE = "Missing or wrong action value.";

var ERROR_TURRET = "Turret not exist.";
var ERROR_CREDITS = "Not enough credits.";

var ERROR_NEXT_WAVE = "Have to wait 40 ticks between launch waves.";

var ERROR_ADD_TURRET_POSITION = "Invalid position for add turret.";
var ERROR_ADD_TURRET_NAME = "Wrong turret type name.";

var ERROR_UPGRADE = "Can’t upgrade turret with max grade.";

var ERROR_LEVEL_UP = "Can’t level up turret with max level.";

// LOGS TYPES
var TYPE_NEXT_WAVE = "next wave";
var TYPE_ADD_TURRET = "add turret";
var TYPE_SELL_TURRET = "sell turret";
var TYPE_UPGRADE_TURRET = "upgrade turret";
var TYPE_LEVEL_UP_TURRET = "level up turret";
var TYPE_CHANGE_STRATEGY_TURRET = "change strategy turret";
var TYPE_CHANGE_FIXED_TARGET_TURRET = "change fixed target turret";

var file1 = readFile(scriptArgs[1]);
var file2 = readFile(scriptArgs[2]);

var logs = JSON.parse(file1.replace(/\r?\n/g, ""));
var level = JSON.parse(file2.replace(/\r?\n/g, ""));

level.gameConfig.runningInClientSide = false;

var anutoEngine = new Anuto.Engine(level.gameConfig, level.enemiesData, level.turretsData, level.wavesData);

if (level.engineVersion !== anutoEngine.version) {
    manageError(ERROR_VERSION_MISMATCH);
    anutoEngine.gameOver = true;
}

if (!logs.actions || logs.actions.length === 0) {
    manageError(ERROR_ACTION_ARRAY)
    anutoEngine.gameOver = true;
}

while(!anutoEngine.gameOver) {

    if (!logs.actions[0] && !anutoEngine.waveActivated) {
        manageError(ERROR_NO_GAME_OVER);
    }

    if (logs.actions[0]) {
        if ( typeof logs.actions[0].tick !== "number" || logs.actions[0].tick < anutoEngine.ticksCounter) {
            manageError(ERROR_TICKS);
        }
    }

    while (logs.actions.length && logs.actions[0].tick === anutoEngine.ticksCounter) {

        var action = logs.actions.shift();

        switch(action.type) {
            case TYPE_NEXT_WAVE:

                if (!anutoEngine.newWave()) {
                    manageError(ERROR_NEXT_WAVE);
                }
                break;
            case TYPE_ADD_TURRET:

                var data = anutoEngine.addTurret(action.turretType, action.position);
                if (data.error) {
                    manageError(data.error);
                }
                break;
            case TYPE_SELL_TURRET:

                var data = anutoEngine.sellTurret(action.id);
                if (data.error) {
                    manageError(data.error);
                }
                break;
            case TYPE_UPGRADE_TURRET:

                var data = anutoEngine.upgradeTurret(action.id);
                if (data.error) {
                    manageError(data.error);
                }
                break;
            case TYPE_LEVEL_UP_TURRET:

                var data = anutoEngine.improveTurret(action.id);
                if (data.error) {
                    manageError(data.error);
                }
                break;
            case TYPE_CHANGE_STRATEGY_TURRET:

                var data = anutoEngine.setNextStrategy(action.id);
                if (data.error) {
                    manageError(data.error);
                }
                break;
            case TYPE_CHANGE_FIXED_TARGET_TURRET:

                var data = anutoEngine.setFixedTarget(action.id);
                if (data.error) {
                    manageError(data.error);
                }
                break;
            default:
                manageError(ERROR_ACTION_TYPE);
                break;
        }

        if (!anutoEngine.lifes) {
            break;
        }
    }

    var prevTick = anutoEngine.ticksCounter;

    anutoEngine.update();

    if (anutoEngine.ticksCounter === prevTick) {
        anutoEngine.ticksCounter++;
    }
}

function manageError(msg) {

    console.error(msg);
    anutoEngine.score = 0;
    anutoEngine.lifes = 0;
}