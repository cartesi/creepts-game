// javascript-obfuscator bundle.js --output bundle.js
// especificaciones
// https://docs.google.com/document/d/1Hd6C-gAsydmRAldb2iTRYEamLPxcfBlY51KNf9UOcQ4/edit#

export class GameConstants {

    public static readonly VERSION = "0.0";
    public static readonly DEVELOPMENT = false;
    public static readonly DEBUG_MODE = false;
    public static readonly VERBOSE = false;

    public static readonly GAME_WIDTH = 768;
    public static readonly GAME_HEIGHT = 1024;

    public static readonly TIME_STEP = 100;
    public static readonly BOARD_SIZE = {r: 10, c: 10};
    public static readonly INITIAL_CREDITS = 500;
    public static readonly CELLS_SIZE = 50;

    public static readonly SAVED_GAME_DATA_KEY = "anuto-data";
}
