// needs to be able to at least generate the 8th round (so the scores from the 7th can be added)
// currently, when it backs itself into a corner it can't get out of, the code gets stuck in an infinite loop 


// the winning buttons don't work properly sometimes
// has to do with the fail safe for when code backs itself into a corner
// there is nothing to fix the colors if they don't match
// update: the winning buttons should work now, let's check tho




let players = []
let toDelete = []
let pairings = []
let edits = []
let schools = ["Abbey Park High School", "Acton District School", "Aldershot High School", "Craig Kielburger Secondary School",
    "Elsie MacGill Secondary School", "Iroquois Ridge High School", "Milton District High School", "T. A. Blakelock High School"
    , "White Oaks Secondary School", "Bishop Reding Catholic Secondary School"]
let firstPairings = []
let color = ["#81B64C", "#bde992", "transparent"] // win, tie, lose

let byes = []  // list of players who have had a bye

let confirmed = false  // keep track of whether or not they confirmed pairings

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


function addOrRemoveClick() {
    if (document.getElementById("addOrRemove").checked) {
        document.getElementById("schoolSelect").style.visibility = "visible";
    }
    else {
        document.getElementById("schoolSelect").style.visibility = "hidden";
    }
}


function addOrRemoveNewPlayer() {
    if (document.getElementById("addOrRemove").checked) {
        let playerName = document.getElementById("newName").value
        let playerSchool = document.getElementById("newSchool").value

        newPlayer = {
            name: playerName,
            school: playerSchool,
            score: 0,
            color: "black",
        }

        players.push(newPlayer)
        document.getElementById("newName").value = ""
        alert("player succesfully added! will be present in the next rounds")
    }
    else {
        let playerName = document.getElementById("newName").value

        let found = false
        for (let i = 0; i < pairings[pairings.length-1].length; i++) {
            if (pairings[pairings.length-1][i][0].name == playerName) {
                found = true
                break
            }

            console.log(pairings[pairings.length-1][i][1].name)
            if (isNaN(pairings[pairings.length-1][i][1])) {
                if (pairings[pairings.length-1][i][1].name == playerName) {
                    found = true
                    break
                }
            }
        }

        if (!found) {
            alert("ERROR 404: PLAYER NOT FOUND.")
        }
        else {
            toDelete.push(playerName)
            document.getElementById("newName").value = ""
            alert("player will be removed in the next rounds")
        }
    }
}



