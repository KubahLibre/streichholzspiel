const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let sticks = 21;
let minDraw = 1;
let maxDraw = 3;
let turn = 1;
let ended = false;
let mode = 'human';

function drawSticks(n) {
  return '|'.repeat(n);
}

function askInt(question, validate, errorMsg, cb) {
  rl.question(question, (input) => {
    const n = parseInt(String(input).trim(), 10);
    if (isNaN(n) || !validate(n)) {
      console.log(errorMsg);
      return askInt(question, validate, errorMsg, cb);
    }
    cb(n);
  });
}

function finishMove(mover) {
  if (sticks === 0) {
    ended = true;
    console.log(`\nSpieler ${mover} hat das letzte Hölzchen genommen und verliert!`);
    console.log(`Spieler ${mover === 1 ? 2 : 1} gewinnt.`);
    rl.close();
    return true;
  }
  if (sticks < minDraw) {
    ended = true;
    console.log(`\nSpieler ${mover === 1 ? 2 : 1} kann nicht ziehen (min. ${minDraw}) und verliert!`);
    console.log(`Spieler ${mover} gewinnt.`);
    rl.close();
    return true;
  }
  return false;
}

function computerTurn() {
  console.log(`\nVerbleibende Hölzchen: ${sticks}  ${drawSticks(sticks)}`);
  const cap = Math.min(maxDraw, sticks);
  const minD = Math.min(minDraw, sticks);
  const n = minD + Math.floor(Math.random() * (cap - minD + 1));
  sticks -= n;
  console.log(`Computer zieht ${n}.`);
  if (finishMove(2)) return;
  turn = 1;
  ask();
}

function ask() {
  if (mode === 'computer' && turn === 2) {
    return computerTurn();
  }
  console.log(`\nVerbleibende Hölzchen: ${sticks}  ${drawSticks(sticks)}`);
  rl.question(`Spieler ${turn}, wie viele ziehst du? (${minDraw}-${maxDraw}): `, (input) => {
    const n = parseInt(String(input).trim(), 10);
    if (isNaN(n) || n < minDraw || n > maxDraw || n > sticks) {
      console.log(`Ungültige Eingabe. Bitte ${minDraw} bis ${maxDraw} eingeben (nicht mehr als verbleiben).`);
      return ask();
    }
    sticks -= n;
    console.log(`Spieler ${turn} zieht ${n}.`);
    if (finishMove(turn)) return;
    turn = turn === 1 ? 2 : 1;
    ask();
  });
}

rl.on('close', () => {
  if (!ended) {
    console.log('\nSpiel abgebrochen.');
  }
});

function selectMode() {
  rl.question('Modus: (1) gegen Menschen  (2) gegen Computer: ', (input) => {
    const m = parseInt(String(input).trim(), 10);
    if (m !== 1 && m !== 2) {
      console.log('Ungültige Eingabe. Bitte 1 oder 2 eingeben.');
      return selectMode();
    }
    mode = m === 2 ? 'computer' : 'human';
    console.log(mode === 'computer' ? 'Modus: gegen Computer. Du bist Spieler 1.' : 'Modus: zwei Spieler.');
    ask();
  });
}

function start() {
  console.log('=== Streichholzspiel ===');
  askInt('Start-Streichhölzer (z. B. 21): ', (n) => n >= 1, 'Bitte eine Zahl >= 1 eingeben.', (s) => {
    sticks = s;
    askInt('Min. pro Zug (z. B. 1): ', (n) => n >= 1 && n <= sticks, 'Bitte 1 bis ' + sticks + ' eingeben.', (mn) => {
      minDraw = mn;
      askInt('Max. pro Zug (z. B. 3): ', (n) => n >= minDraw, 'Bitte >= ' + minDraw + ' eingeben.', (mx) => {
        maxDraw = mx;
        selectMode();
      });
    });
  });
}

start();