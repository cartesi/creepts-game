import * as Creepts from "../engine/src";

function errorMessage(type, info) {
    switch(type) {
        case Creepts.GameConstants.ERROR_VERSION_MISMATCH:
            return "Version mismatch. Engine Version: " + info.engineVersion + ". Logs Version: " + info.logsVersion + ".";
        case Creepts.GameConstants.ERROR_NO_GAME_OVER:
            return "All actions have been executed without reaching game over.";
        case Creepts.GameConstants.ERROR_TICKS:
            return "Ticks have to be greater or equal than the tick of the previous action.";
        case Creepts.GameConstants.ERROR_ACTION_ARRAY:
            return "Actions array is empty or null.";
        case Creepts.GameConstants.ERROR_ACTION_TYPE:
            return "Missing or wrong action type '" + info + "'.";
        case Creepts.GameConstants.ERROR_ACTION_VALUE:
            return "Missing or wrong value for action.";
        case Creepts.GameConstants.ERROR_TURRET:
            return "Turret '" + info.id + "' does not exist.";
        case Creepts.GameConstants.ERROR_CREDITS:
            return "Not enough credits.";
        case Creepts.GameConstants.ERROR_NEXT_WAVE:
            return "Wave launched before 40 ticks.";
        case Creepts.GameConstants.ERROR_ADD_TURRET_POSITION:
            return "Invalid position for adding turret.";
        case Creepts.GameConstants.ERROR_ADD_TURRET_NAME:
            return "Wrong turret type name '" + info.name + "'.";
        case Creepts.GameConstants.ERROR_UPGRADE:
            return "Can't upgrade the turret '" + info.id + "' with max grade.";
        case Creepts.GameConstants.ERROR_LEVEL_UP:
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

export default function (level, logs, progressCallback) {

    level.gameConfig.runningInClientSide = false;

    var engine = new Creepts.Engine(level.gameConfig, level.enemiesData, level.turretsData, level.wavesData);

    if (level.engineVersion !== engine.version) {
        throw new Error(errorMessage(Creepts.GameConstants.ERROR_VERSION_MISMATCH, {logsVersion: level.engineVersion, engineVersion: engine.version}));
    }

    if (!logs.actions || logs.actions.length === 0) {
        throw new Error(errorMessage(Creepts.GameConstants.ERROR_ACTION_ARRAY));
    }

    // return progress information every progressIncrement ticks
    const progressIncrement = 100;

    // tick of last user action (may not be last tick of simulation)
    const lastActionTick = logs.actions[logs.actions.length - 1].tick;
    
    for (var i = 0; i < logs.actions.length; i++) {

        var action = logs.actions[i];
        var result = {};

        if ( typeof action.tick !== "number" || action.tick < engine.ticksCounter) {
            throw new Error(errorMessage(Creepts.GameConstants.ERROR_TICKS));
        }

        while (engine.ticksCounter < action.tick && engine.lifes > 0) {
            engine.update();

            if (typeof(progressCallback) === 'function' && (engine.ticksCounter % progressIncrement == 0)) {
                progressCallback({
                    timestamp: new Date(),
                    ticksCounter: engine.ticksCounter,
                    lastActionTick: lastActionTick,
                    score: engine.score,
                    lifes: engine.lifes,
                    round: engine.round,
                    credits: engine.credits
                });
            }
        }

        switch (action.type) {
            case TYPE_NEXT_WAVE:
                if (!engine.newWave()) result.error = { type: Creepts.GameConstants.ERROR_NEXT_WAVE };
                break;
            case TYPE_ADD_TURRET:
                result = engine.addTurret(action.turretType, action.position);
                break;
            case TYPE_SELL_TURRET:
                result = engine.sellTurret(action.id);
                break;
            case TYPE_UPGRADE_TURRET:
                result = engine.upgradeTurret(action.id);
                break;
            case TYPE_LEVEL_UP_TURRET:
                result = engine.improveTurret(action.id);
                break;
            case TYPE_CHANGE_STRATEGY_TURRET:
                result = engine.setNextStrategy(action.id);
                break;
            case TYPE_CHANGE_FIXED_TARGET_TURRET:
                result = engine.setFixedTarget(action.id);
                break;
            default:
                result = { error: { type: Creepts.GameConstants.ERROR_ACTION_TYPE, info: action.type} };
                break;
        }

        if (result.error) throw new Error(errorMessage(result.error.type, result.error.info));
        if (engine.lifes <= 0) break;
    }

    while (engine.waveActivated && engine.lifes > 0) {
        // all actions are processed, run until we die
        engine.update();
    }

    if (engine.lifes > 0) {
        throw new Error(errorMessage(Creepts.GameConstants.ERROR_NO_GAME_OVER));
    }

    // print score and exit normally
    return engine.score;

}
