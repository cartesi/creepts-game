var Anuto = require("anuto-core-engine");

// ERROR TYPES

var ERROR_VERSION_MISMATCH = "Error version mismatch";

var ERROR_NO_GAME_OVER = "Error no game over";

var ERROR_TICKS = "Error ticks";

var ERROR_ACTION_ARRAY = "Error action array";
var ERROR_ACTION_TYPE = "Error action type";
var ERROR_ACTION_VALUE = "Error action value";

var ERROR_TURRET = "Error turret";
var ERROR_CREDITS = "Error credits";

var ERROR_NEXT_WAVE = "Error next wave";

var ERROR_ADD_TURRET_POSITION = "Error add turret position";
var ERROR_ADD_TURRET_NAME = "Error add turret name";

var ERROR_UPGRADE = "Error upgrade";

var ERROR_LEVEL_UP = "Error level up";

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
    manageError(ERROR_VERSION_MISMATCH, {logsVersion: level.engineVersion, engineVersion: anutoEngine.version});
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
                    manageError(data.error.type, data.error.info);
                }
                break;
            case TYPE_SELL_TURRET:

                var data = anutoEngine.sellTurret(action.id);
                if (data.error) {
                    manageError(data.error.type, data.error.info);
                }
                break;
            case TYPE_UPGRADE_TURRET:

                var data = anutoEngine.upgradeTurret(action.id);
                if (data.error) {
                    manageError(data.error.type, data.error.info);
                }
                break;
            case TYPE_LEVEL_UP_TURRET:

                var data = anutoEngine.improveTurret(action.id);
                if (data.error) {
                    manageError(data.error.type, data.error.info);
                }
                break;
            case TYPE_CHANGE_STRATEGY_TURRET:

                var data = anutoEngine.setNextStrategy(action.id);
                if (data.error) {
                    manageError(data.error.type, data.error.info);
                }
                break;
            case TYPE_CHANGE_FIXED_TARGET_TURRET:

                var data = anutoEngine.setFixedTarget(action.id);
                if (data.error) {
                    manageError(data.error.type, data.error.info);
                }
                break;
            default:
                manageError(ERROR_ACTION_TYPE, {name: action.type});
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

function manageError(type, info) {

    var msg = ""; 

    switch(type) {
        case ERROR_VERSION_MISMATCH:
            msg = "Version mismatch. Engine Version: " + info.engineVersion + ". Logs Version: " + info.logsVersion + ".";
            break;
        case ERROR_NO_GAME_OVER:
            msg = "All actions have been read without reaching game over.";
            break;
        case ERROR_TICKS:
            msg = "Ticks have to be greater than or equal than tick of the previous action.";
            break;
        case ERROR_ACTION_ARRAY:
            msg = "Actions array is empty or null.";
            break;
        case ERROR_ACTION_TYPE:
            msg = "Missing or wrong action type '" + info.name + "'.";
            break;
        case ERROR_ACTION_VALUE:
            msg = "Missing or wrong action value.";    
            break;
        case ERROR_TURRET:
            msg = "Turret '" + info.id + "' not exist.";
            break;
        case ERROR_CREDITS:
            msg = "Not enough credits.";    
            break;
        case ERROR_NEXT_WAVE:
            msg = "Have to wait 40 ticks between launch waves.";    
            break;
        case ERROR_ADD_TURRET_POSITION:
            msg = "Invalid position for add turret.";    
            break;
        case ERROR_ADD_TURRET_NAME:
            msg = "Wrong turret type name '" + info.name + "'.";    
            break;
        case ERROR_UPGRADE:
            msg = "Can’t upgrade turret '" + info.id + "' with max grade.";
            break;
        case ERROR_LEVEL_UP:
            msg = "Can’t level up turret '" + info.id + "' with max level.";    
            break;
        default:
            break;
    }

    console.error(msg);
    anutoEngine.score = 0;
    anutoEngine.lifes = 0;
}