// javascript-obfuscator bundle.js --output bundle.js
// especificaciones
// https://docs.google.com/document/d/1Hd6C-gAsydmRAldb2iTRYEamLPxcfBlY51KNf9UOcQ4/edit#

export class GameConstants {

    public static readonly VERSION = "0.0";
    public static readonly DEVELOPMENT = true;
    public static readonly SHOW_DEBUG_GEOMETRY = false;
    public static readonly INTERPOLATE_TRAJECTORIES = true;
    public static readonly VERBOSE = false;
    public static readonly GAME_WIDTH = 768;
    public static readonly GAME_HEIGHT = 1024;

    // el tick del engine en milisegundos
    public static readonly TIME_STEP = 100;
    public static readonly ENEMY_SPAWNING_DELTA_TICKS = 10;
    public static readonly INITIAL_CREDITS = 5000000;
    public static readonly INITIAL_LIFES = 20;
    public static readonly CELLS_SIZE = 60;

    // LOGS TYPES
    public static readonly TYPE_ADD_TURRET = "add turret";
    public static readonly TYPE_SELL_TURRET = "sell turret";
    public static readonly TYPE_UPGRADE_TURRET = "upgrade turret";
    public static readonly TYPE_LEVEL_UP_TURRET = "level up turret";
    public static readonly TYPE_CHANGE_STRATEGY_TURRET = "change strategy turret";
    public static readonly TYPE_CHANGE_FIXED_TARGET_TURRET = "change fixed target turret";

    public static readonly TYPE_NEXT_WAVE = "next wave";

    public static readonly SAVED_GAME_DATA_KEY = "anuto-data";
}
