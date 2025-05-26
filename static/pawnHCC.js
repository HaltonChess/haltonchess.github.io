var teams = []
var rounds = []
let byes = []  // list of teams  who have had a bye
var currentRoundNumber = 0;
var currentPairNumber = 0;

var autoTeams = [
    {
        teamName: "CKSS A",
        A: "Kai Bar-On",
        B: "Ryan Nizamani",
        C: "Agastya Khanna",
        D: "Barnett Luo",
        score: 0,
        matchPoints: [],
        roundScores: []
    },
    {
        teamName: "BRCSS",
        A: "Sophia",
        B: "Jon",
        C: "Pramiti",
        D: "Ritvik",
        score: 0,
        matchPoints: [],
        roundScores: []
    },
    {
        teamName: "WOSS A",
        A: "Frank Lin",
        B: "Aadil",
        C: "Xiao Hong",
        D: "Woss Sweat",
        score: 0,
        matchPoints: [],
        roundScores: []
    },
    {
        teamName: "APHS A",
        A: "Angel",
        B: "Dog",
        C: "Cat",
        D: "Lawyer",
        score: 0,
        matchPoints: [],
        roundScores: []
    },
    {
        teamName: "WOSS B",
        A: "Franker",
        B: "Aadiler",
        C: "Xiaoer",
        D: "Player D",
        score: 0,
        matchPoints: [],
        roundScores: []
    },
    {
        teamName: "APHS B",
        A: "Angeler",
        B: "Doger",
        C: "Cater",
        D: "Lawyerer",
        score: 0,
        matchPoints: [],
        roundScores: []
    },
    {
        teamName: "EMSS",
        A: "Uzair",
        B: "Angela",
        C: "Vidu",
        D: "Javan",
        score: 0,
        matchPoints: [],
        roundScores: []
    },
    {
        teamName: "IRHS",
        A: "Lawrence",
        B: "Hargun",
        C: "Yousef",
        D: "Player D",
        score: 0,
        matchPoints: [],
        roundScores: []
    },
    {
        teamName: "CKSS B",
        A: "Kailer",
        B: "Ryaner",
        C: "Agastyer",
        D: "Barnetter",
        score: 0,
        matchPoints: [],
        roundScores: []
    },
]



function createTeam() {
    // submitted team
    let team = {
        teamName: document.getElementById("teamName").value,
        A: document.getElementById("playerA").value,
        B: document.getElementById("playerB").value,
        C: document.getElementById("playerC").value,
        D: document.getElementById("playerD").value,
        score: 0,
        matchPoints: [],
        roundScores: []
    }

    // add team to list
    teams.push(team)

    rows = document.getElementById("tableBody").children

    // set team name as the team name input
    rows[rows.length - 2].children[0].innerHTML = rows[rows.length - 2].children[0].children[0].value

    // set players as the player inputs
    for (i = 0; i < 4; i++) {
        rows[rows.length - 1].children[i].innerHTML = rows[rows.length - 1].children[i].children[0].value
    }

    // show new input boxes
    document.getElementById("tableBody").innerHTML += ` <tr> 
                                                            <th colspan="4"><input placeholder="Team Name" id="teamName"></th>
                                                        </tr>
                                                        <tr>
                                                            <td>Player A: <input id="playerA"></td>
                                                            <td>Player B: <input id="playerB"></td>
                                                            <td>Player C: <input id="playerC"></td>
                                                            <td>Player D: <input id="playerD"></td>
                                                        </tr>`

}


function automateTeams() {
    teams = autoTeams
}


