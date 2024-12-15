
let players = []
let pairings = []
let edits = []
let schools = ["Abbey Park High School", "Acton District School", "Aldershot High School", "Craig Kielburger Secondary School",
    "Elsie MacGill Secondary School", "Iroquois Ridge High School", "Milton District High School", "T. A. Blakelock High School"
    , "White Oaks Secondary School", "Bishop Reding Catholic Secondary School"]
let firstPairings = []
let color = ["#81B64C", "#bde992", "transparent"]
            // win, tie, lose


function showButton(button) {
    if (button == "manual") {
        document.getElementById("manual").style.display = "block"
        document.getElementById("next").style.display = "none"
    } else if (button == "nextPairings") {
        document.getElementById("manual").style.display = "none"
        document.getElementById("next").style.display = "block"
    } else {
        document.getElementById("manual").style.display = "none"
        document.getElementById("next").style.display = "none"
    }

}


function addPlayer() {
    let playerName = document.getElementById("name").value
    let playerSchool = document.getElementById("school").value

    let newPlayerSection = document.getElementById("newPlayer");
    document.getElementById("tableBody").removeChild(newPlayerSection);

    newPlayer = {
        name: playerName,
        school: playerSchool,
        score: 0
    }
    console.log(newPlayer)

    players.push(newPlayer)

    document.getElementById("tableBody").innerHTML += ` <tr>
                                                            <th scope="row">${players.length}</th>
                                                            <td>${playerName}</td>
                                                            <td>${playerSchool}</td>
                                                            <td><button onclick="removePlayer({name: '${playerName}', school: '${playerSchool}'})">X</button></td>
                                                        </tr>
                                                        <tr id="newPlayer">
                                                            <th scope="row"></th>
                                                            <td><input type="text" id="name" placeholder="Name"></td>
                                                            <td>
                                                            <select id="school">
                                                                <option value="Abbey Park High School">Abbey Park High School</option>
                                                                <option value="Acton District School">Acton District School</option>
                                                                <option value="Aldershot High School">Aldershot High School</option>
                                                                <option value="Craig Kielburger Secondary School">Craig Kielburger Secondary School</option>
                                                                <option value="Elsie MacGill Secondary School">Elsie MacGill Secondary School</option>
                                                                <option value="Iroquois Ridge High School">Iroquois Ridge High School</option>
                                                                <option value="Milton District High School">Milton District High School</option>
                                                                <option value="T. A. Blakelock High School">T. A. Blakelock High School</option>
                                                                <option value="White Oaks Secondary School">White Oaks Secondary School</option>
                                                                <option value="Bishop Reding Catholic Secondary School">Bishop Reding Catholic Secondary School</option>
                                                            </select>
                                                            </td>
                                                        </tr>`
}


function automatePlayers() {
    fetch("static/players.json")
        .then((res) => res.text())
        .then((text) => {
            console.log(JSON.parse(text))
            players = JSON.parse(text)
        })
        .catch((e) => console.error(e));
}


function removePlayer(playerObject) {

    // find and remove player from players list
    for (i = 0; i < players.length; i++) {
        if (players[i].name == playerObject.name && players[i].school == playerObject.school) {
            players.splice(i, 1)
            break
        }
    }
    console.log(players)


    // remake table
    tableBody = ""

    for (i = 0; i < players.length; i++) {
        tableBody += `<tr>
                        <th scope="row">${i + 1}</th>
                        <td>${players[i].name}</td>
                        <td>${players[i].school}</td>
                        <td><button onclick="removePlayer({name: '${players[i].name}', school: '${players[i].school}'})">X</button></td>
                      </tr>`
    }

    tableBody += ` <tr id="newPlayer">
                        <th scope="row"></th>
                        <td><input type="text" id="name" placeholder="Name"></td>
                        <td>
                        <select id="school">
                            <option value="Abbey Park High School">Abbey Park High School</option>
                            <option value="Acton District School">Acton District School</option>
                            <option value="Aldershot High School">Aldershot High School</option>
                            <option value="Craig Kielburger Secondary School">Craig Kielburger Secondary School</option>
                            <option value="Elsie MacGill Secondary School">Elsie MacGill Secondary School</option>
                            <option value="Iroquois Ridge High School">Iroquois Ridge High School</option>
                            <option value="Milton District High School">Milton District High School</option>
                            <option value="T. A. Blakelock High School">T. A. Blakelock High School</option>
                            <option value="White Oaks Secondary School">White Oaks Secondary School</option>
                            <option value="Bishop Reding Catholic Secondary School">Bishop Reding Catholic Secondary School</option>
                        </select>
                        </td>
                    </tr>`

    document.getElementById("tableBody").innerHTML = tableBody
}


