import { Rect, generateDungeon,items_place,stairs_place} from "./dunjon_creater.js";
import { playerSet,enemyPlace,enemySet } from "./character.js";
import { tileImage, wallImage,stairsImage,tile_size,canvas_w,canvas_h,view_w,view_h, itemImage } from "./setting.js";
import { updateDisplay } from "./display.js";
import { playerMove, playerAttack, enemyMove,get_item } from "./move.js";
import { save,restart } from "./save.js";
//変数準備
let level = 1;
let move_count = 0;
let map,min_map,dunjonRooms,enemys,stairs,items,items_p,p_i_tf;
//ダンジョン作成からマップの完成まで
function setup() {
    //ダンジョンとマップの作製
    map = Array.from({ length: canvas_h}, () => Array(canvas_w).fill(1));
    min_map = Array.from({ length: canvas_h}, () => Array(canvas_w).fill(0));
    dunjonRooms = generateDungeon(initialRect,map,6);
    dunjonRooms.forEach(area => {
        for (let y = area.y + 1; y < area.y + area.h -1; y++){
            for (let x = area.x + 1; x < area.x + area.w -1; x++){
                map[y][x] = 0;
            }
        }
    });
    //player設定
    const startRoom = dunjonRooms[0];
    player.x = Math.floor(startRoom.x + startRoom.w/2);
    player.y = Math.floor(startRoom.y + startRoom.h/2);
    //enemy設定
    enemys = [];
    for (let number = 0;number<count_enemy;number++) {
        let {enemy_x,enemy_y} = enemyPlace(dunjonRooms);
        let enemy = enemySet(enemy_x,enemy_y,2,1,10);
        enemy.img.src = "character/hellhound.png";
        enemys.push(enemy)
    }
    //stairs設定
    let {stairs_x,stairs_y} = stairs_place(dunjonRooms,enemys);
    stairs = {x:stairs_x,y:stairs_y,img:stairsImage,check:false};
    next_button.style.display = "none";
    //imtesの設定
    const items_value = 5;
    let result = items_place(dunjonRooms,enemys,stairs,itemImage,items_value);
    items = result.items;
    items_p = result.items_p;
    //playerとitemの重なり判定
    p_i_tf = items_p.some(pop => pop[0]===player.x && pop[1]===player.y);
    if (p_i_tf) {
        get_button.style.display = "block";
    } else {
        get_button.style.display = "none";
    }
    //初期化
    if (level === 1){
        Promise.all([
            waitImg(tileImage),
            waitImg(wallImage),
            waitImg(player.img),
            ...enemys.map(enemy => waitImg(enemy.img)),
            waitImg(stairsImage),
            ...items.map(item => waitImg(item.img))
        ]).then(() => {
            updateDisplay(player,enemys,stairs,items,map,min_map,ctx,ctx_min,level);
        });
    } else {
        updateDisplay(player,enemys,stairs,items,map,min_map,ctx,ctx_min,level);
    }
}
//キャンパス設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvas_min = document.getElementById('minimapCanvas');
const ctx_min = canvas_min.getContext('2d');
//キャンパスサイズのタイル適応設定
canvas.width = view_w * tile_size;
canvas.height = view_h * tile_size;
canvas_min.width = canvas_w;
canvas_min.height = canvas_h;
//ダンジョンの枠を設定
const initialRect = new Rect(0,0,canvas_w,canvas_h);
//playerの設定
const charaDataJson = localStorage.getItem("selectedCharacter");
const ply_slc = JSON.parse(charaDataJson);
if (!ply_slc) {
    //キャラクター選択画面へ飛ばす
    window.location.href = "character_select.html";
}
let player = playerSet(ply_slc.hp,ply_slc.mp,ply_slc.atk,ply_slc.def);
player.img.src = ply_slc.img;
player.hp_max = player.hp;
player.mp_max = player.mp;
//敵の設定
let  count_enemy = 5;
//buttonの取得
const next_button = document.getElementById("nextButton");
const save_button = document.getElementById("save");
const get_button = document.getElementById("getItem");
//次の階層へ移動をおこなう関数を用意
const next_starge = () => {
    alert("次の階層へ");
    level++;
    setup();
}
//画像読み込みの確認
const waitImg = (img) => new Promise(resolve => {
    // すでに読み込み終わっている
    if (img.complete) {
        resolve();
    } else {
        // まだ読み込まれていない場合
        img.onload = resolve;
    }
});
//タイトル戻し
const back_link = () => {
    window.location.href = "index.html";
}