function createFirstRound() {

    rounds = []
    document.getElementById("pairingsMenu").innerHTML = ""

    // populate team info
    for (i = 0; i < teams.length; i++) {
        teams[i].matchPoints = []
        teams[i].roundScores = []
        teams[i].score = 0
        for (n = 0; n < 10; n++) {
            teams[i].roundScores.push(0)
            teams[i].matchPoints.push(0)
        }
    }


    currentRound = []

    for (i = 0; i < teams.length; i += 2) {
        console.log("bru")
        // just pair teams next to each other
        if (teams[i + 1]) {
            currentRound.push([teams[i], teams[i + 1]])
        }

        // for if there is an uneven # of teams
        else {
            currentRound.push([teams[i]])
            byes.push(teams[i].teamName)
        }
    }

    rounds.push(currentRound)
    console.log(rounds)

    createIndividualPairings()


    document.getElementById("pairingsMenu").innerHTML += `<li class="nav-item">
                                                                <a class="nav-link" aria-current="page" onclick="displayTeamPairings(${0})">Round ${1}</a>
                                                            </li>`

    document.getElementById("pairingsMenu").lastChild.children[0].classList.add('active')
    document.getElementById("setup").style.display = "none"
    displayTeamPairings(rounds.length - 1)
    document.getElementById("pairings").style.display = "block"
    updateStandings()
}


function isRepeat(teamA, teamB) {
    for (j = 0; j < rounds.length; j++) {
        for (k = 0; k < rounds[j].length; k++) {
            if (rounds[j][k].length != 1) {
                if ((rounds[j][k][0].teamName == teamA && rounds[j][k][1].teamName == teamB) || (rounds[j][k][0].teamName == teamB && rounds[j][k][1].teamName == teamA)) {
                    return true
                }
            }
        }
    }

    return false
}


function makeNextPairings() {


    // sort teams by score (match points)
    teamsCopy = [...teams].sort((a, b) => b.score - a.score)

    console.log(teamsCopy)


    currentRound = []


    // if odd # of teams, determine who gets the bye
    if (teamsCopy.length % 2 != 0) {

        // go through the teams, lowest players first
        for (i = teamsCopy.length - 1; i >= 0; i--) {

            // if a team did not already get a bye, give the bye to them
            if (!byes.includes(teamsCopy[i].teamName)) {
                currentRound.push([teamsCopy[i]])
                byes.push(teamsCopy[i].teamName)
                console.log(`${teamsCopy[i].teamName} got the bye`)
                teamsCopy.splice(i, 1)
                break
            }
        }
    }



    while (teamsCopy.length > 2) {
        console.log("teamsCopy: ", teamsCopy)

        teamA = teamsCopy[0]


        for (i = 1; i < teamsCopy.length; i++) {
            teamB = teamsCopy[i]


            if (isRepeat(teamA.teamName, teamB.teamName)) {
                console.log(`i almost repeated a match between ${teamA.teamName} and ${teamB.teamName}. I'm ashamed of my actions`)
                continue
            }

            console.log(teamA.teamName.slice(0, 4))
            if (teamA.teamName.slice(0, 4) == teamB.teamName.slice(0, 4)) {
                console.log(`${teamA.teamName} and ${teamB.teamName} are the same school huh...`)
                continue
            }


            // randomize white and black
            if (Math.random() <= 0.5) {
                currentRound.push([teamA, teamB])
            }
            else {
                currentRound.push([teamB, teamA])
            }

            teamsCopy.splice(i, 1)
            teamsCopy.shift()
            break

        }

        


    }


    // there are now 2 teams left
    console.log("there are now 2 teams left")
    console.log(teamsCopy[0].teamName + " and " + teamsCopy[1].teamName)

    // make the pair 
    currentRound.push([teamsCopy[0], teamsCopy[1]])



    // check if this last pair is unique
    if (!isRepeat(teamsCopy[0].teamName, teamsCopy[1].teamName)) {
        console.log("phew! last pair successfully made between " + teamsCopy[0].teamName + " and " + teamsCopy[1].teamName)
    }


    // if not, we must go back in the pairings and fix it
    else {
        console.log("fuck, backed myself into a corner - finding better pair now...")


        // other pairings: [playerA, playerB]
        // bad pairing: [playerC, playerD]

        // reverse for loop through currentPairings
        let i = 0;
        for (i = currentRound.length - 2; i >= 0; i--) {


            // check if playerA & playerC have played together && if playerB & playerD have played together
            if (!isRepeat(currentRound[i][0].teamName, currentRound[currentRound.length - 1][0].teamName) && !isRepeat(currentRound[i][1].teamName, currentRound[currentRound.length - 1][1].teamName)) {

                // switch players
                let temp = currentRound[i][0]
                currentRound[i][0] = currentRound[currentRound.length - 1][1]
                currentRound[currentRound.length - 1][1] = temp
                break
            }

            // check if playerB & playerC have played together && if playerA & playerD have played together
            else if (!isRepeat(currentRound[i][1].teamName, currentRound[currentRound.length - 1][0].teamName) && !isRepeat(currentRound[i][0].teamName, currentRound[currentRound.length - 1][1].teamName)) {

                // switch players
                let temp = currentRound[i][0]
                currentRound[i][0] = currentRound[currentRound.length - 1][0]
                currentRound[currentRound.length - 1][0] = temp
                break
            }

        }
    }

    console.log(currentRound)


    rounds.push(currentRound)



    createIndividualPairings()


    // add new pairing menu 
    document.getElementById("pairingsMenu").innerHTML += `<li class="nav-item">
                                                            <a class="nav-link active" aria-current="page" onclick="displayTeamPairings(${rounds.length - 1})">Round ${rounds.length}</a>
                                                        </li>`

    document.getElementById("pairingsMenu").lastChild.children[0].classList.add('active')
    document.getElementById("setup").style.display = "none"
    displayTeamPairings(rounds.length - 1)
    document.getElementById("pairings").style.display = "block"
    updateStandings()


}





