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
  const getplayersQuery = `SELECT * FROM cricket_team ORDER BY player_id;`
  const playersArray = await db.all(getplayersQuery)
  response.send(playersArray)
})
