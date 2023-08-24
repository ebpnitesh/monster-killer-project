const ATTACK_VALUE = 10;//attack value is constant which will not change.
let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function attackHandler(){
    const damage = dealMonsterDamage(ATTACK_VALUE);
    currentMonsterHealth -= damage;
}

attackBtn.addEventListener('click',attackHandler);