function createIndividualPairings() {

    console.log(rounds)
    for (i = 0; i < rounds.length; i++) {

        for (j = 0; j < rounds[i].length; j++) {

            individualPairing = []

            if (rounds[i][j].length > 1) {
                individualPairing.push([rounds[i][j][0].A, rounds[i][j][1].A])

                if (rounds[i][j][0].B && rounds[i][j][1].B) {
                    individualPairing.push([rounds[i][j][0].B, rounds[i][j][1].B])
                } else {
                    // add the bye
                    if (rounds[i][j][0].B) {
                        individualPairing.push([rounds[i][j][0].B, 0])
                    } else if (rounds[i][j][1].B) {
                        individualPairing.push([0, rounds[i][j][1].B])
                    }
                }


                if (rounds[i][j][0].C && rounds[i][j][1].C) {
                    individualPairing.push([rounds[i][j][0].C, rounds[i][j][1].C])
                } else {
                    // add the bye
                    if (rounds[i][j][0].C) {
                        individualPairing.push([rounds[i][j][0].C, 0])
                    } else if (rounds[i][j][1].C) {
                        individualPairing.push([0, rounds[i][j][1].C])
                    }
                }

                if (rounds[i][j][0].D && rounds[i][j][1].D) {
                    individualPairing.push([rounds[i][j][0].D, rounds[i][j][1].D])
                } else {
                    // add the bye
                    if (rounds[i][j][0].D) {
                        individualPairing.push([rounds[i][j][0].D, 0])
                    } else if (rounds[i][j][1].D) {
                        individualPairing.push([0, rounds[i][j][1].D])
                    }
                }
                rounds[i][j].push(individualPairing)
            }
        }
    }
}



