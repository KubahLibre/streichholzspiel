const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let sticks = 21;
let turn = 1;

function ask() {
  console.log(`\nVerbleibende Hölzchen: ${sticks}`);
  rl.question(`Spieler ${turn}, wie viele ziehst du? (1-3): `, (input) => {
    const n = parseInt(input, 10);

    sticks -= n;
    console.log(`Spieler ${turn} zieht ${n}.`);

    if (sticks === 0) {
      console.log(`\nSpieler ${turn} hat das letzte Hölzchen genommen und verliert!`);
      console.log(`Spieler ${turn === 1 ? 2 : 1} gewinnt.`);
      rl.close();
      return;
    }

    turn = turn === 1 ? 2 : 1;
    ask();
  });
}

console.log('=== Streichholzspiel ===');
console.log('Start: 21 Hölzchen. Jeder Zug: 1-3 Hölzchen. Wer das letzte nimmt, verliert.');
ask();
