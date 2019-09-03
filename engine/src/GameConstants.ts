module Anuto {
    
    export class GameConstants {

        public static readonly RELOAD_BASE_TICKS = 10;
        public static readonly BULLET_SPEED = .5; // in cells / tick
        public static readonly MORTAR_SPEED = .1;

        // los nombres de los enemigos
        public static readonly ENEMY_SOLDIER = "soldier";
        public static readonly ENEMY_RUNNER = "runner";
        public static readonly ENEMY_HEALER = "healer";
        public static readonly ENEMY_BLOB = "blob";
        public static readonly ENEMY_FLIER = "flier";

        // los nombres de las torretas
        public static readonly TURRET_PROJECTILE = "projectile";
        public static readonly TURRET_LASER = "laser";
        public static readonly TURRET_LAUNCH = "launch";
        public static readonly TURRET_GLUE = "glue";

        // estrategia de disparo
        public static readonly STRATEGY_SHOOT_FIRST = "first";
        public static readonly STRATEGY_SHOOT_LAST = "last";
        public static readonly STRATEGY_SHOOT_CLOSEST = "closest";
        public static readonly STRATEGY_SHOOT_WEAKEST = "weakest";
        public static readonly STRATEGY_SHOOT_STRONGEST = "strongest";

        public static readonly STRATEGIES_ARRAY = [  
                                                    GameConstants.STRATEGY_SHOOT_FIRST, 
                                                    GameConstants.STRATEGY_SHOOT_LAST, 
                                                    GameConstants.STRATEGY_SHOOT_CLOSEST, 
                                                    GameConstants.STRATEGY_SHOOT_WEAKEST, 
                                                    GameConstants.STRATEGY_SHOOT_STRONGEST
                                                ];

        // caracteristicas de los enemigos
        public static readonly HEALER_HEALING_TICKS = 100;
        public static readonly HEALER_STOP_TICKS = 30;
        public static readonly HEALER_HEALING_RADIUS = 2;
    }
}
