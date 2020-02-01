// Copyright 2020 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not use
// this file except in compliance with the License. You may obtain a copy of the
// License at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software distributed
// under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
// CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.


declare var __DEVELOPMENT__: boolean;
declare var __GAME_ONLY__: boolean;

export class GameConstants {

    public static readonly VERSION = "0.0";
    public static readonly DEVELOPMENT = __DEVELOPMENT__;
    public static readonly GAME_ONLY = __GAME_ONLY__;
    public static readonly DOWNLOAD = __DEVELOPMENT__ || __GAME_ONLY__;
    public static readonly SHOW_DEBUG_GEOMETRY = false;
    public static readonly INTERPOLATE_TRAJECTORIES = true;
    public static readonly VERBOSE = false;
    public static readonly GAME_WIDTH = 768;
    public static readonly GAME_HEIGHT = 1024;

    // el tick del engine en milisegundos
    public static readonly TIME_STEP = 100;
    public static readonly ENEMY_SPAWNING_DELTA_TICKS = 10;
    public static readonly INITIAL_CREDITS = 500;
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

    public static readonly SAVED_GAME_DATA_KEY = "creepts-data";
}