//操作
next_button.addEventListener("click",next_starge);
save_button.addEventListener("click",() => {
    save(player,enemys,stairs,items,items_p,map,min_map,level)
});
get_button.addEventListener("click",() => {
    for (const item of items){
        if (item.x!=player.x||item.y!=player.y) continue;
        if (item.live) {
            get_item(player,stairs);
            item.live = false;
            item.check = false;
            const new_items_p = items_p.filter(p => p[0] !== item.x || p[1] !== item.y);
            items_p = new_items_p;
            updateDisplay(player,enemys,stairs,items,map,min_map,ctx,ctx_min,level);
            break
        }
    }
});
document.addEventListener('keydown',(event) => {
    //qが押されたとき
    if (event.key === 'q') {
        back_link();
    }
    //wが押されたとき
    if (event.key === 'w') {
        save(player,enemys,stairs,items,items_p,map,min_map,level);
        return
    }
    //enterが押されたとき
    if (event.key === 'Enter' && next_button.style.display === "block") {
        next_starge();
        return
    }
    //shiftが押されたとき
    if (event.key === 'Shift' && get_button.style.display === "block") {
        for (const item of items){
            if (item.x!=player.x||item.y!=player.y) continue;
            if (item.live) {
                get_item(player,stairs);
                item.live = false;
                item.check = false;
                const new_items_p = items_p.filter(p => p[0] !== item.x || p[1] !== item.y);
                items_p = new_items_p;
                updateDisplay(player,enemys,stairs,items,map,min_map,ctx,ctx_min,level);
                break
            }
        }
        return
    }
    const p_move = playerMove(event.key,player,enemys,map,move_count);
    const p_attack = playerAttack(event.key,player,enemys);
    if (p_move||p_attack) {
        if (player.x === stairs.x && player.y === stairs.y) {
            next_button.style.display = "block";
        } else {
            next_button.style.display = "none";
        }
        p_i_tf = items_p.some(pop => pop[0]===player.x&&pop[1]===player.y);
        if (p_i_tf) {
            get_button.style.display = "block"
        } else {
            get_button.style.display = "none";
        }
        let frame = 20;
        const animateFlash = ()=>{
            updateDisplay(player,enemys,stairs,items,map,min_map,ctx,ctx_min,level);
            if (frame > 0 ){
                frame--;
                requestAnimationFrame(animateFlash);
            }
        }
        animateFlash();
    }
    if (!p_attack && move_count%3 === 0) {
        enemyMove(player,enemys,stairs,items_p,map);
        updateDisplay(player,enemys,stairs,items,map,min_map,ctx,ctx_min,level);
    }
})
//最初の読み込み
const link = new URLSearchParams(window.location.search);
const mode = link.get('mode');
if (mode === 'A') {
    setup();
} else if (mode === 'B'){
    const load_data = restart();

    if (load_data) {
        //変数を上書き
        player = load_data.player;
        enemys = load_data.enemys;
        stairs = load_data.stairs;
        items = load_data.items;
        items_p = load_data.items_p;
        map = load_data.map;
        min_map = load_data.min_map;
        level = load_data.level;
        //Player画像の復元
        player.img = new Image();
        player.img.src = ply_slc.img;
        //Enemy画像の復元
        enemys.forEach(enemy => {
            enemy.img = new Image();
            enemy.img.src = "character/hellhound.png";
        });
        //Stairs画像の復元
        stairs.img = stairsImage;
        //item画像の復元
        items.forEach(item => {
            item.img = itemImage;
        });
        // 画像の読み込みを待ってから表示更新
        Promise.all([
            waitImg(tileImage),
            waitImg(wallImage),
            waitImg(player.img),
            ...enemys.map(enemy => waitImg(enemy.img)),
            waitImg(stairsImage),
            ...items.map(item => waitImg(item.img))
        ]).then(() => {
            updateDisplay(player,enemys,stairs,items,map,min_map,ctx,ctx_min,level);
            // ロード時はボタンの表示状態なども復元する必要があります（簡易的な判定）
            if (player.x === stairs.x && player.y === stairs.y) {
                next_button.style.display = "block";
            } else {
                next_button.style.display = "none";
            }
            p_i_tf = items_p.some(pop => pop[0]===player.x&&pop[1]===player.y);
            if (p_i_tf) {
                get_button.style.display = "block";
            } else {
                get_button.style.display = "none";
            }
        });
    } else {
        setup();
    }
}