function createFirstPairings() {
    currentPairings = []

    // randomize array
    for (i = 0; i < players.length; i++) {
        index = Math.floor(Math.random() * players.length)
        oldPlayer = players[index]
        players[index] = players[i]
        players[i] = oldPlayer
    }


    playersBySchool = [[], [], [], [], [], [], [], [], [], []]


    for (i = 0; i < players.length; i++) {
        playersBySchool[schools.indexOf(players[i].school)].push(players[i])
    }

    updateStandings(players)


    players = []


    // sort the schools by largest size
    let counter = 0
    while (counter < 9) {
        counter = 0;
        for (j = 0; j < 9; j++) {
            if (playersBySchool[j].length < playersBySchool[j + 1].length) {
                temp = playersBySchool[j];
                playersBySchool[j] = playersBySchool[j + 1];
                playersBySchool[j + 1] = temp;
            }
            else {
                counter += 1;
            }
        }
    }


    // keep repeating until the school with the most kids has reached 0
    while (playersBySchool[0].length != 0) {

        // check that there isn't only one school left
        if (playersBySchool[1].length > 0) {
            playersBySchool[0][0].color = "white"
            playersBySchool[1][0].color = "black"

            // make the pair between biggest and smallest school
            currentPairings.push([playersBySchool[0][0], playersBySchool[1][0]])

            // remove the students from the playersBySchool
            playersBySchool[0].shift()
            playersBySchool[1].shift()

            // sort the schools list by largest size again
            let counter = 0
            while (counter < 9) {
                counter = 0;
                for (j = 0; j < 9; j++) {
                    if (playersBySchool[j].length < playersBySchool[j + 1].length) {
                        temp = playersBySchool[j];
                        playersBySchool[j] = playersBySchool[j + 1];
                        playersBySchool[j + 1] = temp;
                    }
                    else {
                        counter += 1;
                    }
                }
            }
        }

        // if there is only one school left with 2+ members
        else if (playersBySchool[0].length >= 2) {
            playersBySchool[0][0].color = "white"
            playersBySchool[0][1].color = "black"

            currentPairings.push([playersBySchool[0][0], playersBySchool[0][1]])

            // remove the students from the schools
            playersBySchool[0].shift()
            playersBySchool[0].shift()
        }

        // if there is only one school left with only one member
        else if (playersBySchool[0].length == 1) {
            playersBySchool[0][0].color = "white"

            currentPairings.push([playersBySchool[0][0], 2])
            playersBySchool[0].shift()
        }

    }


    document.getElementById("pairings").style.display = "block"
    pairings.push(currentPairings)
    displayPairings("new pairings")
    document.getElementById("addPlayers").style.display = "none"
}


function updateStandings(players) {
    tableBody = ""
    for (i = 0; i < players.length; i++) {
        tableBody += `<tr>
                        <th>${i + 1}</th>
                        <td>${players[i].name}</td>
                        <td>${players[i].school}</td>
                        <td>${players[i].score}</td>
                      </tr>`
    }

    document.getElementById("standingsTable").innerHTML = tableBody

}


function isRepeat(playerA, playerB) {
    for (j = 0; j < pairings.length; j++) {
        for (k = 0; k < pairings[j].length; k++) {
            if (pairings[j][k].length != 2) {
                if ((pairings[j][k][0].name == playerA && pairings[j][k][1].name == playerB) || (pairings[j][k][0].name == playerB && pairings[j][k][1].name == playerA)) {
                    return true
                }
            }
        }
    }

    return false
}


function saveLastPairings() {
    // based on the column colors, see who won, add points accordingly, and save their win status (to be used if user opens past pairing outcomes)
    rows = document.getElementById("pairingsTable").children

    for (i = 0; i < rows.length; i++) {

        // check that the pair isn't a bye
        if (isNaN(pairings[pairings.length - 1][i][1])) {

            playerA = { ...pairings[pairings.length - 1][i][0] }
            playerB = { ...pairings[pairings.length - 1][i][1] }

            // tie
            if (rows[i].children[3].children[0].style.backgroundColor == "rgb(189, 233, 146)") {
                pairings[pairings.length - 1][i].push(1)
                playerA.score += 0.5
                playerB.score += 0.5

            }

            // playerA win
            else if (rows[i].children[3].children[0].style.backgroundColor == "rgb(129, 182, 76)") {
                pairings[pairings.length - 1][i].push(0)
                playerA.score += 1
            }

            // playerB win
            else {
                pairings[pairings.length - 1][i].push(2)
                playerB.score += 1
            }

            // add players
            players.push(playerA)
            players.push(playerB)


        } else {
            // bye
            pairings[pairings.length - 1][i][1] = 1
            playerA = { ...pairings[pairings.length - 1][i][0] }
            playerA.score += 0.5
            players.push(playerA)
        }
    }


    console.log(players)
    currentPairings = []
}


