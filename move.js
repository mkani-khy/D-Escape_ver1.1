import { random } from "./character.js";

//playerの移動管理
export function playerMove(key,player,enemys,map,count) {
    let next_x = player.x;
    let next_y = player.y;
    //キー取得
    switch (key) {
        case 'ArrowUp':    next_y--; break;
        case 'ArrowDown':  next_y++; break;
        case 'ArrowLeft':  next_x--; break;
        case 'ArrowRight': next_x++; break;
        default: return false;
    }
    //当たり判定
    for (const enemy of enemys){
        if (enemy.x === next_x){
            if (enemy.y === next_y){
                if (enemy.live){
                    return false;
                }
            }
        }
    };
    if (map[next_y] && map[next_y][next_x] === 0) {
        player.x = next_x;
        player.y = next_y;
        count++;
        return true;
    }
    return false;
}

export function playerAttack(key,player,enemys) {
    let attack_mult = 0;
    switch (key) {
            case 'a': attack_mult=1; break;
            case 's': attack_mult=2; break;
            case 'd': attack_mult=3; break
            default: return false;
        }
    if (attack_mult != 0){
        let hit_any = false;
        for (const enemy of enemys){
            //死んでる敵は無視
            if (enemy.live===false) continue;
            
            const attack_succes = Math.abs(enemy.x - player.x) <= 1 && Math.abs(enemy.y - player.y) <= 1;
            if (attack_succes){
                enemy.hp -= player.atk * attack_mult;
                enemy.flash_count = 10;
                enemy.damage_value = player.atk * attack_mult;
                enemy.damage_display_count = 15;
                hit_any = true;
                
                if (enemy.hp <= 0) {
                    alert("撃破しました！")
                    enemy.live = false;
                    enemy.hp = 0;
                }
            }
        }
        // プレイヤーのターン終了後に敵の攻撃
        if(hit_any){
            enemyAttack(player,enemys);
        }

        return hit_any;
    }
    return hit_any;
}

export function enemyMove(player,enemys,stairs,items_p,map) {
    let not_move_place = [[player.x,player.y],[stairs.x,stairs.y]];
    not_move_place.push(...items_p);
    for (const enemy of enemys) {
        //死んでいる敵は移動不可
        if (!enemy.live) continue;

        let enemy_arround = {x:enemy.x-1,y:enemy.y-1,w:3,h:3};
        for (let y = enemy_arround.y;y<enemy_arround.y+enemy_arround.h;y++) {
            for (let x = enemy_arround.x;x<enemy_arround.x+enemy_arround.w;x++) {
                if (map[y] && map[y][x] === 1) {
                    not_move_place.push([x,y]);
                }
            }
        }
        const next_place = () => {
            let next_x = enemy.x + random(1,3) - 2;
            let next_y = enemy.y + random(1,3) - 2;
            const place_tf = not_move_place.some(pos => pos[0] === next_x && pos[1] === next_y);
            if (place_tf) {
                return next_place();
            } else {
                return {next_x,next_y};
            }
        }
        const {next_x,next_y} = next_place();
        enemy.x = next_x;
        enemy.y = next_y;
    }
}

function enemyAttack(player,enemys) {
    player.damage_value = 0;
    let player_first_hp = player.hp; 
    
    for (const enemy of enemys) {
        //死んでいる敵は攻撃不可
        if (!enemy.live) continue;
        const attack_succes = Math.abs(player.x - enemy.x) <= 1 && Math.abs(player.y - enemy.y) <= 1;
        if (!attack_succes) continue;
        let next_hp = player.hp; 
        
        let attack = random(1,100);
        const enemy_attack = (bath) => {
            next_hp -= enemy.atk*bath;
            if (next_hp < 0) {
                next_hp = 0;
            }
        }
        if (attack >= 50) {
            if (attack >= 95) {
                enemy_attack(3);
            } else if (attack >= 85) {
                enemy_attack(2);
            } else {
                enemy_attack(1);
            }
        }
        player.hp = next_hp;
    }
    if (player_first_hp != player.hp){
        player.flash_count = 10;
        player.damage_value = player_first_hp - player.hp;
        player.damage_display_count = 15;
    }
}
export function get_item(player,stairs) {
    const num = random(1,100);
    if (num >= 70) {
        if (num >= 90) {
            player.hp += 20;
        } else if (num >= 80) {
            player.hp += 10;
        } else {
            player.hp += 5;
        }
        if (player.hp > player.hp_max) {
            player.hp = player.hp_max;
        }
        alert("hpが増えた")
    } else if (num >= 40) {
        if (num >= 90) {
            player.mp += 20;
        } else if (num >= 80) {
            player.mp += 10;
        } else {
            player.mp += 5;
        }
        if (player.mp > player.mp_max) {
            player.mp = player.mp_max;
        }
        alert("mpが増えた")
    } else if (num >= 25) {
        if (num >= 35) {
            player.hp -= 10;
        } else {
            player.hp -= 5;
        }
        if (player.hp < 0){
            player.hp = 0;
        }
        alert("hpが減った")
    } else if (num >= 2) {
        alert("何も起きなかった")
    } else {
        player.x = stairs.x;
        player.y = stairs.y;
    }
}