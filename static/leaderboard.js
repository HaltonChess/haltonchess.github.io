let leaderboard = []
let SPREADSHEET_ID = "1spa_TvGmq1HN1h5b5ICQ5gdwCMNsM3N9ztesJ8UG4sI"

function verify() {
    username = document.getElementById('username').value
    password = document.getElementById('password').value

    if (username == "VidsterBroyo" && password == "bozo") {
        document.getElementById("leaderboardManagement").style.display = "block"
        document.getElementById("managementForm").style.display = "block"
        document.getElementById("googleSheet").style.display = "block"
    } else {
        alert("L wrong credentials")
    }
}


async function getLeaderboard() {
    let response;
    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Ladder!B2:B',
        });
    } catch (err) {
        document.getElementById('leaderboard').innerHTML = err.message;
        return;
    }


    response.result.values.forEach((row) => {
        leaderboard.push(row[0])
    });

    console.log(leaderboard)


    displayLeaderboard()
}

async function getBadPlayers() {
    let response;

    fetch("static/badPlayers.txt")
    .then((res) => res.text())
    .then((text) => {
        response = text
    })
    .catch((e) => console.error(e));

    badPlayers = response.split(" ")
    console.log(badPlayers)
    
    // console.log(leaderboard)
    // displayLeaderboard()
}


function displayLeaderboard() {
    document.getElementById('leaderboard').innerHTML = ""

    leaderboard.forEach((row) => {
        document.getElementById('leaderboard').innerHTML += `<li>${row}</li>`;
    });
}


// update google sheet 
function updateLeaderboard() {
    console.log(leaderboard)
    GSLeaderboard = []
    leaderboard.forEach((row) => {
        GSLeaderboard.push([row])
    });
    console.log(GSLeaderboard)

    try {
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'B2',
            valueInputOption: "USER_ENTERED",
            resource: { "values": GSLeaderboard },
        }).then((response) => {
            const result = response.result;
            console.log(`updated`);
        });
    } catch (err) {
        console.error(err);
        return;
    }
}




async function submitMatch() {
    challenger = document.getElementById('challenger').value
    winner = document.getElementById('winner').value
    loser = document.getElementById('loser').value

    winnerIndex = leaderboard.indexOf(winner)
    console.log(winner)
    console.log(leaderboard.indexOf(winner))
    loserIndex = leaderboard.indexOf(loser)

    if (winnerIndex == -1 || loserIndex == -1) {
        alert("a player was not found - make sure they are in the leaderboard sheet")
        return;
    }


    if (challenger == winner && winnerIndex < loserIndex) {
        alert(`${winner} just wanted to bully ${loser}. nothing happens. ${winner} should be ashamed of themself.`)
    }

    else {
        if (loserIndex > winnerIndex && loserIndex != len(leaderboard) - 1) {
            leaderboard.splice(loserIndex, 1)
            leaderboard.splice(loserIndex + 1, 0, loser)
            alert(`${loser} was too cocky of their skills. ${winner} destroyed them. ${loser} moved down one.`)
        }

        else if (loserIndex < winnerIndex) {
            leaderboard.splice(loserIndex, 0, winner)
            leaderboard.splice(winnerIndex + 1, 1)
            alert(loser + " let their guard down and " + winner + " got the jump on them. congrats")
        }
    }

    displayLeaderboard()
    updateLeaderboard()
}