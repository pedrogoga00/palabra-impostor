let players = [];
let roles = [];
let currentPlayerIndex = 0;
let secretWord = "";
let clues = [];
let votes = {};
let numImpostors = 1;

// Añadir jugador
function addPlayer() {
    const nameInput = document.getElementById("playerName");
    const name = nameInput.value.trim();
    if (name && !players.includes(name)) {
        players.push(name);
        const li = document.createElement("li");
        li.textContent = name;
        document.getElementById("playersList").appendChild(li);
        nameInput.value = "";
    }
}

// Empezar juego
function startGame() {
    secretWord = document.getElementById("secretWord").value.trim();
    numImpostors = parseInt(document.getElementById("numImpostors").value);
    if (!secretWord || players.length < numImpostors + 1) {
        alert("Agrega suficientes jugadores y palabra secreta");
        return;
    }

    // Asignar roles
    roles = Array(players.length).fill("Tripulante");
    for (let i = 0; i < numImpostors; i++) {
        roles[i] = "Impostor";
    }
    roles = roles.sort(() => Math.random() - 0.5);

    document.getElementById("setup").classList.add("hidden");
    currentPlayerIndex = 0;
    showRole();
}

// Mostrar rol
function showRole() {
    document.getElementById("roleScreen").classList.remove("hidden");
    const roleText = document.getElementById("roleText");
    if (roles[currentPlayerIndex] === "Tripulante") {
        roleText.textContent = `Eres Tripulante. Palabra secreta: ${secretWord}`;
    } else {
        roleText.textContent = `Eres Impostor. No sabes la palabra secreta.`;
    }
}

// Pasar al siguiente jugador
function nextPlayer() {
    currentPlayerIndex++;
    if (currentPlayerIndex < players.length) {
        showRole();
    } else {
        startRound();
    }
}

// Iniciar ronda de pistas
function startRound() {
    document.getElementById("roleScreen").classList.add("hidden");
    document.getElementById("roundScreen").classList.remove("hidden");
    clues = [];
    votes = {};
    document.getElementById("cluesList").innerHTML = "";
    document.getElementById("roundPrompt").textContent = `Todos escriban una pista sobre la palabra secreta.`;
    document.getElementById("voteButton").classList.add("hidden");
}

// Enviar pista
function submitClue() {
    const clueInput = document.getElementById("playerClue");
    const clue = clueInput.value.trim();
    if (!clue) return;
    clues.push(`${players[currentPlayerIndex]}: ${clue}`);
    const li = document.createElement("li");
    li.textContent = `${players[currentPlayerIndex]}: ${clue}`;
    document.getElementById("cluesList").appendChild(li);
    clueInput.value = "";

    currentPlayerIndex++;
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0;
        document.getElementById("voteButton").classList.remove("hidden");
    }
}

// Iniciar votación
function startVoting() {
    document.getElementById("roundScreen").classList.add("hidden");
    document.getElementById("voteScreen").classList.remove("hidden");
    const voteSelect = document.getElementById("voteSelect");
    voteSelect.innerHTML = "";
    players.forEach(p => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = p;
        voteSelect.appendChild(option);
    });
}

// Enviar voto
function submitVote() {
    const voteSelect = document.getElementById("voteSelect");
    const votedPlayer = voteSelect.value;
    votes[votedPlayer] = (votes[votedPlayer] || 0) + 1;

    // Contar votos
    let maxVotes = 0;
    let votedOut = "";
    for (let p in votes) {
        if (votes[p] > maxVotes) {
            maxVotes = votes[p];
            votedOut = p;
        }
    }

    // Mostrar resultado
    document.getElementById("voteScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.remove("hidden");
    const resultText = document.getElementById("resultText");

    if (roles[players.indexOf(votedOut)] === "Impostor") {
        resultText.textContent = `${votedOut} era el impostor. ¡Tripulantes ganan!`;
    } else {
        resultText.textContent = `${votedOut} no era el impostor. ¡Impostor gana!`;
    }
}

// Reiniciar juego
function resetGame() {
    players = [];
    roles = [];
    currentPlayerIndex = 0;
    secretWord = "";
    clues = [];
    votes = {};

    document.getElementById("setup").classList.remove("hidden");
    document.getElementById("roleScreen").classList.add("hidden");
    document.getElementById("roundScreen").classList.add("hidden");
    document.getElementById("voteScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.add("hidden");

    document.getElementById("playersList").innerHTML = "";
    document.getElementById("secretWord").value = "";
    document.getElementById("numImpostors").value = "";
}
