const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let sticks = 21;
let turn = 1;
let ended = false;
let mode = 'human';
let difficulty = 1;

function drawSticks(n) {
  return '|'.repeat(n);
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

    turn = turn === 1 ? 2 : 1;
    ask();
  });
}

function optimalMove(sticks) {
  const cap = Math.min(3, sticks);
  for (let n = 1; n <= cap; n++) {
    if ((sticks - n) % 4 === 1) return n;
  }
  return null;
}

function computerTurn() {
  console.log(`\nVerbleibende Hölzchen: ${sticks}  ${drawSticks(sticks)}`);
  const cap = Math.min(3, sticks);
  const minD = 1;
  let n;
  const optimal = optimalMove(sticks);
  const prob = difficulty === 3 ? 1 : difficulty === 2 ? 0.5 : 0;
  if (optimal !== null && Math.random() < prob) {
    n = optimal;
  } else {
    n = minD + Math.floor(Math.random() * (cap - minD + 1));
  }
  if (n < minD) n = minD;
  if (n > cap) n = cap;
  sticks -= n;
  console.log(`Computer zieht ${n}.`);

  if (sticks === 0) {
    ended = true;
    console.log(`\nComputer hat das letzte Hölzchen genommen und verliert!`);
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
    if (mode === 'computer') {
      rl.question('Schwierigkeit: (1) leicht  (2) mittel  (3) schwer: ', (input) => {
        const d = parseInt(String(input).trim(), 10);
        if (d !== 1 && d !== 2 && d !== 3) {
          console.log('Ungültige Eingabe. Bitte 1, 2 oder 3 eingeben.');
          return selectMode();
        }
        difficulty = d;
        console.log('Modus: gegen Computer. Du bist Spieler 1.');
        ask();
      });
    } else {
      console.log('Modus: zwei Spieler.');
      ask();
    }
  });
}

console.log('=== Streichholzspiel ===');
console.log('Start: 21 Hölzchen. Jeder Zug: 1-3 Hölzchen. Wer das letzte nimmt, verliert.');
selectMode();