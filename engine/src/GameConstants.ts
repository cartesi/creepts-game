// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


    
    export class GameConstants {

        // version: v0.month.day.hour
        public static readonly VERSION = "v0.9.30.11";

        public static readonly RELOAD_BASE_TICKS = 10;
        public static readonly BULLET_SPEED = .85; // in cells / tick
        public static readonly MORTAR_SPEED = .45;
        public static readonly INITIAL_TICKS_WAVE = 4;

        public static readonly ENEMY_SOLDIER = "soldier";
        public static readonly ENEMY_RUNNER = "runner";
        public static readonly ENEMY_HEALER = "healer";
        public static readonly ENEMY_BLOB = "blob";
        public static readonly ENEMY_FLIER = "flier";

        public static readonly TURRET_PROJECTILE = "projectile";
        public static readonly TURRET_LASER = "laser";
        public static readonly TURRET_LAUNCH = "launch";
        public static readonly TURRET_GLUE = "glue";

        public static readonly ATTRIBUTE_DAMAGE = "damage";
        public static readonly ATTRIBUTE_RELOAD = "reload";
        public static readonly ATTRIBUTE_RANGE = "range";
        public static readonly ATTRIBUTE_EXPLOSION_RANGE = "explosionRange";
        public static readonly ATTRIBUTE_INTENSITY = "intensity";
        public static readonly ATTRIBUTE_DURATION = "duration";
        public static readonly ATTRIBUTE_PRICE_IMPROVEMENT = "priceImprovement";
        public static readonly ATTRIBUTE_PRICE_UPGRADE = "priceUpgrade";
        public static readonly ATTRIBUTE_TELEPORT_DISTANCE = "teleportDistance";

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

        public static readonly HEALER_HEALING_TICKS = 200;
        public static readonly HEALER_STOP_TICKS = 5;
        public static readonly HEALER_HEALING_RADIUS = 2;

        public static readonly DIFFICULTY_MODIFIER = 8e-4;
        public static readonly DIFFICULTY_EXPONENT = 1.9;
        public static readonly DIFFICULTY_LINEAR = 20;
        public static readonly MIN_HEALTH_MODIFIER = 0.5;
        public static readonly REWARD_MODIFIER = 0.4;
        public static readonly REWARD_EXPONENT = 0.5;
        public static readonly MIN_REWARD_MODIFIER = 1;
        public static readonly EARLY_BONUS_MODIFIER = 3;
        public static readonly EARLY_BONUS_EXPONENT = 0.6;

        public static readonly WEAK_AGAINST_DAMAGE_MODIFIER = 3.0;
        public static readonly STRONG_AGAINST_DAMAGE_MODIFIER = 0.33;

        // error types
        public static readonly ERROR_VERSION_MISMATCH = "E001";
        public static readonly ERROR_NO_GAME_OVER = "E002";
        public static readonly ERROR_TICKS = "E003";
        public static readonly ERROR_ACTION_ARRAY = "E004";
        public static readonly ERROR_ACTION_TYPE = "E005";
        public static readonly ERROR_ACTION_VALUE = "E006";
        public static readonly ERROR_TURRET = "E007";
        public static readonly ERROR_CREDITS = "E008";
        public static readonly ERROR_NEXT_WAVE = "E009";
        public static readonly ERROR_ADD_TURRET_POSITION = "E010";
        public static readonly ERROR_ADD_TURRET_NAME = "E011";
        public static readonly ERROR_UPGRADE = "E012";
        public static readonly ERROR_LEVEL_UP = "E013";
    }
