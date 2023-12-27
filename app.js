const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const dbpath = path.join(__dirname, 'cricketTeam.db')
const app = express()
app.use(express.json())

let db = null
const intializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Sever starts at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
intializeDBandServer()

//GET players API
app.get('/players/', async (request, response) => {
  const getplayersQuery = `SELECT * FROM cricket_team;`
  const playersArray = await db.all(getplayersQuery)
  response.send(playersArray)
})

//POST players API
app.post('/players/', async (request, response) => {
  const playerdetails = request.body
  const {playerName, jerseyNumber, role} = playerdetails
  const addPlayerQuery = `Insert into cricket_team (player_name,jersey_number,role)
  values('${playerName}',${jerseyNumber},'${role}');`
  await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

//GET player with iD
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `select * from cricket_team where player_id = ${playerId}`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

//PUT player with ID
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updateplayerQuery = `update cricket_team set 
  player_name = '${playerName}',jersey_number = ${jerseyNumber},role='${role}'
  where player_id = ${playerId};`
  await db.run(updateplayerQuery)
  response.send('Player Details Updated')
})

//DElete player
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayer = `delete from cricket_team where player_id = ${playerId};`
  await db.run(deletePlayer)
  response.send('Player Removed')
})

module.exports = app