function makeNextPairings() {

    saveLastPairings()

    // PRIORITY
    // - NEVER play have same pairing twice
    // - score proximity
    //    - top players get first priority though, they need to be with their kind
    // - players should be from different schools
    // - players should be opposite colors
    //    - this becomes higher priority if a player had same color 3 times, but worry abt it later



    // get list of players by school, just so we know the order of schools
    playersBySchool = [[], [], [], [], [], [], [], [], [], []]
    for (i = 0; i < players.length; i++) {
        playersBySchool[schools.indexOf(players[i].school)].push(players[i])
    }


    // make list of players by point
    playersByPoints = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]

    for (i = 0; i < players.length; i++) {
        playersByPoints[2 * (players[i].score)].push(players[i])
    }
    playersByPoints = playersByPoints.reverse()

    players = []


    // order every score category by school size (players from biggest schools)
    for (i = 0; i < playersByPoints.length; i++) {
        let counter = 0
        while (counter < playersByPoints[i].length - 1) {
            counter = 0;
            for (j = 0; j < playersByPoints[i].length - 1; j++) {
                if (playersBySchool[schools.indexOf(playersByPoints[i][j].school)].length < playersBySchool[schools.indexOf(playersByPoints[i][j + 1].school)].length) {
                    temp = playersByPoints[i][j];
                    playersByPoints[i][j] = playersByPoints[i][j + 1];
                    playersByPoints[i][j + 1] = temp;
                }
                else {
                    counter += 1;
                }
            }
        }
    }

    playersByPoints = playersByPoints.flat()
    updateStandings(playersByPoints)


    while (playersByPoints.length > 1) {
        playerA = playersByPoints[0]
        // [same score & diff school & diff color, same score & diff school, close score +- 0.5 & diff school & diff color, close score & diff school, closest score possible]
        options = [0, 0, 0, 0, 0, 0]
        smallestDiff = 1000

        // console.log("\n----------PLAYERS----------")
        // for (i = 0; i < playersByPoints.length; i++) {
        //     console.log(playersByPoints[i])
        // }

        for (i = 1; i < playersByPoints.length; i++) {
            playerB = playersByPoints[i]


            if (isRepeat(playerA.name, playerB.name)) {
                console.log(`i almost repeated a match between ${playerA.name} and ${playerB.name}. I'm ashamed of my actions`)
                continue
            }


            // check for best case scenario (same score, diff school, diff color)
            if (playerB.score == playerA.score && playerB.school != playerA.school && playerB.color != playerA.color) {
                options[0] = i

                // switch colors
                temp = playerA.color
                playerA.color = playerB.color
                playerB.color = temp

                break
            }

            // check for 2nd best case scenario (same score, diff school, but same color)
            else if (playerB.score == playerA.score && playerB.school != playerA.school) {
                options[1] = i

            }

            // check for 3rd best case scenario (close score, diff school, diff color)
            else if ((playerB.score == playerA.score - 0.5 || playerB.score == playerA.score + 0.5) && playerB.school != playerA.school && playerB.color != playerA.color) {
                options[2] = i
            }

            // check for 4th best case scenario (close score, diff school, but same color)
            else if ((playerB.score == playerA.score - 0.5 || playerB.score == playerA.score + 0.5) && playerB.school != playerA.school) {
                options[3] = i

            }


            // check for 5th best case scenario (smallest diff possible and diff schools)
            else if (Math.abs(playerA.score - playerB.score) < smallestDiff && playerA.school != playerB.school) {
                options[4] = i
                smallestDiff = Math.abs(playerA.score - playerB.score)
            }

            // check for 6th best case scenario (smallest diff possible)
            else if (Math.abs(playerA.score - playerB.score) < smallestDiff) {
                options[5] = i
                smallestDiff = Math.abs(playerA.score - playerB.score)
            }

        }



        // check the highest option that is available
        if (options[0] != 0) {
            console.log("perfect pair found! [exact score, different schools, different colors]");

            (playerA.color == "white") ? currentPairings.push([playerA, playersByPoints[options[0]]]) : currentPairings.push([playersByPoints[options[0]], playerA]);
            playersByPoints.splice(options[0], 1)
        }

        else if (options[1] != 0) {
            console.log("close to perfect pair found [exact score, different schools, same colors]");

            (playerA.color == "black") ? playerA.color = "white" : playerA.color = "black";  // switch colors
            (playerA.color == "white") ? currentPairings.push([playerA, playersByPoints[options[1]]]) : currentPairings.push([playersByPoints[options[1]], playerA]);
            playersByPoints.splice(options[1], 1)
        }

        else if (options[2] != 0) {
            console.log("close to perfect pair found [score within 0.5, different schools, different colors]")

            // switch colors
            let temp1 = playerA.color;
            playerA.color = playersByPoints[options[2]].color;
            playersByPoints[options[2]].color = temp1;


            (playerA.color == "white") ? currentPairings.push([playerA, playersByPoints[options[2]]]) : currentPairings.push([playersByPoints[options[2]], playerA]);

            playersByPoints.splice(options[2], 1)
        }


        else if (options[3] != 0) {
            console.log("good pair found [score within 0.5, different schools, same colors]");

            (playerA.color == "black") ? playerA.color = "white" : playerA.color = "black";  // switch colors
            (playerA.color == "white") ? currentPairings.push([playerA, playersByPoints[options[3]]]) : currentPairings.push([playersByPoints[options[3]], playerA]);
            playersByPoints.splice(options[3], 1)
        }

        else if (options[4] != 0) {
            console.log("fine pair found [smallest score possible, different schools]")
            if (playerA.color == playersByPoints[options[4]].color) {
                (playerA.color == "black") ? playerA.color = "white" : playerA.color = "black"  // switch colors
            } else {
                temp = playerA.color
                playerA.color = playersByPoints[options[4]].color
                playersByPoints[options[4]].color = temp
            }

            (playerA.color == "white") ? currentPairings.push([playerA, playersByPoints[options[4]]]) : currentPairings.push([playersByPoints[options[4]], playerA]);
            playersByPoints.splice(options[4], 1)
        }

        else if (options[5] != 0) {
            console.log("pair found [smallest score possible]")
            if (playerA.color == playersByPoints[options[5]].color) {
                if (playerA.color == "black") {
                    playerA.color = "white"
                } else {
                    playerA.color = "black"
                }

            } else {
                temp = playerA.color
                playerA.color = playersByPoints[options[5]].color
                playersByPoints[options[5]].color = temp
            }


            if (playerA.color == "white") {
                currentPairings.push([playerA, playersByPoints[options[5]]])
            } else {
                currentPairings.push([playersByPoints[options[5]], playerA])
            }

            playersByPoints.splice(options[5], 1)
        }

        playersByPoints.shift()

        console.log("pair made between " + currentPairings[currentPairings.length - 1][0].name + " and " + currentPairings[currentPairings.length - 1][1].name)

        // am i not supposed to order the players by school here again..?

    }


    // if there is a bye, add them to the list
    if (playersByPoints.length == 1) {
        currentPairings.push([playersByPoints[0], 2])
    }



    // add currentPairings to totalPairings
    pairings.push(currentPairings)

    // display new pairings
    displayPairings("new pairings")

}


