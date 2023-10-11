// // CLIENT SIDE CODE
const socket = io()

const impactInput = document.getElementById("impact");
const frequencyInput = document.getElementById("frequency");
const frustrationInput = document.getElementById("frustration");
const ticketNumberInput = document.getElementById("ticketNumber");
const ticketNumberResult = document.getElementById("ticketNumberResult");
const impactValueDisplay = document.getElementById("impactValue");
const frequencyValueDisplay = document.getElementById("frequencyValue");
const frustrationValueDisplay = document.getElementById("frustrationValue");
const iffScoreDisplay = document.getElementById("iffScore");
const calculatesubmit = document.getElementById("calculate");
const addButton = document.getElementById("addButton");

// Store ticket scores in an array
let iffScoreArray = [];
let TeamIffScoreArray = [];


// It will parse the query string from join page so that (http://localhost:3000/main.html?username=Julia&room=room1)
//Qs is coming from the main.html qs.min.js
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});


// Sending the usrname and room details to server(extracted from join page)
socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error);
        //Redirect the user to home page in case of error
        location.href = '/' //Redirecting to JOIN page
    }
});


const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
socket.on('joinData', ({room, users})=>{
        const html = Mustache.render(sidebarTemplate, {
            room,
            users
        })
        document.querySelector('#sidebar').innerHTML = html
    })



// To calculate the IFF Score
function calculateTicketIFFScore(impactValue, frequencyValue, frustrationValue) {
    const iffScore = (impactValue + frequencyValue) * frustrationValue;
    console.log("calculateTicketIFFScore", iffScore);
    return iffScore;
}


// To update the selected input value in real-time
function updateValues() {
    // Fetching the value from the input field
    const impactValue = parseInt(impactInput.value);
    const frequencyValue = parseInt(frequencyInput.value);
    const frustrationValue = parseInt(frustrationInput.value);

    console.log("updateValues", impactValue);
    // For displaying the selected input parameter values
    impactValueDisplay.textContent = impactValue;
    frequencyValueDisplay.textContent = frequencyValue;
    frustrationValueDisplay.textContent = frustrationValue;
}

// To update ticket IFF score
function updateTicketIFFScore(iffScore) {
    const ticketNumber = ticketNumberInput.value;
    ticketNumberResult.textContent = ticketNumber || "N/A";

    const ticket_score_pair = `${ticketNumber} : ${iffScore}`;
    iffScoreArray.push(ticket_score_pair);
}


function getUniqueHighestScores(TeamIffScoreArray) {
    const teamScores = {};
  
    // Iterate through the array and update the highest score for each team
    TeamIffScoreArray.forEach((score) => {
      const [team, iff] = score.split(':').map((str) => str.trim());
      let iffValue = parseInt(iff);
  
      if (!(team in teamScores) || iffValue > teamScores[team]) {
        teamScores[team] = iffValue;
      }
    });
  
    // Convert the object back to an array
    const uniqueHighestScores = Object.entries(teamScores).map(([team, iff]) => `${team}: ${iff}`);
  
    return uniqueHighestScores;
  }


// Event listener for the Calculate button
calculatesubmit.addEventListener("click", () => {
    const impactValue = parseInt(impactInput.value);
    const frequencyValue = parseInt(frequencyInput.value);
    const frustrationValue = parseInt(frustrationInput.value);

    const iffScore = calculateTicketIFFScore(impactValue, frequencyValue, frustrationValue);
    iffScoreDisplay.textContent = iffScore;

    updateTicketIFFScore(iffScore);
    console.log(iffScoreArray);

    const [ticket, iffscore] =iffScoreArray[iffScoreArray.length-1].split(':').map(item => item.trim());
    // Sending the iff score and ticket number to server
    socket.emit('iff_scr', {ticket, iffscore}, (error)=>{
        if(error){
            alert(error);
            //Redirect the user to home page in case of error
            location.href = '/' //Redirecting to JOIN page
        }
    });


    socket.on('roomData', ({room, users, ticket, score})=>{

        const ticketTeamScorePair = `${ticket} : ${score}`.toUpperCase();
        TeamIffScoreArray.push(ticketTeamScorePair);


        // DISPLAYING RESULT TO RIGHT CONTAINER
        const rightContainer = document.querySelector(".right-container");

        // Remove the existing scoresContainer if it exists
        const existingScoresContainer = document.querySelector(".scores-container");
        if (existingScoresContainer) {
            rightContainer.removeChild(existingScoresContainer);
        }

        // Create a new scoresContainer
        const scoresContainer = document.createElement("div");
        scoresContainer.classList.add("scores-container"); // Add a class for identification
        console.log('TeamIffScoreArray', TeamIffScoreArray);
        const UniqueTeamIffScoreArray = getUniqueHighestScores(TeamIffScoreArray)
        console.log('UniqueTeamIffScoreArray', UniqueTeamIffScoreArray)
        // Convert the set back to an array and sort it in descending order
        const uniqueScoresArray = Array.from(UniqueTeamIffScoreArray).sort((a, b) => {
            const valueA = parseInt(a.split(":")[1]);
            const valueB = parseInt(b.split(":")[1]);
            return valueB - valueA;
        });

        console.log("uniqueScoresArray: ",uniqueScoresArray);

        // console.log("@@@@@", uniqueScoresArray);
        uniqueScoresArray.forEach((score) => {
            const scoreElement = document.createElement("p");
            scoreElement.textContent = score;
            scoresContainer.appendChild(scoreElement);
        });

        // Append the new scoresContainer
        rightContainer.appendChild(scoresContainer);
  
    })

});


// Display the slider input selection in real-time
impactInput.addEventListener("input", updateValues);
frequencyInput.addEventListener("input", updateValues);
frustrationInput.addEventListener("input", updateValues);