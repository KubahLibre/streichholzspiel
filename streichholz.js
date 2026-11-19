const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let sticks = 21;
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

function ask() {
  if (mode === 'computer' && turn === 2) {
    return computerTurn();
  }

  console.log(`\nVerbleibende Hölzchen: ${sticks}  ${drawSticks(sticks)}`);
  rl.question(`Spieler ${turn}, wie viele ziehst du? (1-3): `, (input) => {
    const n = parseInt(String(input).trim(), 10);

    if (isNaN(n) || n < 1 || n > 3 || n > sticks) {
      console.log('Ungültige Eingabe. Bitte eine Zahl von 1 bis 3 eingeben (nicht mehr als verbleiben).');
      return ask();
    }

    sticks -= n;
    console.log(`Spieler ${turn} zieht ${n}.`);

    if (sticks === 0) {
      ended = true;
      console.log(`\nSpieler ${turn} hat das letzte Hölzchen genommen und verliert!`);
      console.log(`Spieler ${turn === 1 ? 2 : 1} gewinnt.`);
      rl.close();
      return;
    }

    if (sticks < 1) {
      ended = true;
      console.log(`\nSpieler ${turn === 1 ? 2 : 1} kann nicht ziehen und verliert!`);
      console.log(`Spieler ${turn} gewinnt.`);
      rl.close();
      return;
    }

    turn = turn === 1 ? 2 : 1;
    ask();
  });
}

function computerTurn() {
  console.log(`\nVerbleibende Hölzchen: ${sticks}  ${drawSticks(sticks)}`);
  const cap = Math.min(3, sticks);
  const minD = 1;
  const n = minD + Math.floor(Math.random() * (cap - minD + 1));
  sticks -= n;
  console.log(`Computer zieht ${n}.`);

  if (sticks === 0) {
    ended = true;
    console.log(`\nComputer hat das letzte Hölzchen genommen und verliert!`);
    console.log('Du gewinnst.');
    rl.close();
    return;
  }

  if (sticks < 1) {
    ended = true;
    console.log(`\nComputer kann nicht ziehen und verliert!`);
    console.log('Du gewinnst.');
    rl.close();
    return;
  }

  turn = 1;
  ask();
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
    selectMode();
  });
}

start();