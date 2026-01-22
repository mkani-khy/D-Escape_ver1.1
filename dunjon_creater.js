import { random } from "./character.js";
import { itemImage } from "./setting.js";
//二分空間分割（BSP）法の実装
//枠の生成
export class Rect {
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
//ダンジョンの作成
export function generateDungeon(rect, map ,Min_Size=6) {
    //tf値が入る判定用変数
    let canSplitH = rect.w >= Min_Size *2;
    let canSplitV = rect.h >= Min_Size *2;
    //再帰を用いて部屋に分割
    if (canSplitH || canSplitV){
        let splitH = false;
        if (canSplitH && canSplitV){
            if (rect.w > rect.h*1.25) splitH = false;
            else if (rect.h > rect.w*1.25) splitH = true;
            else splitH = Math.random() > 0.5;
        } else {
            splitH = canSplitV;
        }
        //分割してできた、それぞれの情報をrに
        let r1,r2;
        if (splitH) {
            let splitPos = Math.floor(Math.random()*(rect.h - Min_Size*2)) + Min_Size;
            r1 = new Rect(rect.x, rect.y, rect.w, splitPos);
            r2 = new Rect(rect.x, rect.y + splitPos, rect.w, rect.h - splitPos);
        } else {
            let splitPos = Math.floor(Math.random()*(rect.w - Min_Size*2)) + Min_Size;
            r1 = new Rect(rect.x, rect.y, splitPos, rect.h);
            r2 = new Rect(rect.x + splitPos, rect.y, rect.w - splitPos, rect.h);
        }
        //二つの間に道を生成
        createRoad(map,r1,r2);

        return [...generateDungeon(r1,map,Min_Size), ...generateDungeon(r2,map,Min_Size)];
    } else {
        return [rect]
    }
}
//generateDungeonの道を作る補助関数
function createRoad(map,rect1,rect2) {
    //中心点の座標を求める
    const x1 = Math.floor(rect1.x + rect1.w / 2);
    const y1 = Math.floor(rect1.y + rect1.h / 2);
    const x2 = Math.floor(rect2.x + rect2.w / 2);
    const y2 = Math.floor(rect2.y + rect2.h / 2);

    for (let x = Math.min(x1,x2); x <= Math.max(x1, x2); x++) {
        map[y1][x] = 0;
    }
    for (let y = Math.min(y1,y2); y <= Math.max(y1, y2); y++) {
        map[y][x2] = 0;
    } 
}

export function stairs_place(rooms,enemys) {
    const num = random(rooms.length-6,rooms.length-1);
    const stairs_room = rooms[num];
    const stairs_x = random(stairs_room.x+1,stairs_room.x+stairs_room.w-2);
    const stairs_y = random(stairs_room.y+1,stairs_room.y+stairs_room.h-2);
    for (const enemy of enemys) {
        if (stairs_x === enemy.x) {
            if (stairs_y === enemy.y) {
                stairs_place(rooms,enemys);
            }
        }
    }
    return {stairs_x,stairs_y}
}
export function items_place(rooms,enemys,stairs,image,value) {
    const items = [];
    const items_p = [];
    const item_place_select = () => {
        const {item_x,item_y} = item_place(rooms,enemys,stairs);
        const item_tf = items_p.some(pos => pos[0] === item_x && pos[1] === item_y);
        if (item_tf) {
            return item_place_select();
        }else {
            return {item_x,item_y};
        }
    }
    for (let n=0;n<value;n++) {
        let {item_x,item_y} = item_place_select();
        items.push({x:item_x,y:item_y,img:image,check:false,live:true});
        items_p.push([item_x,item_y]);
    }
    return {items,items_p};
}
export function item_place(rooms,enemys,stairs) {
    const num = random(4,rooms.length-1);
    const item_room = rooms[num];
    const item_x = random(item_room.x+1,item_room.x+item_room.w-2);
    const item_y = random(item_room.y+1,item_room.y+item_room.h-2);
    if (item_x === stairs.x && item_y === stairs.y) stairs_place(rooms,enemys,stairs);
    for (const enemy of enemys) {
        if (item_x === enemy.x) {
            if (item_y === enemy.y) {
                return item_place(rooms,enemys,stairs);
            }
        }
    }
    return {item_x,item_y};
}