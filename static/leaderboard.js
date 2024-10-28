let leaderboard = []
let badPlayers = []
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
    try {
        leaderboard = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            majorDimension: 'COLUMNS',
            range: 'Ladder!B2:B',
        });
    } catch (err) {
        document.getElementById('leaderboard').innerHTML = err.message;
        return;
    }

    leaderboard = leaderboard.result.values[0]
    console.log("leaderboard", leaderboard)

    displayLeaderboard()
}


async function getBadPlayers() {
    try {
        badPlayers = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            majorDimension: 'COLUMNS',
            range: 'Ladder!Y2:Y',
        });
    } catch (err) {
        console.log(err.message);
        return;
    }

    badPlayers = badPlayers.result.values[0]
    console.log("bad players:", badPlayers)
}


// update bad players on GS
async function writeBadPlayers() {
    console.log(badPlayers)

    GSBadPlayers = []
    badPlayers.forEach((row) => {
        GSBadPlayers.push([row])
    });
    console.log(GSBadPlayers)

    try {
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Y2',
            valueInputOption: "USER_ENTERED",
            resource: { "values": GSBadPlayers },
        }).then((response) => {
            console.log(`updated`);
        });
    } catch (err) {
        console.error(err);
        return;
    }
}


// show leaderboard
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
    loserIndex = leaderboard.indexOf(loser)

    if (winnerIndex == -1 || loserIndex == -1) {
        alert("a player was not found - make sure they are in the leaderboard sheet")
        return;
    }


    if (challenger == winner && winnerIndex < loserIndex) {
        alert(`${winner} just wanted to bully ${loser}. nothing happens. ${winner} should be ashamed of themself.`)
    }

    else {
        if (loserIndex > winnerIndex && loserIndex != leaderboard.length - 1) {
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


    // remove loser from players list
    if (badPlayers.includes(loser)) {
        badPlayers[badPlayers.indexOf(loser)] = "";
        console.log(loser, "removed from 'badPlayers' list");
    }

    // remove winner too
    if (badPlayers.includes(winner)) {
        badPlayers[badPlayers.indexOf(winner)] = "";
        console.log(winner, "removed from 'badPlayers' list");
    }

    writeBadPlayers()
}


function derank() {
    goodPlayers = []

    // for every player
    for (i = leaderboard.length - 1; i > -1; i--) {

        // insert an "empty" slot in front of every bad player
        if (badPlayers.includes(leaderboard[i])) {
            leaderboard.splice(i, 0, "empty")
        }

        // or else, add the player to the good player list
        else {
            goodPlayers.push(leaderboard[i])
        }
    }

    // sort good players from top to bottom
    goodPlayers.reverse()

    // for every good player
    for (i = 0; i < goodPlayers.length; i++) {
        playerIndex = leaderboard.indexOf(goodPlayers[i])

        // find the highest empty slot
        newPosition = leaderboard.indexOf("empty")

        // if that slot is higher than the player's current position, move them there
        if (newPosition < playerIndex){
            leaderboard.splice(playerIndex, 1)
            leaderboard[newPosition] = goodPlayers[i]
        }
    }


    // remove the extra "empty" values
    while (true) {
        index = leaderboard.indexOf("empty")

        if (index == -1){
            break;
        }

        leaderboard.splice(leaderboard.indexOf("empty"), 1)
    }


    console.log(leaderboard)
    displayLeaderboard()
    updateLeaderboard()

    // reset the players.txt file
    badPlayers = leaderboard.slice();
    writeBadPlayers()

    console.log("unchallenged players moved down. all player statuses reset.")
}