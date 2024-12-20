let leaderboard = []
let badPlayers = []
let SPREADSHEET_ID = "1spa_TvGmq1HN1h5b5ICQ5gdwCMNsM3N9ztesJ8UG4sI"


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
    updateOptions()
}

function updateOptions() {
    document.getElementById('challenger').innerHTML = ""
    document.getElementById('loser').innerHTML = ""
    document.getElementById('winner').innerHTML = ""

    leaderboard.forEach((row) => {
        document.getElementById('loser').innerHTML += `<option value="${row}">${row}</option>`;
        document.getElementById('challenger').innerHTML += `<option value="${row}">${row}</option>`;
        document.getElementById('winner').innerHTML += `<option value="${row}">${row}</option>`;
    });
}


function fillLoser(){
    if (document.getElementById('challenger').value != document.getElementById('loser').value) {
        document.getElementById('winner').value = document.getElementById('challenger').value
    }
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
    getLeaderboard()
}


// update bad players on GS
async function writeGSBadPlayers() {
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

    let i = 1;
    leaderboard.forEach((row) => {
        document.getElementById('leaderboard').innerHTML += `<tr>
                                                                <td>${i}</td>
                                                                <td class="${(badPlayers.includes(row)) ? 'bad' : 'good'}">${row}</td>
                                                            </tr>`;
        i++;
    });
}


// update google sheet 
function writeGSLeaderboard() {
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

    writeGSBadPlayers()
    displayLeaderboard()
    writeGSLeaderboard()
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


    console.log("good players:", goodPlayers)
    
    // sort good players from top to bottom
    goodPlayers = goodPlayers.reverse()

    console.log("LB with empty added:", leaderboard)
    console.log("good players reversed:", goodPlayers)


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


    console.log("new LB:", leaderboard)
    
    writeGSLeaderboard()

    // reset the badPlayers list
    badPlayers = leaderboard.slice();
    writeGSBadPlayers()

    displayLeaderboard()

    console.log("unchallenged players moved down. all player statuses reset.")
}