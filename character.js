//ランダムな整数を返す
export function random(mi,ma){
    return Math.floor(Math.random()*(ma-mi+1))+mi
}
//playerの情報set関数
export function playerSet(hitpoint=100,magicpoint=100,attack=1,defence=1,X=0,Y=0){
    return {x:X,y:Y,atk:attack,def:defence,hp:hitpoint,mp:magicpoint,img:new Image()} 
}
//enemyの座標選択
export function enemyPlace(rooms) {
    const num = random(1,rooms.length-1);
    const spornRoom = rooms[num];
    let enemy_x = random(spornRoom.x+1,spornRoom.x+spornRoom.w-2);
    let enemy_y = random(spornRoom.y+1,spornRoom.y+spornRoom.h-2);
    return {enemy_x,enemy_y}
}
//enemyの情報set関数
//checkはminiマップに書くかどうかの判断用変数
//liveは生存判断
export function enemySet(X,Y,attack,defence,hitpoint,check=false,live=true) {
    return {x:X,y:Y,atk:attack,def:defence,hp:hitpoint,img:new Image(),check:check,live:live}
}
//hpバーとmpバーの管理
export function updatebar(id,current,max) {
    const percent = (current / max) * 100;
    document.getElementById(id).style.width = percent + "%";
}