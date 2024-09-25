// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
let votedUsers = new Set();  // Keep track of users who have voted
let timer;
let votingActive = false;

function joinLobby() {
    const name = document.getElementById("nameInput").value.trim();
    if (!name) return alert("Please enter your name!");

    console.log("User joining lobby: ", name);

    set(ref(database, 'lobby/' + name), true)
        .then(() => {
            console.log("User added to lobby successfully.");
            document.getElementById("lobby").style.display = 'none';
            document.getElementById("votingArea").style.display = 'block';
            resetVotes(); // Initialize votes when a user joins
            displayNames(); // Display the names once a user joins
        })
        .catch((error) => {
            console.error("Error adding user to lobby: ", error);
        });
}

function displayNames() {
    const names = ["Sushmita Dasari", "Eshita Purohit", "Dawood Mohammed", "Pavani Prathyusha Kavuri", 
                   "Deepak Kumar MS", "Indraj Singh", "Praisey Rose", "Pravara Sripuram", 
                   "Akhil Varma", "Siga Prakash Pranay", "Harsha Thalamarla", "Anagha Taranikanti"];
    const nameList = document.getElementById("nameList");
    nameList.innerHTML = ''; // Clear previous names
    names.forEach(name => {
        const nameButton = document.createElement("button");
        nameButton.innerText = name;
        nameButton.id = name;
        nameButton.className = "nameButton";
        nameButton.onclick = () => vote(name);
        nameList.appendChild(nameButton);
    });
}

function startNextQuestion() {
    if (currentQuestionIndex >= questions.length) {
        alert("All questions completed!");
        return;
    }

    document.getElementById("questionText").innerText = questions[currentQuestionIndex];
    votingActive = true;
    votedUsers.clear();  // Reset voted users for the new question
    resetVotes();

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
    const names = ["Sushmita Dasari", "Eshita Purohit", "Dawood Mohammed", "Pavani Prathyusha Kavuri", 
                   "Deepak Kumar MS", "Indraj Singh", "Praisey Rose", "Pravara Sripuram", 
                   "Akhil Varma", "Siga Prakash Pranay", "Harsha Thalamarla", "Anagha Taranikanti"];
    names.forEach(name => {
        votes[name] = 0;
        set(ref(database, 'votes/' + currentQuestionIndex + '/' + name), 0);
    });
}

function vote(person) {
    const name = document.getElementById("nameInput").value.trim();

    if (!votingActive) return alert("Voting is not active!");
    if (votedUsers.has(name)) return alert("You have already voted!");

    votes[person] += 1;
    set(ref(database, 'votes/' + currentQuestionIndex + '/' + person), votes[person]);
    document.getElementById(person).style.fontSize = (votes[person] * 2) + "px";
    votedUsers.add(name);  // Record that this user has voted
}

function endVoting() {
    votingActive = false;
    currentQuestionIndex += 1;
    document.getElementById("nextQuestionBtn").style.display = 'block';
}
