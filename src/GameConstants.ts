// javascript-obfuscator bundle.js --output bundle.js
// especificaciones
// https://docs.google.com/document/d/1Hd6C-gAsydmRAldb2iTRYEamLPxcfBlY51KNf9UOcQ4/edit#

export class GameConstants {

    public static readonly VERSION = "0.0";
    public static readonly DEVELOPMENT = true;
    public static readonly SHOW_DEBUG_GEOMETRY = true;
    public static readonly INTERPOLATE_TRAJECTORIES = true;
    public static readonly VERBOSE = false;

    public static readonly GAME_WIDTH = 768;
    public static readonly GAME_HEIGHT = 1024;

    // el tick del engine en milisegundos
    public static readonly TIME_STEP = 100;
    public static readonly BOARD_SIZE = {r: 15, c: 10};
    public static readonly INITIAL_CREDITS = 500;
    public static readonly CELLS_SIZE = 50;
    
    // los nombres de los enemigos
    public static readonly ENEMY_1 = "enemy_1";
    public static readonly ENEMY_2 = "enemy_2";
    
    // los caminos de los enemigos
    public static readonly ENEMY_PATH_1 = [
                                            {r: -1, c: 3},
                                            {r: 0, c: 3},
                                            {r: 1, c: 3},
                                            {r: 1, c: 4},
                                            {r: 1, c: 5},
                                            {r: 1, c: 6},
                                            {r: 2, c: 6},
                                            {r: 3, c: 6},
                                            {r: 3, c: 5},
                                            {r: 3, c: 4},
                                            {r: 4, c: 4},
                                            {r: 5, c: 4},
                                            {r: 6, c: 4},
                                            {r: 7, c: 4},
                                            {r: 8, c: 4},
                                            {r: 9, c: 4},
                                            {r: 10, c: 4},
                                            {r: 10, c: 3},
                                            {r: 10, c: 2},
                                            {r: 10, c: 1},
                                            {r: 11, c: 1},
                                            {r: 12, c: 1},
                                            {r: 12, c: 2},
                                            {r: 12, c: 3},
                                            {r: 12, c: 4},
                                            {r: 12, c: 5},
                                            {r: 12, c: 6},
                                            {r: 12, c: 7},
                                            {r: 12, c: 8},
                                            {r: 13, c: 8},
                                            {r: 14, c: 8},
                                            {r: 15, c: 8},
                                        ];

    public static readonly ENEMY_PATH_2 = [
                                            {r: -1, c: 6},
                                            {r: 0, c: 6},
                                            {r: 1, c: 6},
                                            {r: 2, c: 6},
                                            {r: 3, c: 6},
                                            {r: 3, c: 5},
                                            {r: 3, c: 4},
                                            {r: 4, c: 4},
                                            {r: 5, c: 4},
                                            {r: 5, c: 5},
                                            {r: 5, c: 6},
                                            {r: 5, c: 7},
                                            {r: 5, c: 8},
                                            {r: 6, c: 8},
                                            {r: 7, c: 8},
                                            {r: 8, c: 8},
                                            {r: 9, c: 8},
                                            {r: 10, c: 8},
                                            {r: 11, c: 8},
                                            {r: 11, c: 7},
                                            {r: 11, c: 6},
                                            {r: 11, c: 5},
                                            {r: 11, c: 4},
                                            {r: 12, c: 4},
                                            {r: 13, c: 4},
                                            {r: 14, c: 4},
                                            {r: 15, c: 4},
                                        ];



    public static readonly SAVED_GAME_DATA_KEY = "anuto-data";
}