function handleOutcome(type, playerA, playerB, row) {

    document.getElementById("pairingsTable").children[row].children[3].children[0].style.backgroundColor = "transparent"
    document.getElementById("pairingsTable").children[row].children[5].children[0].style.backgroundColor = "transparent"

    if (type == "win") {
        // find which column playerA is in based on their chess color
        let column
        (playerA.color == "white") ? column = 3 : column = 5

        // color said column
        document.getElementById("pairingsTable").children[row].children[column].children[0].style.backgroundColor = "#81B64C"

    }

    // if it's a tie
    else {
        document.getElementById("pairingsTable").children[row].children[3].children[0].style.backgroundColor = "#bde992"
        document.getElementById("pairingsTable").children[row].children[5].children[0].style.backgroundColor = "#bde992"
    }
}


function displayPairings(index) {
    activeItem = document.getElementById("pairingsMenu").getElementsByClassName('active')[0]
    if (activeItem) {
        activeItem.classList.remove('active')
    }


    if (index == "new pairings") {
        currentPairings = pairings[pairings.length - 1]
        document.getElementById("pairingsMenu").innerHTML += `<li class="nav-item">
                                                                <a class="nav-link active" aria-current="page" onclick="displayPairings(${pairings.length - 1})">Round ${pairings.length}</a>
                                                            </li>`

        showButton("manual")
    } else {
        currentPairings = pairings[index]
        document.getElementById("pairingsMenu").children[index].children[0].classList.add('active')
        console.log(currentPairings)

        // check if a pairing isn't new but is the last pairing - if so, show the manual options
        if (index == pairings.length - 1) {
            showButton("manual")
        } else {
            showButton("none")
        }
    }


    tableBody = ""

    
    for (i = 0; i < currentPairings.length; i++) {

        // check if the pairing is a real pairing   
        if (isNaN(currentPairings[i][1])) {
            tableBody += `<tr>
                            <td>${i+1}</td>
                            <td>${currentPairings[i][0].score}</td>
                            <td>${currentPairings[i][0].school}</td>
                            <td><span style="background-color: ${color[currentPairings[i][2]]}">${currentPairings[i][0].name}</span></td>
                            <td><button onclick='handleOutcome("win", ${JSON.stringify(currentPairings[i][0])}, ${JSON.stringify(currentPairings[i][1])}, ${i})' class="whiteButton"><</button><button onclick='handleOutcome("draw", ${JSON.stringify(currentPairings[i][0])}, ${JSON.stringify(currentPairings[i][1])}, ${i})'>O</button><button onclick='handleOutcome("win", ${JSON.stringify(currentPairings[i][1])}, ${JSON.stringify(currentPairings[i][0])}, ${i})' class="blackButton">></button></td>
                            <td><span style="background-color: ${color[2 - currentPairings[i][2]]}">${currentPairings[i][1].name}</span></td>
                            <td>${currentPairings[i][1].school}</td>
                            <td>${currentPairings[i][1].score}</td>
                        </tr>`

        }

        // otherwise it is a bye
        else {
            tableBody += `<tr>
                            <td>${i+1}</td>
                            <td>${currentPairings[i][0].score}</td>
                            <td>${currentPairings[i][0].school}</td>
                            <td><span style="background-color: ${color[currentPairings[i][1]]}">${currentPairings[i][0].name}</span></td>
                            <td><button onclick='handleOutcome("bye", ${JSON.stringify(currentPairings[i][0])}, ${JSON.stringify({ "name": "fake", "school": "fake" })}, ${i})' class="whiteButton"><</button></td>
                            <td><span style="display: none"></span></td>
                            <td></td>
                            <td></td>
                        </tr>`
        }
    }

    document.getElementById("pairingsTable").innerHTML = tableBody
}