function displayTeamPairings(index) {
    currentRoundNumber = index




    activeItem = document.getElementById("pairingsMenu").getElementsByClassName('active')[0]
    if (activeItem) {
        activeItem.classList.remove('active')
    }


    currentPairing = rounds[index]
    document.getElementById("pairingsMenu").children[index].children[0].classList.add('active')

    document.getElementById("pairingsHeading").innerHTML = `<tr>
                                                                <th scope="col" class="score">Score</th>
                                                                <th scope="col" class="team">Team</th>
                                                                <th scope="col" id="button"></th>
                                                                <th scope="col" class="team">Team</th>
                                                                <th scope="col" class="score">Score</th>
                                                            </tr>`

    tableBody = ""

    for (i = 0; i < currentPairing.length; i++) {

        // 0 = lose, 0.5 = tie, 1 = win
        color = ["#2b292a", "#bde992", "#81B64C"]

        // check if the team pairing is a normal pairing   
        if (currentPairing[i].length > 1) {
            tableBody += `<tr>
                            <th scope="row">${currentPairing[i][0].roundScores[index]}</th>
                            <td><span style="background-color: ${color[currentPairing[i][0].matchPoints[index] * 2]}">${currentPairing[i][0].teamName}</span></td>
                            <td><button onclick="displayIndividualPairings(${index}, ${i})">See Match Details</button></td>
                            <td><span style="background-color: ${color[currentPairing[i][1].matchPoints[index] * 2]}">${currentPairing[i][1].teamName}</span></td>
                            <th scope="row">${currentPairing[i][1].roundScores[index]}</th>
                        </tr>`
        }

        // otherwise it is a bye
        else {
            tableBody += `<tr>
                            <td></td>
                            <td>${currentPairing[i][0].teamName}</td>
                            <td><button disabled>See Match Details</button></td>
                            <td></td>
                            <td></td>
                        </tr>`
        }
    }

    document.getElementById("pairingsTable").innerHTML = tableBody
}



function displayIndividualPairings(round, pair) {
    console.log("displaying individual pairings...")

    currentPairNumber = pair

    document.getElementById("pairingsMenu").style.display = "none"
    document.getElementById("nextPairingsButton").style.display = "none"
    document.getElementById("standings").style.display = "none"
    document.getElementById("back").style.display = "block"


    document.getElementById("pairingsHeading").innerHTML = `<tr>
                                                                <th scope="col" class="score"></th>
                                                                <th scope="col" class="team">${rounds[round][pair][0].teamName}</th>
                                                                <th scope="col" id="button"></th>
                                                                <th scope="col" class="team">${rounds[round][pair][1].teamName}</th>
                                                                <th scope="col" class="score"></th>
                                                            </tr>`

    tableBody = ""

    color = ["#81B64C", "#bde992", "#2b292a"]

    currentPairings = rounds[round][pair][2]
    console.log(currentPairings)

    for (i = 0; i < currentPairings.length; i++) {

        // check that the pairing isn't a bye
        if (isNaN(currentPairings[i][0]) && isNaN(currentPairings[i][1])) {
            tableBody += `<tr>
                            <td scope="col"><button onclick="playerAbsent(${i}, ${0})">X</button></th>
                            <td><span style="background-color: ${color[currentPairings[i][2] * 2]}">${currentPairings[i][0]}</td>
                            <td><button onclick='handleOutcome(1, ${i}); updatePoints(${round}, ${pair})' class="whiteButton"><</button><button onclick='handleOutcome("draw", ${i}); updatePoints(${round}, ${pair})'>O</button><button onclick='handleOutcome(2, ${i}); updatePoints(${round}, ${pair})' class="blackButton">></button></td>
                            <td><span style="background-color: ${color[2 - currentPairings[i][2] * 2]}">${currentPairings[i][1]}</span></td>
                            <td scope="col"><button onclick="playerAbsent(${i}, ${1})">X</button></th>
                        </tr>`

        }

        // otherwise it is a bye
        else {
            if (isNaN(currentPairings[i][0])) {
                tableBody += `<tr>
                                <td scope="col"><button onclick="playerAbsent(${i}, ${0})">X</button></td>
                                <td><span>${currentPairings[i][0]}</span></td>
                                <td></td>
                                <td></td>
                                <td scope="col"></td>
                            </tr>`

            } else if (isNaN(currentPairings[i][1])) {
                tableBody += `<tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><span>${currentPairings[i][1]}</span></td>
                                <td scope="col"><button onclick="playerAbsent(${i}, ${1})">X</button></td>
                            </tr>`
            }

        }
    }


    tableBody += `<tr>
                    <td></td>
                    <td class="scoreDisplay" id="team1Score"></td>
                    <td></td>
                    <td class="scoreDisplay" id="team2Score"></td>
                </tr>`

    document.getElementById("pairingsTable").innerHTML = tableBody

    document.getElementById("team1Score").innerHTML = rounds[round][pair][0].roundScores[round]
    document.getElementById("team2Score").innerHTML = rounds[round][pair][1].roundScores[round]
}