function automatePlayers() {
    players = JSON.parse('[ { "name": "Kai Bar-on", "school": "Craig Kielburger Secondary School", "score": 0 }, { "name": "Agastya Khanna", "school": "Elsie MacGill Secondary School", "score": 0 }, { "name": "Ryan Nizamani", "school": "White Oaks Secondary School", "score": 0 }, { "name": "Barnett Luo", "school": "White Oaks Secondary School", "score": 0 }, { "name": "Zayan Ahmad", "school": "Milton District High School", "score": 0 }, { "name": "Sukruth Rajesh", "school": "Acton District School", "score": 0 }, { "name": "Marawan Al-Gabri", "school": "Abbey Park High School", "score": 0 }, { "name": "Ritvik Patel", "school": "T. A. Blakelock High School", "score": 0 }, { "name": "Aidan Ouellette", "school": "Iroquois Ridge High School", "score": 0 }, { "name": "Muhammad Ali", "school": "Craig Kielburger Secondary School", "score": 0 }, { "name": "Vidu Widyalankara", "school": "Iroquois Ridge High School", "score": 0 }, { "name": "Charlie Jackson", "school": "Elsie MacGill Secondary School", "score": 0 }, { "name": "Ibrahim Khodabocus", "school": "Craig Kielburger Secondary School", "score": 0 }, { "name": "Hisham Mohammed", "school": "Milton District High School", "score": 0 }, { "name": "Luke Hurley", "school": "Milton District High School", "score": 0 }, { "name": "Angad Ghatora", "school": "Elsie MacGill Secondary School", "score": 0 } ]')
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
                        <th>${i + 1}</th>
                        <td>${players[i].name}</td>
                        <td>${players[i].school}</td>
                        <td><button onclick="removePlayer({name: '${players[i].name}', school: '${players[i].school}'})">X</button></td>
                      </tr>`
    }

    tableBody += ` <tr id="newPlayer">
                        <th></th>
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

            byes.push(playersBySchool[0][0].name)
            currentPairings.push([playersBySchool[0][0], 2])
            playersBySchool[0].shift()
        }

    }


    document.getElementById("pairings").style.display = "block"
    pairings.push(currentPairings)

    addPairingToMenu()
    displayPairings(pairings.length - 1)

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


    // delete players that dropped out
    console.log("need to delete this", toDelete)
    for (i = 0; i < players.length; i++) {

        if (toDelete.includes(players[i].name)) {
            players.splice(i, 1)
            console.log("just remove him")
        }
    }


    console.log(players)
    toDelete = []
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
    playersByPoints = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]

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


    // the code goes through the list making pairs until there are only 2 players left
    // the code then pairs these 2 players together
    // the problem happens when these players have alrd played together

    // if this problem is detected, go up the pairings
    // check if player A has played any of the players before
    // if they haven't, check that the other pair is also not a repeat
    // if success, switch the pairs

    // this algo works
    // but now that i think of it, why do the 2 players we choose to switch with have to be in a pair alrd? can't we just go individually?




    // if odd # of players, determine who gets the bye
    if (playersByPoints.length % 2 != 0) {

        // go through the players, lowest players first
        for (i = playersByPoints.length - 1; i >= 0; i--) {

            // if a player did not already get a bye, give the bye to them
            if (!byes.includes(playersByPoints[i].name)) {
                currentPairings.push([playersByPoints[i], 2])
                byes.push(playersByPoints[i].name)
                console.log(`${playersByPoints[i].name} got the bye`)
                playersByPoints.splice(i, 1)
                break
            }
        }
    }


    while (playersByPoints.length > 2) {
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
            console.log("perfect pair found!\n", playerA.name, "and", playersByPoints[options[0]].name, "\n[exact score, different schools, different colors]");

            (playerA.color == "white") ? currentPairings.push([playerA, playersByPoints[options[0]]]) : currentPairings.push([playersByPoints[options[0]], playerA]);
            playersByPoints.splice(options[0], 1)
        }

        else if (options[1] != 0) {
            console.log("close to perfect pair found\n", playerA.name, "and", playersByPoints[options[1]].name, "\n[exact score, different schools, same colors]");

            (playerA.color == "black") ? playerA.color = "white" : playerA.color = "black";  // switch colors
            (playerA.color == "white") ? currentPairings.push([playerA, playersByPoints[options[1]]]) : currentPairings.push([playersByPoints[options[1]], playerA]);
            playersByPoints.splice(options[1], 1)
        }

        else if (options[2] != 0) {
            console.log("close to perfect pair found\n", playerA.name, "and", playersByPoints[options[2]].name, "\n[score within 0.5, different schools, different colors]")

            // switch colors
            let temp1 = playerA.color;
            playerA.color = playersByPoints[options[2]].color;
            playersByPoints[options[2]].color = temp1;


            (playerA.color == "white") ? currentPairings.push([playerA, playersByPoints[options[2]]]) : currentPairings.push([playersByPoints[options[2]], playerA]);

            playersByPoints.splice(options[2], 1)
        }


        else if (options[3] != 0) {
            console.log("good pair found\n", playerA.name, "and", playersByPoints[options[3]].name, "\n[score within 0.5, different schools, same colors]");

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

        else {
            console.log("awwww, poor guy can't play anyone :(\nmoving to bottom and praying we find smth")
            playersByPoints.push(playerA)
        }


        playersByPoints.shift()

    }


    // there are now 2 players left
    console.log("there are now 2 players left")
    console.log(playersByPoints[0].name + " and " + playersByPoints[1].name)

    // make the pair 
    currentPairings.push([playersByPoints[0], playersByPoints[1]])



    // check if this last pair is unique
    if (!isRepeat(playersByPoints[0].name, playersByPoints[1].name)) {
        console.log("phew! last pair successfully made between " + playersByPoints[0].name + " and " + playersByPoints[1].name)
    }


    // if not, we must go back in the pairings and fix it
    else {
        console.log("fuck, backed myself into a corner - finding better pair now...")


        // other pairings: [playerA, playerB]
        // bad pairing: [playerC, playerD]

        // reverse for loop through currentPairings
        let i = 0;
        for (i = currentPairings.length - 2; i >= 0; i--) {

            if (!isNaN(currentPairings[i][1])){
                console.log('yeah we r cooked')
            }

            // check if playerA & playerC have played together && if playerB & playerD have played together
            if (!isRepeat(currentPairings[i][0].name, currentPairings[currentPairings.length - 1][0].name) && !isRepeat(currentPairings[i][1].name, currentPairings[currentPairings.length - 1][1].name)) {

                // switch players
                let temp = currentPairings[i][0]
                currentPairings[i][0] = currentPairings[currentPairings.length - 1][1]
                currentPairings[currentPairings.length - 1][1] = temp
                break
            }

            // check if playerB & playerC have played together && if playerA & playerD have played together
            else if (!isRepeat(currentPairings[i][1].name, currentPairings[currentPairings.length - 1][0].name) && !isRepeat(currentPairings[i][0].name, currentPairings[currentPairings.length - 1][1].name)) {

                // switch players
                let temp = currentPairings[i][0]
                currentPairings[i][0] = currentPairings[currentPairings.length - 1][0]
                currentPairings[currentPairings.length - 1][0] = temp
                break
            }

        }

        console.log("i", i)
        if (i==-1){
            console.log("---------------------END OF MATCH. NO MORE PAIRINGS POSSIBLE.---------------------")
        }
        console.log(currentPairings[i])

        let playerA = currentPairings[i][0]
        let playerB = currentPairings[i][1]

        console.log("player A color:", playerA.color)
        console.log("player A name:", playerA.name)
        console.log("player B color:", playerB.color)

        // color handling for the switched pair
        // if they have same color, switch one
        if (playerA.color == playerB.color) {
            console.log("colors r the same")
            if (playerA.color == "black") {
                console.log("changing player a to white")
                playerA.color = "white"
            } else {
                console.log("changing player A to black")
                playerA.color = "black"
            }

            // if they have different colors, switch both
        } else {
            console.log("colors r different. switching colors")
            temp = playerA.color
            playerA.color = playerB.color
            playerB.color = temp
            console.log("player A color:", playerA.color)
            console.log("player B color:", playerB.color)
        }

        // ensure that the white one is the first one in the pairing
        if (playerB.color == "white") {
            currentPairings[i] = currentPairings[i].reverse()
        }

    }

    let playerC = currentPairings[currentPairings.length - 1][0]
    let playerD = currentPairings[currentPairings.length - 1][1]

    // color handling for the last pair
    // if they have same color, switch one
    if (playerC.color == playerD.color) {
        if (playerC.color == "black") {
            playerC.color = "white"
        } else {
            playerC.color = "black"
        }

        // if they have different colors, switch both
    } else {
        temp = playerC.color
        playerC.color = playerD.color
        playerD.color = temp
    }

    // ensure that the white one is the first one in the pairing
    if (playerD.color == "white") {
        currentPairings[currentPairings.length - 1] = currentPairings[currentPairings.length - 1].reverse()
    }



    // add currentPairings to totalPairings
    pairings.push(currentPairings)

    playersByPoints = [] // clear the players list

    // display new pairings
    confirmed = false
    document.getElementById("updatePlayers").style.display = "none"
    addPairingToMenu()
    displayPairings(pairings.length - 1)

}


