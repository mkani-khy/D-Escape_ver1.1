export function save(player,enemys,stairs,items,items_p,map,min_map,level){
    const player_data = player;
    const enemys_data = enemys;
    const stairs_data = stairs;
    const item_data = items;
    const item_p_data = items_p;
    const dungeon_data = {
        level: level,
        map: map,
        min_map: min_map
    }
    localStorage.setItem("p_data",JSON.stringify(player_data));
    localStorage.setItem("e_data",JSON.stringify(enemys_data));
    localStorage.setItem("s_data",JSON.stringify(stairs_data));
    localStorage.setItem("i_data",JSON.stringify(item_data));
    localStorage.setItem("i_p_data",JSON.stringify(item_p_data));
    localStorage.setItem("d_data",JSON.stringify(dungeon_data));
    alert("saveされました");
}
export function restart() {
    const p_dataJson = localStorage.getItem("p_data");
    const e_dataJson = localStorage.getItem("e_data");
    const s_dataJson = localStorage.getItem("s_data");
    const i_dataJson = localStorage.getItem("i_data");
    const i_p_dataJson = localStorage.getItem("i_p_data");
    const d_dataJson = localStorage.getItem("d_data");
    if (!p_dataJson || !e_dataJson || !s_dataJson || !i_dataJson || !i_p_dataJson || !d_dataJson) {
        return null;
    }
    const save_pData = JSON.parse(p_dataJson);
    const save_eData = JSON.parse(e_dataJson);
    const save_sData = JSON.parse(s_dataJson);
    const save_iData = JSON.parse(i_dataJson);
    const save_i_pData = JSON.parse(i_p_dataJson);
    const save_dData = JSON.parse(d_dataJson);
    return {
        player: save_pData,
        enemys: save_eData,
        stairs: save_sData,
        items: save_iData,
        items_p: save_i_pData,
        map: save_dData.map,
        min_map: save_dData.min_map,
        level: save_dData.level
    };
}
export function reset() {
    localStorage.removeItem("p_data");
    localStorage.removeItem("e_data");
    localStorage.removeItem("s_data");
    localStorage.removeItem("i_data");
    localStorage.removeItem("i_p_data");
    localStorage.removeItem("d_data");
}