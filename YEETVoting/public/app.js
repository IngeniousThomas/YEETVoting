// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZ9Rkp_kistx9aHYk_0dhhWSUSzEUWIBM",
    authDomain: "yeetvoting.firebaseapp.com",
    databaseURL: "https://yeetvoting-default-rtdb.firebaseio.com",
    projectId: "yeetvoting",
    storageBucket: "yeetvoting.appspot.com",
    messagingSenderId: "296255286450",
    appId: "1:296255286450:web:e8853efa58a550822c6dab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let currentQuestionIndex = 0;
let questions = [
    "Who has the Best Desk Decor?",
    "Who has the Best Sense of Humour?",
    "Who is Most likely to have a hidden talent?",
    "Who is Most likely to have a celebrity doppelganger?"
];
let votes = {};
let timer;
let votingActive = false;

function joinLobby() {
    const name = document.getElementById("nameInput").value;
    if (!name) return alert("Please enter your name!");

    // Add the user to the lobby in Firebase
    set(ref(database, 'lobby/' + name), true);
    document.getElementById("lobby").style.display = 'none';
    document.getElementById("votingArea").style.display = 'block';

    // Display the names of participants
    displayNames();
}

function displayNames() {
    const names = ["Sushmita Dasari", "Eshita Purohit", "Dawood Mohammed", "Pavani Prathyusha Kavuri", "Deepak Kumar MS", "Indraj Singh", "Praisey Rose", "Pravara Sripuram", "Akhil Varma", "Siga Prakash Pranay", "Harsha Thalamarla", "Anagha Taranikanti"];
    const nameList = document.getElementById("nameList");
    nameList.innerHTML = '';

    names.forEach(name => {
        const nameDiv = document.createElement('div');
        nameDiv.id = name;
        nameDiv.innerText = name;
        nameDiv.onclick = () => vote(name);
        nameList.appendChild(nameDiv);
    });
}

function startNextQuestion() {
    if (currentQuestionIndex >= questions.length) {
        alert("All questions completed!");
        return;
    }

    document.getElementById("questionText").innerText = questions[currentQuestionIndex];
    votingActive = true;
    resetVotes();

    // Start 60-second timer
    let timeLeft = 60;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            endVoting();
        } else {
            document.getElementById("timer").innerText = `Time Left: ${timeLeft--}s`;
        }
    }, 1000);
}

function resetVotes() {
    votes = {};
    const names = ["Sushmita Dasari", "Eshita Purohit", "Dawood Mohammed", "Pavani Prathyusha Kavuri", "Deepak Kumar MS", "Indraj Singh", "Praisey Rose", "Pravara Sripuram", "Akhil Varma", "Siga Prakash Pranay", "Harsha Thalamarla", "Anagha Taranikanti"];
    names.forEach(name => {
        votes[name] = 0;
        set(ref(database, 'votes/' + currentQuestionIndex + '/' + name), 0);
    });
}

function vote(person) {
    if (!votingActive) return alert("Voting is not active!");

    if (votes[person] === undefined) {
        alert("Invalid vote!");
        return;
    }

    votes[person] += 1;
    set(ref(database, 'votes/' + currentQuestionIndex + '/' + person), votes[person]);
    document.getElementById(person).style.fontSize = (votes[person] * 2) + "px";
}

function endVoting() {
    votingActive = false;
    currentQuestionIndex += 1;
    document.getElementById("nextQuestionBtn").style.display = 'block';
}