function editPairings() {
    tableBody = ""


    for (i = 0; i < currentPairings.length; i++) {

        // check if the pairing is a real pairing
        if (isNaN(currentPairings[i][1])) {
            tableBody += `<tr>
                            <td><input value="${currentPairings[i][0].score}"></td>
                            <td><input value="${currentPairings[i][0].school}"></td>
                            <td><input onchange="pairingChanged(${i})" value="${currentPairings[i][0].name}"></td>
                            <td><button class="whiteButton"><</button><button>O</button><button class="blackButton">></button></td>
                            <td><input onchange="pairingChanged(${i})" value="${currentPairings[i][1].name}"></td>
                            <td><input value="${currentPairings[i][1].school}"></td>
                            <td><input value="${currentPairings[i][1].score}"></td>
                        </tr>`

        } else {
            tableBody += `<tr>
                            <td><input value="${currentPairings[i][0].score}"></td>
                            <td><input value="${currentPairings[i][0].school}"></td>
                            <td><input onchange="pairingChanged(${i})" value="${currentPairings[i][0].name}"></td>
                            <td><button class="whiteButton"><</button><button>O</button><button class="blackButton">></button></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>`
        }
    }


    document.getElementById("pairingsTable").innerHTML = tableBody
}

function pairingChanged(row) {
    if (!edits.includes(row)) {
        edits.push(row)
    }

    console.log(edits)
}

function confirmPairings() {
    console.log(currentPairings)
    console.log(edits)

    for (i = 0; i < edits.length; i++) {
        currentRow = document.getElementById("pairingsTable").children[edits[i]]

        // update player 1
        currentPairings[edits[i]][0].score = parseInt(currentRow.children[0].children[0].value)
        currentPairings[edits[i]][0].school = currentRow.children[1].children[0].value
        currentPairings[edits[i]][0].name = currentRow.children[2].children[0].value

        
        // update player 2 IF there even is a player 2
        if (currentPairings[edits[i]][1].name) {
            currentPairings[edits[i]][1].name = currentRow.children[4].children[0].value
            currentPairings[edits[i]][1].school = currentRow.children[5].children[0].value
            currentPairings[edits[i]][1].score = parseInt(currentRow.children[6].children[0].value)
        }

        console.log(currentPairings[edits[i]])
    }


    edits = []

    // call display pairings again to make the table update
    pairings[pairings.length - 1] = currentPairings
    displayPairings(pairings.length - 1)
    showButton("nextPairings")
}


function save() {
    data = {
        "All Pairings": pairings,
        "Final Standings": players
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