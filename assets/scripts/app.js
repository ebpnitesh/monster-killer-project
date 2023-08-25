const ATTACK_VALUE = 10;//attack value is constant which will not change.
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';//MODE_ATTACK=0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';//MODE_STRONG_ATTACK=1
/** For the log **/
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const enteredValue = prompt('Maximum life for you and the monster','100');

let chosenMaxLife = parseInt(enteredValue);

//variable for the log
let battlelog = [];

if(isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

//Logging all the events in the game
function writeToLog(ev, val, monsterHealth, playerHealth){
    let logEntry = {
        event : ev,
        value : val,
        target : 'MONSTER',
        finalMonsterHealth : monsterHealth,
        finalPlayerHealth: playerHealth
    };

    switch(ev){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event : ev,
                value : val,
                target : 'MONSTER',
                finalMonsterHealth : monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event : ev,
                value : val,
                target : 'PLAYER',
                finalMonsterHealth : monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event : ev,
                value : val,
                target : 'PLAYER',
                finalMonsterHealth : monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event : ev,
                value : val,
                finalMonsterHealth : monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        default:
            logEntry = {};
    }
    //rewrite different event to the log
    // if(ev == LOG_EVENT_PLAYER_ATTACK){
    //     logEntry.target = 'MONSTER';
    // }else if (ev == LOG_EVENT_PLAYER_STRONG_ATTACK){
    //     logEntry = {
    //         event : ev,
    //         value : val,
    //         target : 'MONSTER',
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }else if (ev == LOG_EVENT_MONSTER_ATTACK){
    //     logEntry = {
    //         event : ev,
    //         value : val,
    //         target : 'PLAYER',
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }else if (ev == LOG_EVENT_PLAYER_HEAL){
    //     logEntry = {
    //         event : ev,
    //         value : val,
    //         target : 'PLAYER',
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }else if(ev == LOG_EVENT_GAME_OVER){
    //     logEntry = {
    //         event : ev,
    //         value : val,
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }
    battlelog.push(logEntry);
}

function reset(){
    currentMonsterHealth =  chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,currentMonsterHealth,currentPlayerHealth);

    if(currentPlayerHealth <=0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert('You would be dead but the bonus life saved you!');
        setPlayerHealth(initialPlayerHealth);
    }

    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert('You won!');
        writeToLog(LOG_EVENT_GAME_OVER,'PLAYER_WON',currentMonsterHealth,currentPlayerHealth);
    }else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert('You Lost');
        writeToLog(LOG_EVENT_GAME_OVER,'MONSTER_WON',currentMonsterHealth,currentPlayerHealth);
    }else if(currentPlayerHealth <=0 && currentMonsterHealth <= 0){
        alert('You have a draw');
        writeToLog(LOG_EVENT_GAME_OVER,'A DRAW',currentMonsterHealth,currentPlayerHealth);

    }

    if(currentMonsterHealth<= 0 && currentPlayerHealth > 0 || currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        reset();
    }
}

//To reduce the code duplication adding the new function
function attackMonster(mode){
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE:STRONG_ATTACK_VALUE;
    let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK; 
    // if(mode === MODE_ATTACK){
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // }else if(mode === MODE_STRONG_ATTACK){
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logEvent,damage,currentMonsterHealth,currentPlayerHealth);
    endRound();
}

function attackHandler(){
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler(){
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert('You can\'t heal to more than your max initial health');
        healValue = chosenMaxLife - currentPlayerHealth;
    } else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    //Updating the current player health
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);
    endRound();//code reused
}

function printLogHandler(){
    // for(let i =0;i<3;i++){
    //     console.log('---');
    // }
    // for(let i = 0; i<battlelog.length;i++){
    //     console.log(battlelog[i]);
    // }
    let i=0;
    for(const logEntry of battlelog){
        console.log(logEntry);
        console.log(1);
        i++;
    }
}

attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);