let leaderboard = []

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

function updateLeaderboard() {
    winner = document.getElementById('winner').value
    loser = document.getElementById('loser').value
    alert("the winner was " + winner + " and the loser was " + loser)
}


async function getLeaderboard() {
    let response;
    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1spa_TvGmq1HN1h5b5ICQ5gdwCMNsM3N9ztesJ8UG4sI',
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

    document.getElementById('leaderboard').innerHTML = ""

    leaderboard.forEach((row) => {
        document.getElementById('leaderboard').innerHTML += `<li>${row}</li>`;
    });
}


function updateLeaderboard() {
    document.getElementById('leaderboard').innerHTML = ""

    leaderboard.forEach((row) => {
        document.getElementById('leaderboard').innerHTML += `<li>${row}</li>`;
    });

    // update google sheet here 
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

        else if(loserIndex < winnerIndex){
            leaderboard.splice(loserIndex, 0, winner)
            leaderboard.splice(winnerIndex + 1, 1)
            alert(loser + " let their guard down and " + winner + " got the jump on them. congrats")
        }
    }

    updateLeaderboard()
}