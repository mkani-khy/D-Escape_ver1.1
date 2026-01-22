import { tileImage,wallImage,tile_size,canvas_w,canvas_h,view_w,view_h,c_w,c_h } from "./setting.js";
import { updatebar } from "./character.js";
import { reset } from "./save.js";
//読み込み関数
export function updateDisplay(player,enemys,stairs,items,map,min_map,ctx,ctx_min,level) {
    ctx.clearRect(0, 0, c_w, c_h);
    ctx_min.clearRect(0,0,canvas_w,canvas_h);
    //カメラの左上座標を計算&制限
    let camera_x = player.x - Math.floor(view_w/2);
    camera_x = Math.max(0, Math.min(camera_x,canvas_w - view_w));
    let camera_y = player.y - Math.floor(view_h/2);
    camera_y = Math.max(0,Math.min(camera_y, canvas_h - view_h));

    //表示内のみ描画
    for (let screen_y = 0; screen_y < view_h; screen_y++) {
        for (let screen_x = 0; screen_x < view_w; screen_x++) {
            const map_x = camera_x + screen_x;
            const map_y = camera_y + screen_y;
            const tile = map[map_y][map_x];
            min_map[map_y][map_x] = 1;

            let img = (tile === 0) ? tileImage : wallImage;

            ctx.drawImage(img,screen_x*tile_size,screen_y*tile_size,tile_size,tile_size);
        }
    }

    //プレイヤーをカメラ相対位置で描画
    const playerScreen_x = player.x - camera_x;
    const playerScreen_y = player.y - camera_y;
    const playerDamageText = "-"+player.damage_value;
    ctx.drawImage(player.img,
        playerScreen_x * tile_size,
        playerScreen_y * tile_size,
        tile_size,
        tile_size
    );
    if (player.flash_count && player.flash_count > 0){
        ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
        ctx.fillRect(
            playerScreen_x * tile_size,
            playerScreen_y * tile_size,
            tile_size,
            tile_size
        );
        player.flash_count--;
    };
    if (player.damage_display_count) {
        //敵の少し上に表示
        const player_textY = (playerScreen_y * tile_size) - 5 - (20 - player.damage_display_count);
        const player_textX = (playerScreen_x * tile_size) + (tile_size / 2);
        //ダメージ表示文字の縁取り
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.strokeText(playerDamageText, player_textX, player_textY);
        //ダメージ表示の文字設定
        ctx.fillStyle = "white";
        ctx.fillText(playerDamageText,player_textX,player_textY);

        player.damage_display_count--;
    }

    //敵をカメラ相対位置で描画
    enemys.forEach(enemy => {
        const enemyScreen_x = enemy.x - camera_x;
        const enemyScreen_y = enemy.y - camera_y;
        const enemyDamageText = "-"+enemy.damage_value;

        if (enemy.live){
            if (enemyScreen_x >= 0 && enemyScreen_x < view_w && enemyScreen_y >= 0 && enemyScreen_y < view_h) {
                enemy.check = true;
                ctx.drawImage(enemy.img,
                    enemyScreen_x * tile_size,
                    enemyScreen_y * tile_size,
                    tile_size,
                    tile_size
                );
                if (enemy.flash_count > 0){
                    ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
                    ctx.fillRect(
                        enemyScreen_x * tile_size,
                        enemyScreen_y * tile_size,
                        tile_size,
                        tile_size
                    );
                    enemy.flash_count--;
                }
                if (enemy.damage_display_count) {
                    //敵の少し上に表示
                    const enemy_textY = (enemyScreen_y * tile_size) - 5 - (20 - enemy.damage_display_count);
                    const enemy_textX = (enemyScreen_x * tile_size) + (tile_size / 2);
                    //ダメージ表示文字の縁取り
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 3;
                    ctx.lineJoin = "round";
                    ctx.strokeText(enemyDamageText, enemy_textX, enemy_textY);
                    //ダメージ表示の文字設定
                    ctx.fillStyle = "white";
                    ctx.fillText(enemyDamageText,enemy_textX,enemy_textY);

                    enemy.damage_display_count--;
                }
            };
        }
    })
    //stairsの描画
    const stairsScreen_x = stairs.x - camera_x;
    const stairsScreen_y = stairs.y - camera_y;
    if (stairsScreen_x >= 0 && stairsScreen_x < view_w && stairsScreen_y >= 0 && stairsScreen_y < view_h) {
        stairs.check = true;
        ctx.drawImage(stairs.img,
            stairsScreen_x * tile_size,
            stairsScreen_y * tile_size,
            tile_size,
            tile_size
        );
    }
    //itemの描画
    items.forEach(item => {
        const itemScreen_x = item.x - camera_x;
        const itemScreen_y = item.y - camera_y;

        if (item.live){
            if (itemScreen_x >= 0 && itemScreen_x < view_w && itemScreen_y >= 0 && itemScreen_y < view_h) {        
                item.check = true;
                ctx.drawImage(item.img,
                    itemScreen_x * tile_size,
                    itemScreen_y * tile_size,
                    tile_size,
                    tile_size
                );
            }
        }
    })

    //mini mapの描画
    for (let miniscreen_y = 0; miniscreen_y < canvas_h;miniscreen_y++) {
        for (let miniscreen_x = 0; miniscreen_x < canvas_w;miniscreen_x++) {
            if (min_map[miniscreen_y][miniscreen_x] === 1){
                if (map[miniscreen_y][miniscreen_x] === 0) {
                    ctx_min.fillStyle = "#888";
                    ctx_min.fillRect(miniscreen_x,miniscreen_y,1,1);
                }
            }
        }
    }
    //mini mapでのプレイヤーの表示
    ctx_min.fillStyle = "white";
    ctx_min.fillRect(player.x,player.y,1,1);
    //mini mapでの敵の表示
    enemys.forEach(enemy => {
        if (enemy.check) {
            if (enemy.live){
                ctx_min.fillStyle = "red";
                ctx_min.fillRect(enemy.x,enemy.y,1,1);
            }
        }
    });
    //mini map上での階段の表示
    if (stairs.check) {
        ctx_min.fillStyle = "blue";
        ctx_min.fillRect(stairs.x,stairs.y,1,1);       
    }
    //mini　map上でのアイテムの表示
    items.forEach(item => {
        if (item.check) {
            ctx_min.fillStyle = "green";
            ctx_min.fillRect(item.x,item.y,1,1);
    }
    })
    //uiのspan情報の更新
    document.getElementById("level").innerText = level;
    document.getElementById("hp_max").innerText = player.hp_max;
    document.getElementById("hp_cur").innerText = player.hp;
    document.getElementById("mp_max").innerText = player.mp_max;
    document.getElementById("mp_cur").innerText = player.mp;
    //hp/mpバーの更新
    updatebar("hp-bar",player.hp,player.hp_max);
    updatebar("mp-bar",player.mp,player.mp_max);
    //player死亡時
    if (player.hp <= 0) {
        alert("hpが0になりました")
        reset();
        window.location.href = "/index light.html" 
    }
}