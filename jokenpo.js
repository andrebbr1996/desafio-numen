const readline = require("readline");
const choices = ["Pedra", "Papel", "Tesoura"].map((choice) =>
  choice.toLowerCase()
);
let round = 1;
let result;
let wins = 0;
let loss = 0;
let draw = 0;
let gameMode = 0;
let matchHistory = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function menu() {
  resetScore();

  rl.question(
    "Escolha a modalidade: \n'1 - Melhor de 3',\n'2 - Melhor de 5',\n'3 - Melhor de 7',\n'0 - Sair'\n",
    (gameChoice) => {
      option = parseInt(gameChoice);

      switch (option) {
        case 1:
          gameMode = 2;
          console.clear();
          jokenpo();
          break;

        case 2:
          gameMode = 3;
          console.clear();
          jokenpo();
          break;

        case 3:
          gameMode = 4;
          console.clear();
          jokenpo();
          break;

        case 0:
          console.log("Saindo do jogo.");
          rl.close();
          return;

        default:
          console.log("Opção inválida, tente novamente.");
          menu();
      }
    }
  );
}

function jokenpo() {
  if (wins == gameMode || loss == gameMode) {
    showStats();
    showHistory();
    menu();
    return;
  }

  const challengerChoice = choices[Math.floor(Math.random() * choices.length)];
  printGameModeAndStatus(gameMode);
  console.log(`Round ${round}`);
  rl.question(`\nEscolha 'Pedra', 'Papel' ou 'Tesoura'\n`, (choice) => {
    choice = choice.toLowerCase();
    if (!choices.includes(choice)) {
      console.log("Opção inválida, tente novamente!");
      jokenpo();
    } else {
      result = matchResult(choice, challengerChoice);
      console.clear();
      printPlayersChoice(result, choice, challengerChoice);
      round++;
      sumScore(result, choice, challengerChoice);
      matchHistoryPush(result, choice, challengerChoice);

      jokenpo();
    }
  });
}

function matchResult(choice, challengerChoice) {
  let roundWin = isPlayerWinner(choice, challengerChoice);
  if (choice === challengerChoice) {
    result = "empate";
  } else if (roundWin) {
    result = "vitoria";
  } else {
    result = "derrota";
  }

  return result;
}
function printGameModeAndStatus(gameMode) {
  switch (gameMode) {
    case 2:
      console.log(
        `\nvocê escolheu melhor de ${
          gameMode + 1
        } - V: ${wins} L:${loss} E:${draw}`
      );
      break;
    case 3:
      console.log(
        `\nvocê escolheu melhor de ${
          gameMode + 2
        } - V: ${wins} L:${loss} E:${draw}`
      );
      break;
    case 4:
      console.log(
        `\nvocê escolheu melhor de ${
          gameMode + 3
        } - V: ${wins} L:${loss} E:${draw}`
      );
      break;
  }
}

function printPlayersChoice(result, choice, challengerChoice) {
  console.log(`JO...\nKEN...\nPO!`);
  console.log(`\n*****************************\n`);
  console.log(
    `(Você) ${choice} x ${challengerChoice} (Adversário) - ${result}`
  );
  console.log(`\n*****************************`);
}

function isPlayerWinner(choice, challengerChoice) {
  if (
    (choice === "pedra" && challengerChoice === "tesoura") ||
    (choice === "papel" && challengerChoice === "pedra") ||
    (choice === "tesoura" && challengerChoice === "papel")
  ) {
    return 1;
  }
  return 0;
}

function sumScore(result, choice, challengerChoice) {
  switch (result) {
    case "vitoria":
      wins++;
      break;
    case "derrota":
      loss++;
      break;
    default:
      draw++;
  }
}

function showStats() {
  const totalGames = wins + loss + draw;
  const winsPercentage = totalGames
    ? ((wins / totalGames) * 100).toFixed(2)
    : 0;
  const lossPercentage = totalGames
    ? ((loss / totalGames) * 100).toFixed(2)
    : 0;
  const drawPercentage = totalGames
    ? ((draw / totalGames) * 100).toFixed(2)
    : 0;

  console.log(`Vitórias: ${wins} (${winsPercentage}%)`);
  console.log(`Derrotas: ${loss} (${lossPercentage}%)`);
  console.log(`Empates: ${draw} (${drawPercentage}%)`);
}

function matchHistoryPush(result, choice, challengerChoice) {
  matchHistory.push({
    round: matchHistory.length + 1,
    playerChoice: choice,
    challengerChoice: challengerChoice,
    result: result,
  });
}

function showHistory() {
  console.log("\nHistórico das partidas:");
  matchHistory.forEach((round) => {
    console.log(
      `\nRodada ${round.round}: (Você) ${round.playerChoice} x ${round.challengerChoice} (Desafiante) - ${round.result}\n`
    );
  });
}

function resetScore() {
  round = 1;
  wins = 0;
  loss = 0;
  draw = 0;
  gameMode = 0;
  matchHistory = [];
}

menu();
