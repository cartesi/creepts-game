// anuto engine
var Anuto,__extends=this&&this.__extends||function(){var s=function(t,e){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)};return function(t,e){function i(){this.constructor=t}s(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}}();!function(s){var t=(e.prototype.getEnemy=function(){var t=null,e=s.GameVars.ticksCounter-s.GameVars.lastWaveTick;if(e%s.GameVars.enemySpawningDeltaTicks==0&&0<s.GameVars.waveEnemies.length){var i=s.GameVars.waveEnemies.shift();if(i.t===e/s.GameVars.enemySpawningDeltaTicks)switch(i.type){case s.GameConstants.ENEMY_SOLDIER:t=new s.Enemy(s.GameConstants.ENEMY_SOLDIER,s.GameVars.ticksCounter);break;case s.GameConstants.ENEMY_RUNNER:t=new s.Enemy(s.GameConstants.ENEMY_RUNNER,s.GameVars.ticksCounter);break;case s.GameConstants.ENEMY_HEALER:t=new s.HealerEnemy(s.GameVars.ticksCounter);break;case s.GameConstants.ENEMY_BLOB:t=new s.Enemy(s.GameConstants.ENEMY_BLOB,s.GameVars.ticksCounter);break;case s.GameConstants.ENEMY_FLIER:t=new s.Enemy(s.GameConstants.ENEMY_FLIER,s.GameVars.ticksCounter)}}return t},e);function e(){}s.EnemiesSpawner=t}(Anuto=Anuto||{}),function(o){var t=(i.prototype.destroy=function(){},i.prototype.update=function(){this.enemiesWithinRange=this.getEnemiesWithinRange(),this.readyToShoot?this.type===o.GameConstants.TURRET_LAUNCH&&2===this.grade?(this.readyToShoot=!1,this.shoot()):0<this.enemiesWithinRange.length&&(this.readyToShoot=!1,this.shoot()):(this.f++,this.f===this.reloadTicks&&(this.readyToShoot=!0,this.f=0))},i.prototype.improve=function(){this.level++,this.calculateTurretParameters()},i.prototype.upgrade=function(){this.grade++,this.level=1,this.calculateTurretParameters()},i.prototype.setNextStrategy=function(){this.shootingStrategyIndex=this.shootingStrategyIndex===o.GameConstants.STRATEGYS_ARRAY.length-1?0:this.shootingStrategyIndex+1,this.shootingStrategy=o.GameConstants.STRATEGYS_ARRAY[this.shootingStrategyIndex]},i.prototype.setFixedTarget=function(){this.fixedTarget=!this.fixedTarget},i.prototype.calculateTurretParameters=function(){this.reloadTicks=Math.floor(o.GameConstants.RELOAD_BASE_TICKS*this.reload)},i.prototype.shoot=function(){},i.prototype.getEnemiesWithinRange=function(){for(var t=[],e=o.MathUtils.fixNumber(this.range*this.range),i=0;i<o.GameVars.enemies.length;i++){var s=o.GameVars.enemies[i];if(0<s.life&&s.l<o.GameVars.enemiesPathCells.length-1.5&&!s.teleporting){var n=this.x-s.x,a=this.y-s.y,r=o.MathUtils.fixNumber(n*n+a*a);r<=e&&t.push({enemy:s,squareDist:r})}}if(1<t.length&&(this.type===o.GameConstants.TURRET_PROJECTILE||this.type===o.GameConstants.TURRET_LASER))switch(this.shootingStrategy){case o.GameConstants.STRATEGY_SHOOT_LAST:t=t.sort(function(t,e){return t.enemy.l-e.enemy.l});break;case o.GameConstants.STRATEGY_SHOOT_CLOSEST:t=t.sort(function(t,e){return t.squareDist-e.squareDist});break;case o.GameConstants.STRATEGY_SHOOT_WEAKEST:t=t.sort(function(t,e){return t.enemy.life-e.enemy.life});break;case o.GameConstants.STRATEGY_SHOOT_STRONGEST:t=t.sort(function(t,e){return e.enemy.life-t.enemy.life});break;case o.GameConstants.STRATEGY_SHOOT_FIRST:t=t.sort(function(t,e){return e.enemy.l-t.enemy.l})}var h=[];for(i=0;i<t.length;i++)h.push(t[i].enemy);return h},i);function i(t,e){this.id=i.id,i.id++,this.creationTick=o.GameVars.ticksCounter,this.type=t,this.f=0,this.level=1,this.maxLevel=10,this.grade=1,this.inflicted=0,this.position=e,this.fixedTarget=!0,this.shootingStrategyIndex=0,this.shootingStrategy=o.GameConstants.STRATEGYS_ARRAY[this.shootingStrategyIndex],this.readyToShoot=!0,this.enemiesWithinRange=[],this.followedEnemy=null,this.x=this.position.c+.5,this.y=this.position.r+.5}o.Turret=t}(Anuto=Anuto||{}),function(a){var t=(s.prototype.destroy=function(){},s.prototype.update=function(){if(this.teleporting)return this.t++,void(8===this.t&&(this.teleporting=!1));var t=this.speed;if(this.affectedByGlue&&(t=a.MathUtils.fixNumber(this.speed/this.glueIntensity)),this.affectedByGlueBullet&&(t=a.MathUtils.fixNumber(this.speed/this.glueIntensityBullet),this.glueDuration<=this.glueTime?(this.affectedByGlueBullet=!1,this.glueTime=0):this.glueTime++),this.l=a.MathUtils.fixNumber(this.l+t),this.l>=a.GameVars.enemiesPathCells.length-1)this.x=a.GameVars.enemiesPathCells[a.GameVars.enemiesPathCells.length-1].c,this.y=a.GameVars.enemiesPathCells[a.GameVars.enemiesPathCells.length-1].r,a.Engine.currentInstance.onEnemyReachedExit(this);else{var e=a.Engine.getPathPosition(this.l);this.x=e.x,this.y=e.y}},s.prototype.teleport=function(t){this.hasBeenTeleported=!0,this.teleporting=!0,this.t=0,this.l-=t,this.l<0&&(this.l=0);var e=a.Engine.getPathPosition(this.l);this.x=e.x,this.y=e.y},s.prototype.glue=function(t){this.affectedByGlue=!0,this.glueIntensity=t},s.prototype.hit=function(t,e,i,s,n){this.life<=0||(this.life-=t,this.life<=0&&(this.life=0,a.Engine.currentInstance.onEnemyKilled(this)))},s.prototype.glueHit=function(t,e,i){this.affectedByGlueBullet=!0,this.glueIntensityBullet=t,this.glueDuration=e},s.prototype.restoreHealth=function(){this.life=this.enemyData.life},s.prototype.getNextPosition=function(t){var e=this.speed;this.affectedByGlue&&(e=a.MathUtils.fixNumber(this.speed/this.glueIntensity));var i=a.MathUtils.fixNumber(this.l+e*t),s=a.Engine.getPathPosition(i);return{x:s.x,y:s.y}},s);function s(t,e){this.id=s.id,s.id++,this.creationTick=e,this.type=t,this.enemyData=a.GameVars.enemyData[this.type],this.life=this.enemyData.life,this.value=this.enemyData.value,this.speed=this.enemyData.speed,this.affectedByGlue=!1,this.glueIntensity=0,this.affectedByGlueBullet=!1,this.glueIntensityBullet=0,this.glueDuration=0,this.glueTime=0,this.hasBeenTeleported=!1,this.teleporting=!1,this.l=0,this.t=0;var i=a.Engine.getPathPosition(this.l);this.x=i.x,this.y=i.y,this.boundingRadius=.4}a.Enemy=t}(Anuto=Anuto||{}),function(u){var t=(n.getPathPosition=function(t){var e,i,s=Math.floor(t);if(s===u.GameVars.enemiesPathCells.length-1)e=u.GameVars.enemiesPathCells[u.GameVars.enemiesPathCells.length-1].c,i=u.GameVars.enemiesPathCells[u.GameVars.enemiesPathCells.length-1].r;else{var n=u.MathUtils.fixNumber(t-s);e=u.GameVars.enemiesPathCells[s].c+.5,i=u.GameVars.enemiesPathCells[s].r+.5;var a=u.MathUtils.fixNumber(u.GameVars.enemiesPathCells[s+1].c-u.GameVars.enemiesPathCells[s].c),r=u.MathUtils.fixNumber(u.GameVars.enemiesPathCells[s+1].r-u.GameVars.enemiesPathCells[s].r);e=u.MathUtils.fixNumber(e+a*n),i=u.MathUtils.fixNumber(i+r*n)}return{x:e,y:i}},n.prototype.update=function(){if(u.GameVars.runningInClientSide){var t=Date.now();if(t-this.t<u.GameVars.timeStep)return;this.t=t}if(this.waveActivated&&!u.GameVars.paused){if(this.noEnemiesOnStage&&0===this.bullets.length&&0===this.glueBullets.length&&0===this.glues.length&&0===this.mortars.length){if(this.waveActivated=!1,!(0<u.GameVars.lifes))return u.GameVars.gameOver=!0,void this.eventDispatcher.dispatchEvent(new u.Event(u.Event.GAME_OVER));this.eventDispatcher.dispatchEvent(new u.Event(u.Event.WAVE_OVER))}this.removeProjectilesAndAccountDamage(),this.teleport(),this.checkCollisions(),this.spawnEnemies(),u.GameVars.enemies.forEach(function(t){t.update()},this),this.turrets.forEach(function(t){t.update()}),this.bullets.forEach(function(t){t.update()}),this.glueBullets.forEach(function(t){t.update()}),this.mortars.forEach(function(t){t.update()}),this.mines.forEach(function(t){t.update()}),this.glues.forEach(function(t){t.update()}),u.GameVars.ticksCounter++}},n.prototype.newWave=function(){var t=Object.keys(u.GameVars.wavesData).length;u.GameVars.waveEnemies=u.GameVars.wavesData["wave_"+(u.GameVars.round%t+1)].slice(0),u.GameVars.round++,u.GameVars.lastWaveTick=u.GameVars.ticksCounter,this.waveActivated=!0,this.t=Date.now(),u.GameVars.enemies=[],this.bullets=[],this.glueBullets=[],this.mortars=[],this.glues=[],this.bulletsColliding=[],this.glueBulletsColliding=[],this.mortarsImpacting=[],this.consumedGlues=[],this.teleportedEnemies=[],this.noEnemiesOnStage=!1},n.prototype.removeEnemy=function(t){var e=u.GameVars.enemies.indexOf(t);-1!==e&&u.GameVars.enemies.splice(e,1),t.destroy()},n.prototype.addTurret=function(t,e){var i=null;switch(t){case u.GameConstants.TURRET_PROJECTILE:i=new u.ProjectileTurret(e);break;case u.GameConstants.TURRET_LASER:i=new u.LaserTurret(e);break;case u.GameConstants.TURRET_LAUNCH:i=new u.LaunchTurret(e);break;case u.GameConstants.TURRET_GLUE:i=new u.GlueTurret(e)}return this.turrets.push(i),u.GameVars.credits-=i.value,i},n.prototype.sellTurret=function(t){var e=this.getTurretById(t),i=this.turrets.indexOf(e);-1!==i&&this.turrets.splice(i,1),u.GameVars.credits+=e.value,e.destroy()},n.prototype.setNextStrategy=function(t){this.getTurretById(t).setNextStrategy()},n.prototype.setFixedTarget=function(t){this.getTurretById(t).setFixedTarget()},n.prototype.addBullet=function(t,e){this.bullets.push(t),this.eventDispatcher.dispatchEvent(new u.Event(u.Event.BULLET_SHOT,[t,e]))},n.prototype.addGlueBullet=function(t,e){this.glueBullets.push(t),this.eventDispatcher.dispatchEvent(new u.Event(u.Event.GLUE_BULLET_SHOT,[t,e]))},n.prototype.addGlue=function(t,e){this.glues.push(t),this.eventDispatcher.dispatchEvent(new u.Event(u.Event.GLUE_SHOT,[t,e]))},n.prototype.addMortar=function(t,e){this.mortars.push(t),this.eventDispatcher.dispatchEvent(new u.Event(u.Event.MORTAR_SHOT,[t,e]))},n.prototype.addMine=function(t,e){this.mines.push(t),this.eventDispatcher.dispatchEvent(new u.Event(u.Event.MINE_SHOT,[t,e]))},n.prototype.addLaserRay=function(t,e){for(var i=0;i<e.length;i++)e[i].hit(t.damage,null,null,null,t);this.eventDispatcher.dispatchEvent(new u.Event(u.Event.LASER_SHOT,[t,e])),this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_HIT,[[e]]))},n.prototype.flagEnemyToTeleport=function(t,e){this.teleportedEnemies.push({enemy:t,glueTurret:e});for(var i=0;i<this.bullets.length;i++)(s=this.bullets[i]).assignedEnemy.id===t.id&&-1===this.bulletsColliding.indexOf(s)&&(s.assignedEnemy=null,this.bulletsColliding.push(s));for(i=0;i<this.glueBullets.length;i++){var s;(s=this.glueBullets[i]).assignedEnemy.id===t.id&&-1===this.glueBulletsColliding.indexOf(s)&&(s.assignedEnemy=null,this.glueBulletsColliding.push(s))}},n.prototype.onEnemyReachedExit=function(t){var e=u.GameVars.enemies.indexOf(t);u.GameVars.enemies.splice(e,1),t.destroy(),u.GameVars.lifes-=1,this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_REACHED_EXIT,[t])),0===u.GameVars.enemies.length&&this.onNoEnemiesOnStage()},n.prototype.onEnemyKilled=function(t){u.GameVars.credits+=t.value,u.GameVars.score+=t.value,this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_KILLED,[t]));var e=u.GameVars.enemies.indexOf(t);u.GameVars.enemies.splice(e,1),t.destroy(),0===u.GameVars.enemies.length&&this.onNoEnemiesOnStage()},n.prototype.improveTurret=function(t){var e=!1,i=this.getTurretById(t);return i.level<i.maxLevel&&u.GameVars.credits>=i.priceImprovement&&(u.GameVars.credits-=i.priceImprovement,i.improve(),e=!0),e},n.prototype.upgradeTurret=function(t){var e=!1,i=this.getTurretById(t);return i.grade<3&&u.GameVars.credits>=i.priceUpgrade&&(u.GameVars.credits-=i.priceUpgrade,i.upgrade(),e=!0),e},n.prototype.addEventListener=function(t,e,i){this.eventDispatcher.addEventListener(t,e,i)},n.prototype.removeEventListener=function(t,e){this.eventDispatcher.removeEventListener(t,e)},n.prototype.checkCollisions=function(){for(var t=0;t<this.bullets.length;t++){var e=this.bullets[t];if(0===(a=this.bullets[t].assignedEnemy).life)this.bulletsColliding.push(e);else{var i={x:e.x,y:e.y},s=e.getPositionNextTick(),n={x:a.x,y:a.y};u.MathUtils.isLineSegmentIntersectingCircle(i,s,n,a.boundingRadius)&&this.bulletsColliding.push(e)}}for(t=0;t<this.glueBullets.length;t++){e=this.glueBullets[t];var a=this.glueBullets[t].assignedEnemy;i={x:e.x,y:e.y},s=e.getPositionNextTick(),n={x:a.x,y:a.y},u.MathUtils.isLineSegmentIntersectingCircle(i,s,n,a.boundingRadius)&&this.glueBulletsColliding.push(e)}for(t=0;t<this.mortars.length;t++)this.mortars[t].detonate&&this.mortarsImpacting.push(this.mortars[t]);for(t=0;t<this.mines.length;t++)this.mines[t].detonate&&this.minesImpacting.push(this.mines[t]);for(t=0;t<this.glues.length;t++)this.glues[t].consumed&&this.consumedGlues.push(this.glues[t]);for(t=0;t<u.GameVars.enemies.length;t++)if((a=u.GameVars.enemies[t]).type!==u.GameConstants.ENEMY_FLIER){a.affectedByGlue=!1;for(var r=0;r<this.glues.length;r++){var h=this.glues[r];if(!h.consumed){var o=a.x-h.x,l=a.y-h.y;if(u.MathUtils.fixNumber(o*o+l*l)<=u.MathUtils.fixNumber(h.range*h.range)){a.glue(h.intensity);break}}}}},n.prototype.removeProjectilesAndAccountDamage=function(){for(var t=0;t<this.bulletsColliding.length;t++){null===(o=(i=this.bulletsColliding[t]).assignedEnemy)||0===o.life?this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_HIT,[[],i])):(this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_HIT,[[o],i])),o.hit(i.damage,i));var e=this.bullets.indexOf(i);this.bullets.splice(e,1),i.destroy()}for(t=this.bulletsColliding.length=0;t<this.glueBulletsColliding.length;t++){var i;null===(o=(i=this.glueBulletsColliding[t]).assignedEnemy)||0===o.life?this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_GLUE_HIT,[[],i])):(this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_GLUE_HIT,[[o],i])),o.glueHit(i.intensity,i.durationTicks,i)),e=this.glueBullets.indexOf(i),this.glueBullets.splice(e,1),i.destroy()}for(t=this.glueBulletsColliding.length=0;t<this.mortarsImpacting.length;t++){var s=this.mortarsImpacting[t],n=[];if(0<(r=s.getEnemiesWithinExplosionRange()).length)for(var a=0;a<r.length;a++)0<(o=r[a].enemy).life&&(o.hit(r[a].damage,null,s),n.push(o));this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_HIT,[n,null,s])),e=this.mortars.indexOf(s),this.mortars.splice(e,1),s.destroy()}for(t=this.mortarsImpacting.length=0;t<this.minesImpacting.length;t++){var r,h=this.minesImpacting[t];if(n=[],0<(r=h.getEnemiesWithinExplosionRange()).length)for(a=0;a<r.length;a++){var o;0<(o=r[a].enemy).life&&(o.hit(r[a].damage,null,null,h),n.push(o))}this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_HIT,[n,null,null,h])),e=this.mines.indexOf(h),this.mines.splice(e,1),h.destroy()}for(t=this.minesImpacting.length=0;t<this.consumedGlues.length;t++){var l=this.consumedGlues[t];e=this.glues.indexOf(l),this.glues.splice(e,1),this.eventDispatcher.dispatchEvent(new u.Event(u.Event.GLUE_CONSUMED,[l])),l.destroy()}this.consumedGlues.length=0},n.prototype.teleport=function(){for(var t=[],e=0;e<this.teleportedEnemies.length;e++){var i=this.teleportedEnemies[e].enemy;i.teleport(this.teleportedEnemies[e].glueTurret.teleportDistance),t.push({enemy:i,glueTurret:this.teleportedEnemies[e].glueTurret})}(this.teleportedEnemies.length=0)<t.length&&this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMIES_TELEPORTED,[t]))},n.prototype.spawnEnemies=function(){var t=this.enemiesSpawner.getEnemy();t&&(u.GameVars.enemies.push(t),this.eventDispatcher.dispatchEvent(new u.Event(u.Event.ENEMY_SPAWNED,[t,u.GameVars.enemiesPathCells[0]])))},n.prototype.onNoEnemiesOnStage=function(){this.noEnemiesOnStage=!0;for(var t=0;t<this.bullets.length;t++){var e=this.bullets[t];e.assignedEnemy=null,this.bulletsColliding.push(e)}this.eventDispatcher.dispatchEvent(new u.Event(u.Event.NO_ENEMIES_ON_STAGE))},n.prototype.getTurretById=function(t){for(var e=null,i=0;i<this.turrets.length;i++)if(this.turrets[i].id===t){e=this.turrets[i];break}return e},Object.defineProperty(n.prototype,"ticksCounter",{get:function(){return u.GameVars.ticksCounter},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"score",{get:function(){return u.GameVars.score},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"gameOver",{get:function(){return u.GameVars.gameOver},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"credits",{get:function(){return u.GameVars.credits},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"lifes",{get:function(){return u.GameVars.lifes},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"round",{get:function(){return u.GameVars.round},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"timeStep",{get:function(){return u.GameVars.timeStep},set:function(t){u.GameVars.timeStep=t},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"paused",{set:function(t){u.GameVars.paused=t},enumerable:!0,configurable:!0}),n);function n(t,e,i,s){n.currentInstance=this,u.Turret.id=0,u.Enemy.id=0,u.Bullet.id=0,u.Mortar.id=0,u.Glue.id=0,u.Mine.id=0,u.GameVars.runningInClientSide=t.runningInClientSide,u.GameVars.credits=t.credits,u.GameVars.lifes=t.lifes,u.GameVars.timeStep=t.timeStep,u.GameVars.enemySpawningDeltaTicks=t.enemySpawningDeltaTicks,u.GameVars.paused=!1,u.GameVars.enemiesPathCells=t.enemiesPathCells,u.GameVars.enemyData=e,u.GameVars.turretData=i,u.GameVars.wavesData=s,u.GameVars.round=0,u.GameVars.score=0,u.GameVars.gameOver=!1,this.waveActivated=!1,this.t=0,this.eventDispatcher=new u.EventDispatcher,this.enemiesSpawner=new u.EnemiesSpawner,u.GameVars.ticksCounter=0,u.GameVars.lastWaveTick=0,this.turrets=[],this.mines=[],this.minesImpacting=[]}u.Engine=t}(Anuto=Anuto||{}),function(t){var e=(i.RELOAD_BASE_TICKS=10,i.BULLET_SPEED=.5,i.MORTAR_SPEED=.1,i.ENEMY_SOLDIER="soldier",i.ENEMY_RUNNER="runner",i.ENEMY_HEALER="healer",i.ENEMY_BLOB="blob",i.ENEMY_FLIER="flier",i.TURRET_PROJECTILE="projectile",i.TURRET_LASER="laser",i.TURRET_LAUNCH="launch",i.TURRET_GLUE="glue",i.STRATEGYS_ARRAY=[i.STRATEGY_SHOOT_FIRST="First",i.STRATEGY_SHOOT_LAST="Last",i.STRATEGY_SHOOT_CLOSEST="Closest",i.STRATEGY_SHOOT_WEAKEST="Weakest",i.STRATEGY_SHOOT_STRONGEST="Strongest"],i.HEALER_HEALING_TICKS=100,i.HEALER_STOP_TICKS=30,i.HEALER_HEALING_RADIUS=2,i);function i(){}t.GameConstants=e}(Anuto=Anuto||{}),function(){function t(){}(Anuto||(Anuto={})).GameVars=t}(),function(i){var s,t=(s=i.Enemy,__extends(e,s),e.prototype.update=function(){this.f++,this.healing?(this.heal(),this.f===i.GameConstants.HEALER_STOP_TICKS&&(this.f=0,this.healing=!1)):(s.prototype.update.call(this),this.f===i.GameConstants.HEALER_HEALING_TICKS&&this.l<i.GameVars.enemiesPathCells.length-2&&(this.f=0,this.healing=!0))},e.prototype.heal=function(){for(var t=0;t<i.GameVars.enemies.length;t++){var e=i.GameVars.enemies[t];e.id===this.id?e.restoreHealth():i.MathUtils.fixNumber((e.x-this.x)*(e.x-this.x)+(e.y-this.y)*(e.y-this.y))<=i.GameConstants.HEALER_HEALING_RADIUS*i.GameConstants.HEALER_HEALING_RADIUS&&e.restoreHealth()}},e);function e(t){var e=s.call(this,i.GameConstants.ENEMY_HEALER,t)||this;return e.f=i.GameConstants.HEALER_HEALING_TICKS-t%i.GameConstants.HEALER_HEALING_TICKS,e.healing=!1,e}i.HealerEnemy=t}(Anuto=Anuto||{}),function(t){var e=(i.prototype.getParams=function(){return this.params},i.prototype.getType=function(){return this.type},i.ENEMY_SPAWNED="enemy spawned",i.ENEMY_KILLED="enemy killed",i.ENEMY_HIT="enemy hit by bullet",i.ENEMY_GLUE_HIT="enemy hit by glue bullet",i.ENEMY_REACHED_EXIT="enemy reached exit",i.WAVE_OVER="wave over",i.GAME_OVER="game over",i.NO_ENEMIES_ON_STAGE="no enemies on stage",i.BULLET_SHOT="bullet shot",i.GLUE_BULLET_SHOT="glue bullet shot",i.LASER_SHOT="laser shot",i.MORTAR_SHOT="mortar shot",i.MINE_SHOT="mine shot",i.GLUE_SHOT="glue shot",i.GLUE_CONSUMED="glue consumed",i.ENEMIES_TELEPORTED="enemies teleported",i);function i(t,e){this.type=t,this.params=e}t.Event=e}(Anuto=Anuto||{}),function(t){var e=(i.prototype.hasEventListener=function(t,e){for(var i=!1,s=0;s<this.listeners.length;s++)this.listeners[s].type===t&&this.listeners[s].listener===e&&(i=!0);return i},i.prototype.addEventListener=function(t,e,i){this.hasEventListener(t,e)||this.listeners.push({type:t,listener:e,scope:i})},i.prototype.removeEventListener=function(t,e){for(var i=0;i<this.listeners.length;i++)this.listeners[i].type===t&&this.listeners[i].listener===e&&this.listeners.splice(i,1)},i.prototype.dispatchEvent=function(t){for(var e=0;e<this.listeners.length;e++)this.listeners[e].type===t.getType()&&this.listeners[e].listener.apply(this.listeners[e].scope,t.getParams())},i);function i(){this.listeners=[]}t.EventDispatcher=e}(Anuto=Anuto||{}),function(a){var t=(r.prototype.destroy=function(){},r.prototype.update=function(){this.x=a.MathUtils.fixNumber(this.x+this.vx),this.y=a.MathUtils.fixNumber(this.y+this.vy)},r.prototype.getPositionNextTick=function(){return{x:a.MathUtils.fixNumber(this.x+this.vx),y:a.MathUtils.fixNumber(this.y+this.vy)}},r);function r(t,e,i,s,n){this.id=r.id,r.id++,this.x=t.c+.5,this.y=t.r+.5,this.assignedEnemy=i,this.damage=s,this.canonShoot=n,this.vx=a.MathUtils.fixNumber(a.GameConstants.BULLET_SPEED*Math.cos(e)),this.vy=a.MathUtils.fixNumber(a.GameConstants.BULLET_SPEED*Math.sin(e))}a.Bullet=t}(Anuto=Anuto||{}),function(t){var e=(n.prototype.destroy=function(){},n.prototype.update=function(){this.f++,this.f===this.duration&&(this.consumed=!0)},n);function n(t,e,i,s){this.id=n.id,n.id++,this.x=t.c+.5,this.y=t.r+.5,this.intensity=e,this.duration=i,this.range=s,this.consumed=!1,this.f=0}t.Glue=e}(Anuto=Anuto||{}),function(a){var t=(e.prototype.destroy=function(){},e.prototype.update=function(){this.x=a.MathUtils.fixNumber(this.x+this.vx),this.y=a.MathUtils.fixNumber(this.y+this.vy)},e.prototype.getPositionNextTick=function(){return{x:a.MathUtils.fixNumber(this.x+this.vx),y:a.MathUtils.fixNumber(this.y+this.vy)}},e);function e(t,e,i,s,n){this.id=a.Bullet.id,a.Bullet.id++,this.x=t.c+.5,this.y=t.r+.5,this.assignedEnemy=i,this.intensity=s,this.durationTicks=n,this.vx=a.MathUtils.fixNumber(a.GameConstants.BULLET_SPEED*Math.cos(e)),this.vy=a.MathUtils.fixNumber(a.GameConstants.BULLET_SPEED*Math.sin(e))}a.GlueBullet=t}(Anuto=Anuto||{}),function(l){var u,t=(u=l.Turret,__extends(e,u),e.prototype.calculateTurretParameters=function(){switch(this.grade){case 1:case 2:this.damage=Math.floor(1/3*Math.pow(this.level,3)+2*Math.pow(this.level,2)+95/3*this.level+66),this.reload=5,this.range=Math.round(10*(2/45*this.level+12/9))/10,this.duration=3,this.durationTicks=Math.floor(l.GameConstants.RELOAD_BASE_TICKS*this.duration),this.intensity=2,this.priceImprovement=Math.floor(29/336*Math.pow(this.level,3)+27/56*Math.pow(this.level,2)+2671/336*this.level+2323/56);break;case 3:this.teleportDistance=5,this.reload=5,this.range=Math.round(10*(4/45*this.level+24/9))/10,this.priceImprovement=Math.floor(29/336*Math.pow(this.level,3)+27/56*Math.pow(this.level,2)+2671/336*this.level+2323/56)}this.priceUpgrade=800*this.grade,1===this.level&&1===this.grade&&(this.value=l.GameVars.turretData[this.type].price),u.prototype.calculateTurretParameters.call(this)},e.prototype.shoot=function(){var t;switch(u.prototype.shoot.call(this),this.grade){case 1:var e=new l.Glue(this.position,this.intensity,this.durationTicks,this.range);l.Engine.currentInstance.addGlue(e,this);break;case 2:t=this.fixedTarget&&this.followedEnemy||this.enemiesWithinRange[0];var i=l.MathUtils.fixNumber(Math.sqrt((this.x-t.x)*(this.x-t.x)+(this.y-t.y)*(this.y-t.y))),s=Math.floor(l.MathUtils.fixNumber(i/l.GameConstants.BULLET_SPEED)),n=t.getNextPosition(s),a=n.x-this.x,r=n.y-this.y,h=l.MathUtils.fixNumber(a*a+r*r);if(this.range*this.range>h){this.shootAngle=l.MathUtils.fixNumber(Math.atan2(r,a));var o=new l.GlueBullet({c:this.position.c,r:this.position.r},this.shootAngle,t,this.intensity,this.durationTicks);l.Engine.currentInstance.addGlueBullet(o,this)}else this.readyToShoot=!0;break;case 3:0<(t=this.fixedTarget&&this.followedEnemy||this.enemiesWithinRange[0]).life&&!t.hasBeenTeleported?l.Engine.currentInstance.flagEnemyToTeleport(t,this):this.readyToShoot=!0}},e);function e(t){var e=u.call(this,l.GameConstants.TURRET_GLUE,t)||this;return e.maxLevel=5,e.calculateTurretParameters(),e}l.GlueTurret=t}(Anuto=Anuto||{}),function(n){var s,t=(s=n.Turret,__extends(e,s),e.prototype.update=function(){this.fixedTarget?0<this.enemiesWithinRange.length?-1===this.enemiesWithinRange.indexOf(this.followedEnemy)&&(this.followedEnemy=this.enemiesWithinRange[0]):this.followedEnemy=null:this.followedEnemy=this.enemiesWithinRange[0],s.prototype.update.call(this)},e.prototype.calculateTurretParameters=function(){this.damage=Math.floor(271/630*Math.pow(this.level,3)+283/315*Math.pow(this.level,2)+2437/70*this.level+1357/7),this.reload=Math.round(10*(-.1*this.level+1.6))/10,this.range=Math.round(10*(.04*this.level+2.96))/10,this.priceImprovement=Math.floor(9/80*Math.pow(this.level,3)+17/120*Math.pow(this.level,2)+2153/240*this.level+40.775),this.priceUpgrade=7e3*this.grade,1===this.level&&(this.value=n.GameVars.turretData[this.type].price),s.prototype.calculateTurretParameters.call(this)},e.prototype.getEnemiesWithinLine=function(t){for(var e=[],i=0;i<n.GameVars.enemies.length;i++){var s=n.GameVars.enemies[i];s!==t&&this.inLine({x:this.position.c,y:this.position.r},{x:Math.floor(s.x),y:Math.floor(s.y)},{x:Math.floor(t.x),y:Math.floor(t.y)})&&e.push(s)}return console.log(e),e},e.prototype.inLine=function(t,e,i){return t.x===i.x?e.x===i.x:t.y===i.y?e.y===i.y:(t.x-i.x)*(t.y-i.y)==(i.x-e.x)*(i.y-e.y)},e.prototype.shoot=function(){s.prototype.shoot.call(this);var t=[],e=1,i=0;switch(this.grade){case 1:e=1;break;case 2:e=3}if(3===this.grade)this.fixedTarget?t.push(this.followedEnemy||this.enemiesWithinRange[0]):t.push(this.enemiesWithinRange[0]),t=t.concat(this.getEnemiesWithinLine(t[0]));else for(this.fixedTarget&&this.followedEnemy?(t.push(this.followedEnemy),this.followedEnemy===this.enemiesWithinRange[0]&&i++):(t.push(this.enemiesWithinRange[0]),i++);t.length<e&&this.enemiesWithinRange[i];)t.push(this.enemiesWithinRange[i]),i++;0<t[0].life?n.Engine.currentInstance.addLaserRay(this,t):this.readyToShoot=!0},e);function e(t){var e=s.call(this,n.GameConstants.TURRET_LASER,t)||this;return e.calculateTurretParameters(),e}n.LaserTurret=t}(Anuto=Anuto||{}),function(f){var d,t=(d=f.Turret,__extends(g,d),g.prototype.calculateTurretParameters=function(){this.damage=Math.floor(1/3*Math.pow(this.level,3)+2*Math.pow(this.level,2)+95/3*this.level+66),this.reload=Math.round(10*(-2/18*this.level+38/18))/10,this.range=Math.round(10*(2/45*this.level+221/90))/10,this.explosionRange=.6*this.range,this.priceImprovement=Math.floor(29/336*Math.pow(this.level,3)+27/56*Math.pow(this.level,2)+2671/336*this.level+2323/56),this.priceUpgrade=1e4*this.grade,1===this.level&&(this.value=f.GameVars.turretData[this.type].price),d.prototype.calculateTurretParameters.call(this)},g.prototype.getPathCellsInRange=function(){for(var t=[],e=0;e<f.GameVars.enemiesPathCells.length;e++){var i=f.GameVars.enemiesPathCells[e];(i.c>=this.position.c&&i.c<=this.position.c+this.range||i.c<=this.position.c&&i.c>=this.position.c-this.range)&&(i.r>=this.position.r&&i.r<=this.position.r+this.range||i.r<=this.position.r&&i.r>=this.position.r-this.range)&&t.push(i)}return t},g.prototype.shoot=function(){if(d.prototype.shoot.call(this),2===this.grade){var t=this.getPathCellsInRange();if(0<t.length){var e=t[this.minesCounter%t.length];this.minesCounter++;var i=new f.Mine({c:e.c,r:e.r},this.explosionRange,this.damage);f.Engine.currentInstance.addMine(i,this)}else this.readyToShoot=!0}else{var s=void 0;s=this.fixedTarget&&this.followedEnemy||this.enemiesWithinRange[0];var n=f.MathUtils.fixNumber(Math.sqrt((this.x-s.x)*(this.x-s.x)+(this.y-s.y)*(this.y-s.y))),a=3===this.grade?5*f.GameConstants.MORTAR_SPEED:f.GameConstants.MORTAR_SPEED,r=Math.floor(f.MathUtils.fixNumber(n/a)),h=s.getNextPosition(r);if(1===this.grade){var o=f.MathUtils.fixNumber(g.deviationRadius*Math.cos(g.deviationAngle*Math.PI/180)),l=f.MathUtils.fixNumber(g.deviationRadius*Math.sin(g.deviationAngle*Math.PI/180));h.x+=o,h.y+=l,g.deviationRadius=.75===g.deviationRadius?0:g.deviationRadius+.25,g.deviationAngle=315===g.deviationAngle?0:g.deviationAngle+45}if((n=f.MathUtils.fixNumber(Math.sqrt((this.x-h.x)*(this.x-h.x)+(this.y-h.y)*(this.y-h.y))))<this.range){var u=3===this.grade?5*f.GameConstants.MORTAR_SPEED:f.GameConstants.MORTAR_SPEED;r=Math.floor(f.MathUtils.fixNumber(n/u));var m=h.x-this.x,c=h.y-this.y;this.shootAngle=f.MathUtils.fixNumber(Math.atan2(c,m));var p=new f.Mortar(this.position,this.shootAngle,r,this.explosionRange,this.damage,this.grade);f.Engine.currentInstance.addMortar(p,this)}else this.readyToShoot=!0}},g.deviationRadius=0,g.deviationAngle=0,g);function g(t){var e=d.call(this,f.GameConstants.TURRET_LAUNCH,t)||this;return e.calculateTurretParameters(),e.minesCounter=0,e}f.LaunchTurret=t}(Anuto=Anuto||{}),function(a){var t=(s.prototype.destroy=function(){},s.prototype.update=function(){if(!this.detonate)for(var t=0;t<a.GameVars.enemies.length;t++){var e=a.GameVars.enemies[t];if(a.MathUtils.fixNumber(Math.sqrt((e.x-this.x)*(e.x-this.x)+(e.y-this.y)*(e.y-this.y)))<=this.range){this.detonate=!0;break}}},s.prototype.getEnemiesWithinExplosionRange=function(){for(var t=[],e=0;e<a.GameVars.enemies.length;e++){var i=a.GameVars.enemies[e],s=a.MathUtils.fixNumber(Math.sqrt((i.x-this.x)*(i.x-this.x)+(i.y-this.y)*(i.y-this.y)));if(s<=this.explosionRange){var n=a.MathUtils.fixNumber(this.damage*(1-s/this.explosionRange));t.push({enemy:i,damage:n})}}return t},s);function s(t,e,i){this.id=s.id,s.id++,this.x=t.c+.5,this.y=t.r+.5,this.explosionRange=e,this.damage=i,this.range=.5,this.detonate=!1}a.Mine=t}(Anuto=Anuto||{}),function(h){var t=(o.prototype.destroy=function(){},o.prototype.update=function(){this.x=h.MathUtils.fixNumber(this.x+this.vx),this.y=h.MathUtils.fixNumber(this.y+this.vy),this.f++,this.f===this.ticksToImpact&&(this.detonate=!0)},o.prototype.getEnemiesWithinExplosionRange=function(){for(var t=[],e=0;e<h.GameVars.enemies.length;e++){var i=h.GameVars.enemies[e],s=h.MathUtils.fixNumber(Math.sqrt((i.x-this.x)*(i.x-this.x)+(i.y-this.y)*(i.y-this.y)));if(s<=this.explosionRange){var n=h.MathUtils.fixNumber(this.damage*(1-s/this.explosionRange));t.push({enemy:i,damage:n})}}return t},o);function o(t,e,i,s,n,a){this.id=o.id,o.id++,this.creationTick=h.GameVars.ticksCounter,this.x=t.c+.5,this.y=t.r+.5,this.ticksToImpact=i,this.explosionRange=s,this.damage=n,this.grade=a,this.detonate=!1,this.f=0;var r=3===this.grade?5*h.GameConstants.MORTAR_SPEED:h.GameConstants.MORTAR_SPEED;this.vx=h.MathUtils.fixNumber(r*Math.cos(e)),this.vy=h.MathUtils.fixNumber(r*Math.sin(e))}h.Mortar=t}(Anuto=Anuto||{}),function(o){var l,t=(l=o.Turret,__extends(e,l),e.prototype.update=function(){this.fixedTarget?0<this.enemiesWithinRange.length?-1===this.enemiesWithinRange.indexOf(this.followedEnemy)&&(this.followedEnemy=this.enemiesWithinRange[0]):this.followedEnemy=null:this.followedEnemy=this.enemiesWithinRange[0],l.prototype.update.call(this)},e.prototype.calculateTurretParameters=function(){switch(this.grade){case 1:this.damage=Math.floor(1/3*Math.pow(this.level,3)+2*Math.pow(this.level,2)+95/3*this.level+66),this.reload=Math.round(10*(-1/18*this.level+19/18))/10,this.range=Math.round(10*(2/45*this.level+221/90))/10,this.priceImprovement=Math.floor(29/336*Math.pow(this.level,3)+27/56*Math.pow(this.level,2)+2671/336*this.level+2323/56);break;case 2:this.damage=Math.floor(1/3*Math.pow(this.level,3)+2*Math.pow(this.level,2)+95/3*this.level+150),this.reload=Math.round(10*(-1/18*this.level+12/18))/10,this.range=Math.round(10*(2/45*this.level+221/90))/10,this.priceImprovement=Math.floor(29/336*Math.pow(this.level,3)+27/56*Math.pow(this.level,2)+2671/336*this.level+2323/56);break;case 3:this.damage=Math.floor(1/3*Math.pow(this.level,3)+2*Math.pow(this.level,2)+95/3*this.level+250),this.reload=Math.round(10*(-1/18*this.level+12/18))/10,this.range=Math.round(10*(2/45*this.level+221/90))/10,this.priceImprovement=Math.floor(29/336*Math.pow(this.level,3)+27/56*Math.pow(this.level,2)+2671/336*this.level+2323/56)}this.priceUpgrade=5600*this.grade,1===this.level&&(this.value=o.GameVars.turretData[this.type].price),l.prototype.calculateTurretParameters.call(this)},e.prototype.shoot=function(){var t;l.prototype.shoot.call(this),t=this.fixedTarget&&this.followedEnemy||this.enemiesWithinRange[0];var e=o.MathUtils.fixNumber(Math.sqrt((this.x-t.x)*(this.x-t.x)+(this.y-t.y)*(this.y-t.y))),i=Math.floor(o.MathUtils.fixNumber(e/o.GameConstants.BULLET_SPEED)),s=t.getNextPosition(i),n=s.x-this.x,a=s.y-this.y,r=o.MathUtils.fixNumber(n*n+a*a);switch(this.grade){case 2:case 3:"left"===this.canonShoot?this.canonShoot="right":this.canonShoot="left"}if(this.range*this.range>r){this.shootAngle=o.MathUtils.fixNumber(Math.atan2(a,n));var h=new o.Bullet({c:this.position.c,r:this.position.r},this.shootAngle,t,this.damage,this.canonShoot);o.Engine.currentInstance.addBullet(h,this)}else this.readyToShoot=!0},e);function e(t){var e=l.call(this,o.GameConstants.TURRET_PROJECTILE,t)||this;switch(e.canonShoot="center",e.grade){case 2:case 3:e.canonShoot="left"}return e.calculateTurretParameters(),e}o.ProjectileTurret=t}(Anuto=Anuto||{}),function(t){var e=(c.fixNumber=function(t){return isNaN(t)?0:Math.round(1e5*t)/1e5},c.isLineSegmentIntersectingCircle=function(t,e,i,s){if(c.isPointInsideCircle(t.x,t.y,i.x,i.y,s))return!0;if(c.isPointInsideCircle(e.x,e.y,i.x,i.y,s))return!0;var n=t.x-e.x,a=t.y-e.y,r=c.fixNumber(Math.sqrt(n*n+a*a)),h=((i.x-t.x)*(e.x-t.x)+(i.y-t.y)*(e.y-t.y))/(r*r),o=t.x+h*(e.x-t.x),l=t.y+h*(e.y-t.y);if(!c.isPointInLineSegment(t.x,t.y,e.x,e.y,o,l))return!1;var u=o-i.x,m=l-i.y;return c.fixNumber(Math.sqrt(u*u+m*m))<=s},c.isPointInLineSegment=function(t,e,i,s,n,a){var r=c.fixNumber(Math.sqrt((n-t)*(n-t)+(a-e)*(a-e))),h=c.fixNumber(Math.sqrt((n-i)*(n-i)+(a-s)*(a-s))),o=c.fixNumber(Math.sqrt((t-i)*(t-i)+(e-s)*(e-s)));return o-.1<=r+h&&r+h<=o+.1},c.isPointInsideCircle=function(t,e,i,s,n){var a=i-t,r=s-e;return c.fixNumber(Math.sqrt(a*a+r*r))<=n},c);function c(){}t.MathUtils=e}(Anuto=Anuto||{});

// var fs = require("fs-extra");

// LOGS TYPES
var TYPE_NEXT_WAVE = "type next wave";
var TYPE_ADD_TURRET = "type add turret";
var TYPE_SELL_TURRET = "type sell turret";
var TYPE_UPGRADE_TURRET = "type upgrade turret";
var TYPE_LEVEL_UP_TURRET = "type level up turret";
var TYPE_CHANGE_STRATEGY_TURRET = "type change strategy turret";
var TYPE_CHANGE_FIXED_TARGET_TURRET = "type change fixed target turret";

var logs = {  
    "gameConfig":{  
        "timeStep":100,
        "runningInClientSide":true,
        "enemySpawningDeltaTicks":10,
        "credits":100000,
        "lifes":20,
        "boardSize":{  
            "r":15,
            "c":10
        },
        "enemiesPathCells":[  
            {  
                "r":-1,
                "c":3
            },
            {  
                "r":0,
                "c":3
            },
            {  
                "r":1,
                "c":3
            },
            {  
                "r":1,
                "c":4
            },
            {  
                "r":1,
                "c":5
            },
            {  
                "r":1,
                "c":6
            },
            {  
                "r":2,
                "c":6
            },
            {  
                "r":3,
                "c":6
            },
            {  
                "r":3,
                "c":5
            },
            {  
                "r":3,
                "c":4
            },
            {  
                "r":4,
                "c":4
            },
            {  
                "r":5,
                "c":4
            },
            {  
                "r":6,
                "c":4
            },
            {  
                "r":7,
                "c":4
            },
            {  
                "r":8,
                "c":4
            },
            {  
                "r":9,
                "c":4
            },
            {  
                "r":10,
                "c":4
            },
            {  
                "r":10,
                "c":3
            },
            {  
                "r":10,
                "c":2
            },
            {  
                "r":10,
                "c":1
            },
            {  
                "r":11,
                "c":1
            },
            {  
                "r":12,
                "c":1
            },
            {  
                "r":12,
                "c":2
            },
            {  
                "r":12,
                "c":3
            },
            {  
                "r":12,
                "c":4
            },
            {  
                "r":12,
                "c":5
            },
            {  
                "r":12,
                "c":6
            },
            {  
                "r":12,
                "c":7
            },
            {  
                "r":12,
                "c":8
            },
            {  
                "r":13,
                "c":8
            },
            {  
                "r":14,
                "c":8
            },
            {  
                "r":15,
                "c":8
            }
        ]
    },
    "enemiesData":{  
        "soldier":{  
            "life":1000,
            "speed":0.1,
            "value":200
        },
        "runner":{  
            "life":750,
            "speed":0.2,
            "value":150
        },
        "healer":{  
            "life":1500,
            "speed":0.085,
            "value":500
        },
        "blob":{  
            "life":2500,
            "speed":0.045,
            "value":600
        },
        "flier":{  
            "life":2000,
            "speed":0.075,
            "value":450
        }
    },
    "turretsData":{  
        "projectile":{  
            "price":150
        },
        "laser":{  
            "price":150
        },
        "launch":{  
            "price":250
        },
        "glue":{  
            "price":500
        }
    },
    "wavesData":{  
        "wave_1":[  
            {  
                "type":"soldier",
                "t":0
            },
            {  
                "type":"soldier",
                "t":1
            },
            {  
                "type":"soldier",
                "t":2
            },
            {  
                "type":"soldier",
                "t":3
            },
            {  
                "type":"soldier",
                "t":8
            },
            {  
                "type":"soldier",
                "t":9
            },
            {  
                "type":"soldier",
                "t":10
            },
            {  
                "type":"soldier",
                "t":11
            },
            {  
                "type":"soldier",
                "t":12
            },
            {  
                "type":"soldier",
                "t":15
            }
        ],
        "wave_2":[  
            {  
                "type":"soldier",
                "t":0
            },
            {  
                "type":"soldier",
                "t":1
            },
            {  
                "type":"soldier",
                "t":2
            },
            {  
                "type":"soldier",
                "t":3
            },
            {  
                "type":"soldier",
                "t":4
            },
            {  
                "type":"runner",
                "t":10
            },
            {  
                "type":"runner",
                "t":12
            },
            {  
                "type":"runner",
                "t":14
            },
            {  
                "type":"runner",
                "t":16
            },
            {  
                "type":"soldier",
                "t":18
            }
        ],
        "wave_3":[  
            {  
                "type":"soldier",
                "t":0
            },
            {  
                "type":"soldier",
                "t":1
            },
            {  
                "type":"healer",
                "t":2
            },
            {  
                "type":"soldier",
                "t":3
            },
            {  
                "type":"runner",
                "t":4
            },
            {  
                "type":"runner",
                "t":5
            },
            {  
                "type":"runner",
                "t":6
            },
            {  
                "type":"healer",
                "t":7
            },
            {  
                "type":"runner",
                "t":14
            },
            {  
                "type":"runner",
                "t":16
            },
            {  
                "type":"soldier",
                "t":18
            }
        ],
        "wave_4":[  
            {  
                "type":"soldier",
                "t":0
            },
            {  
                "type":"soldier",
                "t":1
            },
            {  
                "type":"blob",
                "t":2
            },
            {  
                "type":"soldier",
                "t":3
            },
            {  
                "type":"flier",
                "t":4
            },
            {  
                "type":"flier",
                "t":5
            },
            {  
                "type":"runner",
                "t":6
            },
            {  
                "type":"healer",
                "t":7
            },
            {  
                "type":"runner",
                "t":14
            },
            {  
                "type":"runner",
                "t":16
            },
            {  
                "type":"soldier",
                "t":18
            }
        ]
    },
    "actions":[  
        {  
            "type":"type add turret",
            "tick":0,
            "typeTurret":"glue",
            "position":{  
                "r":2,
                "c":5
            }
        },
        {  
            "type":"type next wave",
            "tick":0
        },
        {  
            "type":"type add turret",
            "tick":18,
            "typeTurret":"launch",
            "position":{  
                "r":4,
                "c":3
            }
        },
        {  
            "type":"type add turret",
            "tick":40,
            "typeTurret":"laser",
            "position":{  
                "r":4,
                "c":5
            }
        },
        {  
            "type":"type add turret",
            "tick":84,
            "typeTurret":"laser",
            "position":{  
                "r":9,
                "c":3
            }
        },
        {  
            "type":"type upgrade turret",
            "tick":99,
            "id":3
        },
        {  
            "type":"type add turret",
            "tick":120,
            "typeTurret":"projectile",
            "position":{  
                "r":6,
                "c":5
            }
        },
        {  
            "type":"type level up turret",
            "tick":138,
            "id":4
        },
        {  
            "type":"type upgrade turret",
            "tick":144,
            "id":4
        },
        {  
            "type":"type add turret",
            "tick":182,
            "typeTurret":"glue",
            "position":{  
                "r":11,
                "c":2
            }
        },
        {  
            "type":"type upgrade turret",
            "tick":199,
            "id":5
        },
        {  
            "type":"type next wave",
            "tick":221
        },
        {  
            "type":"type add turret",
            "tick":293,
            "typeTurret":"glue",
            "position":{  
                "r":9,
                "c":5
            }
        },
        {  
            "type":"type upgrade turret",
            "tick":351,
            "id":6
        },
        {  
            "type":"type upgrade turret",
            "tick":368,
            "id":6
        },
        {  
            "type":"type next wave",
            "tick":437
        },
        {  
            "type":"type add turret",
            "tick":513,
            "typeTurret":"launch",
            "position":{  
                "r":7,
                "c":3
            }
        },
        {  
            "type":"type upgrade turret",
            "tick":553,
            "id":7
        },
        {  
            "type":"type upgrade turret",
            "tick":563,
            "id":7
        },
        {  
            "type":"type sell turret",
            "tick":753,
            "id":7
        },
        {  
            "type":"type next wave",
            "tick":753
        },
        {  
            "type":"type upgrade turret",
            "tick":823,
            "id":0
        },
        {  
            "type":"type sell turret",
            "tick":1041,
            "id":6
        },
        {  
            "type":"type level up turret",
            "tick":1093,
            "id":3
        },
        {  
            "type":"type level up turret",
            "tick":1099,
            "id":3
        },
        {  
            "type":"type level up turret",
            "tick":1100,
            "id":3
        },
        {  
            "type":"type change fixed target turret",
            "tick":1100,
            "id":3
        },
        {  
            "type":"type next wave",
            "tick":1100
        },
        {  
            "type":"type change strategy turret",
            "tick":1155,
            "id":0
        },
        {  
            "type":"type change fixed target turret",
            "tick":1172,
            "id":0
        },
        {  
            "type":"type next wave",
            "tick":1272
        },
        {  
            "type":"type change fixed target turret",
            "tick":1440,
            "id":1
        },
        {  
            "type":"type sell turret",
            "tick":1450,
            "id":2
        },
        {  
            "type":"type sell turret",
            "tick":1450,
            "id":4
        },
        {  
            "type":"type next wave",
            "tick":1450
        },
        {  
            "type":"type sell turret",
            "tick":1640,
            "id":5
        },
        {  
            "type":"type sell turret",
            "tick":1711,
            "id":1
        },
        {  
            "type":"type level up turret",
            "tick":1775,
            "id":3
        },
        {  
            "type":"type sell turret",
            "tick":1788,
            "id":3
        },
        {  
            "type":"type next wave",
            "tick":1788
        },
        {  
            "type":"type sell turret",
            "tick":1901,
            "id":0
        },
        {  
            "type":"type add turret",
            "tick":2019,
            "typeTurret":"projectile",
            "position":{  
                "r":13,
                "c":7
            }
        },
        {  
            "type":"type level up turret",
            "tick":2319,
            "id":8
        },
        {  
            "type":"type level up turret",
            "tick":2323,
            "id":8
        },
        {  
            "type":"type level up turret",
            "tick":2327,
            "id":8
        },
        {  
            "type":"type level up turret",
            "tick":2332,
            "id":8
        },
        {  
            "type":"type level up turret",
            "tick":2337,
            "id":8
        },
        {  
            "type":"type next wave",
            "tick":2406
        },
        {  
            "type":"type sell turret",
            "tick":2478,
            "id":8
        },
        {  
            "type":"type next wave",
            "tick":2748
        },
        {  
            "type":"type next wave",
            "tick":3100
        },
        {  
            "type":"type add turret",
            "tick":3174,
            "typeTurret":"laser",
            "position":{  
                "r":7,
                "c":3
            }
        }
    ]
}

// var args = process.argv.slice(2);
// var logsFile = args[0];

// var rawdata = fs.readFileSync(logsFile);
// var logs = JSON.parse(rawdata);

logs.gameConfig.runningInClientSide = false;

var anutoEngine = new Anuto.Engine(logs.gameConfig, logs.enemiesData, logs.turretsData, logs.wavesData);

while(!anutoEngine.gameOver) {

    while (logs.actions.length && logs.actions[0].tick === anutoEngine.ticksCounter) {

        var action = logs.actions.shift();

        switch(action.type) {
            case TYPE_NEXT_WAVE:
                anutoEngine.newWave();
                break;
            case TYPE_ADD_TURRET:
                anutoEngine.addTurret(action.typeTurret, action.position);
                break;
            case TYPE_SELL_TURRET:
                anutoEngine.sellTurret(action.id);
                break;
            case TYPE_UPGRADE_TURRET:
                anutoEngine.upgradeTurret(action.id);
                break;
            case TYPE_LEVEL_UP_TURRET:
                anutoEngine.improveTurret(action.id);
                break;
            case TYPE_CHANGE_STRATEGY_TURRET:
                anutoEngine.setNextStrategy(action.id);
                break;
            case TYPE_CHANGE_FIXED_TARGET_TURRET:
                anutoEngine.setFixedTarget(action.id);
                break;
            default:
                break;
        }
    }

    anutoEngine.update();
}

console.log("TICKS: " + anutoEngine.ticksCounter);
console.log("SCORE: " + anutoEngine.score);