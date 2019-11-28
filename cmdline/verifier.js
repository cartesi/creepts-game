import * as Anuto from "../engine/src";

function errorMessage(type, info) {
    switch(type) {
        case Anuto.GameConstants.ERROR_VERSION_MISMATCH:
            return "Version mismatch. Engine Version: " + info.engineVersion + ". Logs Version: " + info.logsVersion + ".";
        case Anuto.GameConstants.ERROR_NO_GAME_OVER:
            return "All actions have been executed without reaching game over.";
        case Anuto.GameConstants.ERROR_TICKS:
            return "Ticks have to be greater or equal than the tick of the previous action.";
        case Anuto.GameConstants.ERROR_ACTION_ARRAY:
            return "Actions array is empty or null.";
        case Anuto.GameConstants.ERROR_ACTION_TYPE:
            return "Missing or wrong action type '" + info + "'.";
        case Anuto.GameConstants.ERROR_ACTION_VALUE:
            return "Missing or wrong value for action.";
        case Anuto.GameConstants.ERROR_TURRET:
            return "Turret '" + info.id + "' does not exist.";
        case Anuto.GameConstants.ERROR_CREDITS:
            return "Not enough credits.";
        case Anuto.GameConstants.ERROR_NEXT_WAVE:
            return "Wave launched before 40 ticks.";
        case Anuto.GameConstants.ERROR_ADD_TURRET_POSITION:
            return "Invalid position for adding turret.";
        case Anuto.GameConstants.ERROR_ADD_TURRET_NAME:
            return "Wrong turret type name '" + info.name + "'.";
        case Anuto.GameConstants.ERROR_UPGRADE:
            return "Can't upgrade the turret '" + info.id + "' with max grade.";
        case Anuto.GameConstants.ERROR_LEVEL_UP:
            return "Can't level up the turret '" + info.id + "' with max level.";
        default:
            return "Unexpected error";
    }
}

// LOGS TYPES
var TYPE_NEXT_WAVE = "next wave";
var TYPE_ADD_TURRET = "add turret";
var TYPE_SELL_TURRET = "sell turret";
var TYPE_UPGRADE_TURRET = "upgrade turret";
var TYPE_LEVEL_UP_TURRET = "level up turret";
var TYPE_CHANGE_STRATEGY_TURRET = "change strategy turret";
var TYPE_CHANGE_FIXED_TARGET_TURRET = "change fixed target turret";

export default function (level, logs) {

    level.gameConfig.runningInClientSide = false;

    var anutoEngine = new Anuto.Engine(level.gameConfig, level.enemiesData, level.turretsData, level.wavesData);

    if (level.engineVersion !== anutoEngine.version) {
        throw new Error(errorMessage(Anuto.GameConstants.ERROR_VERSION_MISMATCH, {logsVersion: level.engineVersion, engineVersion: anutoEngine.version}));
    }

    if (!logs.actions || logs.actions.length === 0) {
        throw new Error(errorMessage(Anuto.GameConstants.ERROR_ACTION_ARRAY));
    }

    for (var i = 0; i < logs.actions.length; i++) {

        var action = logs.actions[i];
        var result = {};

        if ( typeof action.tick !== "number" || action.tick < anutoEngine.ticksCounter) {
            throw new Error(errorMessage(Anuto.GameConstants.ERROR_TICKS));
        }

        while (anutoEngine.ticksCounter < action.tick && anutoEngine.lifes > 0) {
            anutoEngine.update();
        }

        switch (action.type) {
            case TYPE_NEXT_WAVE:
                if (!anutoEngine.newWave()) result.error = { type: Anuto.GameConstants.ERROR_NEXT_WAVE };
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
                result = { error: { type: Anuto.GameConstants.ERROR_ACTION_TYPE, info: action.type} };
                break;
        }

        if (result.error) throw new Error(errorMessage(result.error.type, result.error.info));
        if (anutoEngine.lifes <= 0) break;
    }

    while (anutoEngine.waveActivated && anutoEngine.lifes > 0) {
        anutoEngine.update();
    }

    if (anutoEngine.lifes > 0) {
        throw new Error(errorMessage(Anuto.GameConstants.ERROR_NO_GAME_OVER));
    }

    // print score and exit normally
    return anutoEngine._score;

}
