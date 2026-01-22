//タイル画像の読み込み
//洞窟
const tile1 = new Image();
tile1.src = "D_image/tile1-1.jpg";
const wall1 = new Image();
wall1.src = "D_image/wall1.png";
const stairs1 = new Image();
stairs1.src = "D_image/stairs1.jpg";
//草原
const tile2 = new Image();
tile2.src = "D_image/tile2.png";
const wall2 = new Image();
wall2.src = "D_image/wall2.png";
const stairs2 = new Image();
stairs2.src = "D_image/stairs2-2.jpg";
//アイテム
const item1 = new Image();
item1.src = "image/treasure-box.png";
//用いる画像
export let tileImage = tile2;
export let wallImage = wall2;
export let stairsImage = stairs2;
export let itemImage = item1;
//タイルサイズ
export const tile_size = 28;
//タイル数
export const canvas_w = 50;
export const canvas_h = 50;
//カメラの設定
export const view_w = 15;
export const view_h = 15;
//キャンパスの設定用
export const c_w = view_w*tile_size;
export const c_h = view_h*tile_size;
