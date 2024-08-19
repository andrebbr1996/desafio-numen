const readline = require("readline");
const choices = ["Pedra", "Papel", "Tesoura"].map((choice) =>
  choice.toLowerCase()
);
let gameState = {
  round: 1,
  wins: 0,
  loss: 0,
  draw: 0,
  gameMode: 0,
  matchHistory: [],
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function menu() {
  resetScore();

  rl.question(
    "Escolha a modalidade: \n'1 - Melhor de 3',\n'2 - Melhor de 5',\n'3 - Melhor de 7',\n'0 - Sair'\n",
    (gameChoice) => {
      const option = parseInt(gameChoice);

      if (isNaN(option) || option < 0 || option > 3) {
        console.log("Opção inválida, tente novamente.");
        return menu();
      }

      if (option === 0) {
        console.log("Saindo do jogo.");
        rl.close();
        return;
      }

      gameState.gameMode = option + 1;
      console.clear();
      jokenpo();
    }
  );
}

function jokenpo() {
  const { wins, loss, gameMode } = gameState;

  if (wins === gameMode || loss === gameMode) {
    showStats();
    showHistory();
    return menu();
  }

  const challengerChoice = choices[Math.floor(Math.random() * choices.length)];
  printGameModeAndStatus();
  console.log(`Round ${gameState.round}`);

  rl.question(`\nEscolha 'Pedra', 'Papel' ou 'Tesoura'\n`, (choice) => {
    choice = choice.toLowerCase();
    if (!choices.includes(choice)) {
      console.log("Opção inválida, tente novamente!");
      return jokenpo();
    }

    const result = matchResult(choice, challengerChoice);
    console.clear();
    printPlayersChoice(result, choice, challengerChoice);

    gameState.round++;
    sumScore(result);
    matchHistoryPush(result, choice, challengerChoice);

    jokenpo();
  });
}

function matchResult(choice, challengerChoice) {
  if (choice === challengerChoice) return "empate";
  return isPlayerWinner(choice, challengerChoice) ? "vitoria" : "derrota";
}

function printGameModeAndStatus() {
  const totalRounds = gameState.gameMode * 2 - 1;
  console.log(
    `\nVocê escolheu melhor de ${totalRounds} - V: ${gameState.wins} L:${gameState.loss} E:${gameState.draw}`
  );
}

function printPlayersChoice(result, choice, challengerChoice) {
  console.log(`\n*****************************\n`);
  console.log(
    `(Você) ${choice} x ${challengerChoice} (Adversário) - ${result}`
  );
  console.log(`\n*****************************`);
}

function isPlayerWinner(choice, challengerChoice) {
  return (
    (choice === "pedra" && challengerChoice === "tesoura") ||
    (choice === "papel" && challengerChoice === "pedra") ||
    (choice === "tesoura" && challengerChoice === "papel")
  );
}

function sumScore(result) {
  if (result === "vitoria") gameState.wins++;
  else if (result === "derrota") gameState.loss++;
  else gameState.draw++;
}

function showStats() {
  const totalGames = gameState.wins + gameState.loss + gameState.draw;
  const winsPercentage = totalGames
    ? ((gameState.wins / totalGames) * 100).toFixed(2)
    : 0;
  const lossPercentage = totalGames
    ? ((gameState.loss / totalGames) * 100).toFixed(2)
    : 0;
  const drawPercentage = totalGames
    ? ((gameState.draw / totalGames) * 100).toFixed(2)
    : 0;

  console.log(`Vitórias: ${gameState.wins} (${winsPercentage}%)`);
  console.log(`Derrotas: ${gameState.loss} (${lossPercentage}%)`);
  console.log(`Empates: ${gameState.draw} (${drawPercentage}%)`);
}

function matchHistoryPush(result, choice, challengerChoice) {
  gameState.matchHistory.push({
    round: gameState.matchHistory.length + 1,
    playerChoice: choice,
    challengerChoice,
    result,
  });
}

function showHistory() {
  console.log("\nHistórico das partidas:");
  gameState.matchHistory.forEach((round) => {
    console.log(
      `\nRodada ${round.round}: (Você) ${round.playerChoice} x ${round.challengerChoice} (Desafiante) - ${round.result}\n`
    );
  });
}

function resetScore() {
  gameState = {
    round: 1,
    wins: 0,
    loss: 0,
    draw: 0,
    gameMode: 0,
    matchHistory: [],
  };
}

menu();
