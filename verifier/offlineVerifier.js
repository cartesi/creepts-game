var Anuto = require("anuto-core-engine");

// ERROR TYPES

var ERROR_VERSION_MISMATCH = "E001";
var ERROR_NO_GAME_OVER = "E002";
var ERROR_TICKS = "E003";
var ERROR_ACTION_ARRAY = "E004";
var ERROR_ACTION_TYPE = "E005";
var ERROR_ACTION_VALUE = "E006";
var ERROR_TURRET = "E007";
var ERROR_CREDITS = "E008";
var ERROR_NEXT_WAVE = "E009";
var ERROR_ADD_TURRET_POSITION = "E010";
var ERROR_ADD_TURRET_NAME = "E011";
var ERROR_UPGRADE = "E012";
var ERROR_LEVEL_UP = "E013";

function exitWithError(type, info) {

    var msg = "Unexpected error";

    switch(type) {
        case ERROR_VERSION_MISMATCH:
            msg = "Version mismatch. Engine Version: " + info.engineVersion + ". Logs Version: " + info.logsVersion + ".";
            break;
        case ERROR_NO_GAME_OVER:
            msg = "All actions have been executed without reaching game over.";
            break;
        case ERROR_TICKS:
            msg = "Ticks have to be greater or equal than the tick of the previous action.";
            break;
        case ERROR_ACTION_ARRAY:
            msg = "Actions array is empty or null.";
            break;
        case ERROR_ACTION_TYPE:
            msg = "Missing or wrong action type '" + info + "'.";
            break;
        case ERROR_ACTION_VALUE:
            msg = "Missing or wrong value for action.";
            break;
        case ERROR_TURRET:
            msg = "Turret '" + info.id + "' does not exist.";
            break;
        case ERROR_CREDITS:
            msg = "Not enough credits.";
            break;
        case ERROR_NEXT_WAVE:
            msg = "Wave launched before 40 ticks.";
            break;
        case ERROR_ADD_TURRET_POSITION:
            msg = "Invalid position for adding turret.";
            break;
        case ERROR_ADD_TURRET_NAME:
            msg = "Wrong turret type name '" + info.name + "'.";
            break;
        case ERROR_UPGRADE:
            msg = "Can't upgrade the turret '" + info.id + "' with max grade.";
            break;
        case ERROR_LEVEL_UP:
            msg = "Can't level up the turret '" + info.id + "' with max level.";
            break;
        default:
            break;
    }
    // Output 0 score with error message
    print(0 + "\t" + msg);
    // Exit program with failure
    throw Error(msg);
}

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
    exitWithError(ERROR_VERSION_MISMATCH, {logsVersion: level.engineVersion, engineVersion: anutoEngine.version});
}

if (!logs.actions || logs.actions.length === 0) {
    exitWithError(ERROR_ACTION_ARRAY)
}

var i = 0;

while (!anutoEngine.gameOver) {

    if (!logs.actions[i] && !anutoEngine.waveActivated) {
        exitWithError(ERROR_NO_GAME_OVER);
    }

    if (logs.actions[i]) {
        if ( typeof logs.actions[i].tick !== "number" || logs.actions[i].tick < anutoEngine.ticksCounter) {
            exitWithError(ERROR_TICKS);
        }
    }

    while (i < logs.actions.length && logs.actions[i].tick === anutoEngine.ticksCounter) {

        var action = logs.actions[i];
        var result = { }

        switch (action.type) {
            case TYPE_NEXT_WAVE:
                if (!anutoEngine.newWave()) {
                    result.error = { type: ERROR_NEXT_WAVE };
                }
                break;
            case TYPE_ADD_TURRET:
                result = anutoEngine.addTurret(action.turretType, action.position);
                break;
            case TYPE_SELL_TURRET:
                result = anutoEngine.sellTurret(action.id);
                break;
            case TYPE_UPGRADE_TURRET:
                result = anutoEngine.upgradeTurret(action.id);
                break;
            case TYPE_LEVEL_UP_TURRET:
                result = anutoEngine.improveTurret(action.id);
                break;
            case TYPE_CHANGE_STRATEGY_TURRET:
                result = anutoEngine.setNextStrategy(action.id);
                break;
            case TYPE_CHANGE_FIXED_TARGET_TURRET:
                result = anutoEngine.setFixedTarget(action.id);
                break;
            default:
                result = { error: { type: ERROR_ACTION_TYPE, info: action.type} };
                break;
        }

        if (result.error) {
            exitWithError(result.error.type, result.error.info)
        }

        if (anutoEngine.lifes <= 0) {
            break;
        }

        i = i + 1;
    }

    var prevTick = anutoEngine.ticksCounter;

    anutoEngine.update();

    if (anutoEngine.ticksCounter === prevTick) {
        anutoEngine.ticksCounter++;
    }

    if (anutoEngine.ticksCounter % 100 == 0) {
        console.log(anutoEngine.ticksCounter);
    }
}

// print score and exit normally
print(anutoEngine._score + "\t")
