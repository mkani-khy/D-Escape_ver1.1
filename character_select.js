import { swordsman,sorcerer } from ".charadata.js";

const back_link = () => {
    window.location.href = "D-Escape_ver1.1/index.html"
}
const go_game = () => {
    window.location.href = "D-Escape_ver1.1/game.thml"
}
document.addEventListener('keydown',(event) => {
    if (event.key === 'q') {
        back_link();
    }
    if (event.key === 'eneter') {
        go_game();
    }
})

function state_write(chara){
    document.getElementById("set_chara").innerText = chara.name;
    document.getElementById("set_hp").innerText = chara.hp;
    document.getElementById("set_mp").innerText = chara.mp;
    document.getElementById("set_atk").innerText = chara.atk;
    document.getElementById("set_def").innerText = chara.def;
}
let select_chara_state = swordsman;
swordsman.key = document.getElementById('chara_select_swordsman');
sorcerer.key = document.getElementById('chara_select_sorcerer');
const select_key = document.getElementById('select');

swordsman.key.addEventListener('click',()=>{
    state_write(swordsman);
    select_chara_state = swordsman;
});
sorcerer.key.addEventListener('click',()=>{
    state_write(sorcerer);
    select_chara_state = sorcerer;
});
select_key.addEventListener('click',()=>{
    const saveData = {
        name: select_chara_state.name,
        hp: select_chara_state.hp,
        mp: select_chara_state.mp,
        atk: select_chara_state.atk,
        def: select_chara_state.def,
        img: select_chara_state.img
    };
    localStorage.setItem("selectedCharacter", JSON.stringify(saveData));
    alert(saveData.name + " を選択しました！");
})