function playerAbsent(player, team) {
    console.log(rounds[currentRoundNumber][currentPairNumber][2][player][team] + " is absent")

    rounds[currentRoundNumber][currentPairNumber][2][player][team] = 0

    console.log(rounds[currentRoundNumber][currentPairNumber][2])

    for (i = player; i < 3; i++) {
        console.log(rounds[currentRoundNumber][currentPairNumber][2][i])
        rounds[currentRoundNumber][currentPairNumber][2][i][team] = rounds[currentRoundNumber][currentPairNumber][2][i + 1][team]
    }
    rounds[currentRoundNumber][currentPairNumber][2][3][team] = 0

    console.log(rounds[currentRoundNumber][currentPairNumber][2])
    displayIndividualPairings(currentRoundNumber, currentPairNumber)
}


function handleOutcome(winningPlayer, row) {

    document.getElementById("pairingsTable").children[row].children[1].children[0].style.backgroundColor = "#2b292a"
    document.getElementById("pairingsTable").children[row].children[3].children[0].style.backgroundColor = "#2b292a"

    if (winningPlayer == 1) {
        document.getElementById("pairingsTable").children[row].children[1].children[0].style.backgroundColor = "#81B64C"
    } else if (winningPlayer == 2) {
        document.getElementById("pairingsTable").children[row].children[3].children[0].style.backgroundColor = "#81B64C"
    } else {
        document.getElementById("pairingsTable").children[row].children[1].children[0].style.backgroundColor = "#bde992"
        document.getElementById("pairingsTable").children[row].children[3].children[0].style.backgroundColor = "#bde992"
    }
}


function updatePoints(round, pair) {
    // based on the column colors, see who won, add points accordingly, and save their win status (to be used if user opens past pairing outcomes)
    rows = document.getElementById("pairingsTable").children

    // set this round's score to 0
    rounds[round][pair][0].roundScores[round] = 0
    rounds[round][pair][1].roundScores[round] = 0

    for (i = 0; i < rows.length - 1; i++) {

        // check it isn't a bye
        if (rows[i].children[2].children[0] && rows[i].children[0].children[0]) {

            // tie
            if (rows[i].children[1].children[0].style.backgroundColor == "rgb(189, 233, 146)") {
                rounds[round][pair][0].roundScores[round] += 0.5
                rounds[round][pair][1].roundScores[round] += 0.5
                rounds[round][pair][2][i][2] = 0.5
            }

            // team 1 win
            else if (rows[i].children[1].children[0].style.backgroundColor == "rgb(129, 182, 76)") {
                rounds[round][pair][0].roundScores[round] += 1
                rounds[round][pair][2][i][2] = 0
            }

            // team 2 win
            else if (rows[i].children[3].children[0].style.backgroundColor == "rgb(129, 182, 76)") {
                rounds[round][pair][1].roundScores[round] += 1
                rounds[round][pair][2][i][2] = 1
            }
        }
    }

    document.getElementById("team1Score").innerHTML = rounds[round][pair][0].roundScores[round]
    document.getElementById("team2Score").innerHTML = rounds[round][pair][1].roundScores[round]
}


function back() {
    document.getElementById("pairingsMenu").style.display = "flex"
    document.getElementById("standings").style.display = "block"
    document.getElementById("nextPairingsButton").style.display = "block"
    document.getElementById("back").style.display = "none"


    // check if the team got a match point (add the roundscores from team 1 + 2 and if they add up to 4 u can give someone a point)
    findMatchPoints()
    updateStandings()
    displayTeamPairings(currentRoundNumber)
}


