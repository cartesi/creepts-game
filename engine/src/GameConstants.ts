module Anuto {
    
    export class GameConstants {

        public static readonly RELOAD_BASE_TICKS = 10;
        public static readonly BULLET_SPEED = .5; // in cells / tick

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

        // caracteristicas de los enemigos
        public static readonly HEALER_HEALING_TICKS = 100;
        public static readonly HEALER_STOP_TICKS = 30;
        public static readonly HEALER_HEALING_RADIUS = 2;
    }
}
