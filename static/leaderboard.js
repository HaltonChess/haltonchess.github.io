let leaderboard = []

function verify(){
    username = document.getElementById('username').value
    password = document.getElementById('password').value

    if (username == "VidsterBroyo" && password == "bozo"){
        document.getElementById("leaderboardManagement").style.display = "block"
        document.getElementById("managementForm").style.display = "block"
        document.getElementById("googleSheet").style.display = "block"
    } else {
        alert("L wrong credentials")
    }
}

function updateLeaderboard(){
    winner = document.getElementById('winner').value
    loser = document.getElementById('loser').value
    alert("the winner was "+ winner+ " and the loser was "+loser)
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


    leaderboard = response.result.values
    console.log(response)
    console.log(leaderboard)
    
    document.getElementById('leaderboard').innerHTML = ""

    leaderboard.forEach((row) => {
        document.getElementById('leaderboard').innerHTML += `<li>${row[0]}</li>`;
    });

    return response.result.values
  }