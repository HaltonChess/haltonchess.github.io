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