function handleOutcome(type, playerA, playerB, row) {

    document.getElementById("pairingsTable").children[row].children[3].children[0].style.backgroundColor = "transparent"
    document.getElementById("pairingsTable").children[row].children[5].children[0].style.backgroundColor = "transparent"

    if (type == "win") {
        // find which column playerA is in based on their chess color
        let column
        (playerA.color == "white") ? column = 3 : column = 5

        // color that column
        document.getElementById("pairingsTable").children[row].children[column].children[0].style.backgroundColor = "#81B64C"

    }

    // if it's a tie
    else {
        document.getElementById("pairingsTable").children[row].children[3].children[0].style.backgroundColor = "#bde992"
        document.getElementById("pairingsTable").children[row].children[5].children[0].style.backgroundColor = "#bde992"
    }
}


function addPairingToMenu() {
    document.getElementById("pairingsMenu").innerHTML += `<li class="nav-item">
                                                            <a class="nav-link active" aria-current="page" onclick="displayPairings(${pairings.length - 1})">Round ${pairings.length}</a>
                                                        </li>`
}


function displayPairings(index) {
    // disable the currently active menu button
    activeItem = document.getElementById("pairingsMenu").getElementsByClassName('active')[0]
    if (activeItem) {
        activeItem.classList.remove('active')
    }

    // if pairings are the last ones and are not confirmed, show the manual button
    (index == pairings.length - 1 && !confirmed) ? showButton("manual") : showButton("nextPairings");

    // if pairings are not the last ones, don't show any buttons
    (index != pairings.length - 1) && showButton("none");

    // set currentPairings to the right pairings
    currentPairings = pairings[index]
    document.getElementById("pairingsMenu").children[index].children[0].classList.add('active')


    tableBody = ""
    for (i = 0; i < currentPairings.length; i++) {

        // check if the pairing is a real pairing   
        if (isNaN(currentPairings[i][1])) {
            tableBody += `<tr>
                            <td>${i + 1}</td>
                            <td>${currentPairings[i][0].score}</td>
                            <td>${currentPairings[i][0].school}</td>
                            <td><span style="background-color: ${color[currentPairings[i][2]]}">${currentPairings[i][0].name}</span></td>

                            <!-- if the pairing is new (or just the last pairing) AND these pairings are confirmed, show the outcome buttons-->
                            ${(index == pairings.length - 1 && confirmed) ?
                    `<td><button onclick='handleOutcome("win", ${JSON.stringify(currentPairings[i][0])}, ${JSON.stringify(currentPairings[i][1])}, ${i})' class="whiteButton"><</button><button onclick='handleOutcome("draw", ${JSON.stringify(currentPairings[i][0])}, ${JSON.stringify(currentPairings[i][1])}, ${i})'>O</button><button onclick='handleOutcome("win", ${JSON.stringify(currentPairings[i][1])}, ${JSON.stringify(currentPairings[i][0])}, ${i})' class="blackButton">></button></td>`
                    : `<td></td>`}

                            <td><span style="background-color: ${color[2 - currentPairings[i][2]]}">${currentPairings[i][1].name}</span></td>
                            <td>${currentPairings[i][1].school}</td>
                            <td>${currentPairings[i][1].score}</td>
                        </tr>`

        }

        // otherwise it is a bye
        else {
            tableBody += `<tr>
                            <td>${i + 1}</td>
                            <td>${currentPairings[i][0].score}</td>
                            <td>${currentPairings[i][0].school}</td>
                            <td><span style="background-color: ${color[currentPairings[i][1]]}">${currentPairings[i][0].name}</span></td>
                            
                            <!-- if the pairing is new (or just the last pairing) AND these pairings are confirmed, show the outcome buttons-->
                            ${(index == pairings.length - 1 && confirmed) ?
                    `<td><button onclick='handleOutcome("bye", ${JSON.stringify(currentPairings[i][0])}, ${JSON.stringify({ "name": "fake", "school": "fake" })}, ${i})' class="whiteButton"><</button></td>`
                    : `<td></td>`}
                            
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
                            <td>${i + 1}</td>
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
                            <td>${i + 1}</td>
                            <td><input value="${currentPairings[i][0].score}"></td>
                            <td><input value="${currentPairings[i][0].school}"></td>
                            <td><input onchange="pairingChanged(${i})" value="${currentPairings[i][0].name}"></td>
                            <td><button class="whiteButton"><</button><button>O</button><button class="blackButton">></button></td>
                            <td><input onchange="pairingChanged(${i})" value=""></td>
                            <td><input value=""></td>
                            <td><input value=""></td>
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
    console.log("pairings confirmed by user ✅")
    console.log("current pairings:", currentPairings)
    console.log("edits:", edits)

    // update any edits they made to the arrays
    for (i = 0; i < edits.length; i++) {
        currentRow = document.getElementById("pairingsTable").children[edits[i]]

        // update player 1
        currentPairings[edits[i]][0].score = parseFloat(currentRow.children[1].children[0].value)
        currentPairings[edits[i]][0].school = currentRow.children[2].children[0].value
        currentPairings[edits[i]][0].name = currentRow.children[3].children[0].value


        // update player 2 IF there even is a player 2
        if (currentPairings[edits[i]][1].name) {
            currentPairings[edits[i]][1].name = currentRow.children[5].children[0].value
            currentPairings[edits[i]][1].school = currentRow.children[6].children[0].value
            currentPairings[edits[i]][1].score = parseFloat(currentRow.children[7].children[0].value)
        }

        console.log(currentPairings[edits[i]])
    }


    edits = []

    // call display pairings again to make the table update
    pairings[pairings.length - 1] = currentPairings
    confirmed = true
    document.getElementById("updatePlayers").style.display = "block"
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