function findMatchPoints() {

    rounds[currentRoundNumber][currentPairNumber][0].score -= rounds[currentRoundNumber][currentPairNumber][0].matchPoints[currentRoundNumber]
    rounds[currentRoundNumber][currentPairNumber][1].score -= rounds[currentRoundNumber][currentPairNumber][1].matchPoints[currentRoundNumber]

    rounds[currentRoundNumber][currentPairNumber][0].matchPoints[currentRoundNumber] = 0
    rounds[currentRoundNumber][currentPairNumber][1].matchPoints[currentRoundNumber] = 0


    pairings = rounds[currentRoundNumber][currentPairNumber][2]
    sum = pairings.length

    // minus 1 from the sum for every bye
    for (i = 0; i < pairings.length; i++) {
        console.log(pairings[i])
        if (!isNaN(pairings[i][0]) || !isNaN(pairings[i][1])) {
            sum -= 1
        }
    }


    // check if all rounds have been accounted for
    if (rounds[currentRoundNumber][currentPairNumber][0].roundScores[currentRoundNumber] + rounds[currentRoundNumber][currentPairNumber][1].roundScores[currentRoundNumber] >= sum) {

        // if team 1 won
        if (rounds[currentRoundNumber][currentPairNumber][0].roundScores[currentRoundNumber] > rounds[currentRoundNumber][currentPairNumber][1].roundScores[currentRoundNumber]) {
            rounds[currentRoundNumber][currentPairNumber][0].matchPoints[currentRoundNumber] = 1
        }

        // if team 2 won
        else if (rounds[currentRoundNumber][currentPairNumber][0].roundScores[currentRoundNumber] < rounds[currentRoundNumber][currentPairNumber][1].roundScores[currentRoundNumber]) {
            rounds[currentRoundNumber][currentPairNumber][1].matchPoints[currentRoundNumber] = 1
        }

        // if it was a tie
        else {
            rounds[currentRoundNumber][currentPairNumber][0].matchPoints[currentRoundNumber] = 0.5
            rounds[currentRoundNumber][currentPairNumber][1].matchPoints[currentRoundNumber] = 0.5
        }
    }


    // find new total score
    rounds[currentRoundNumber][currentPairNumber][0].score += rounds[currentRoundNumber][currentPairNumber][0].matchPoints[currentRoundNumber]
    rounds[currentRoundNumber][currentPairNumber][1].score += rounds[currentRoundNumber][currentPairNumber][1].matchPoints[currentRoundNumber]
}


function updateStandings() {
    console.log("updating standings...")

    // sort teams by score
    teams.sort(function (a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
    })

    tableBody = ""
    for (i = 0; i < teams.length; i++) {
        console.log(teams[i])
        tableBody += `<tr>
                        <th>${i + 1}</th>
                        <td>${teams[i].teamName}</td>
                        <td>${teams[i].score}</td>
                      </tr>`
    }

    document.getElementById("standingsTable").innerHTML = tableBody
}


function findWinner() {
    winners = []

    // sort teams by score
    teams.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))

    // save()

    for (i = 0; i < teams.length; i++) {
        if (teams[i].score == teams[0].score) {
            winners.push(teams[i])
        } else {
            break
        }
    }

    console.log(winners)
    if (winners.length == 1) {
        alert(winners[0].teamName + " won!!!!!!! ")
    } else {
        alert("tie between " + winners)
        alert("repeating the round robin...")
        teams = winners
        createRounds()
    }
}

function save() {
    data = {
        "Rounds": rounds,
        "Final Standings": teams
    }

    try {
        var request = new XMLHttpRequest()
        request.open('POST', `http://localhost:5000/saveData`, false)
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(data))
    }
    catch (error) {
        console.log(error)
    }

}