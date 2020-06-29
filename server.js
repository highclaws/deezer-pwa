const express = require('express')
const path = require('path')

const httpPort = 8080

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})
app.get('/player', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/player.html'))
  })
app.get('/playlist', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/playlist.html'))
})
app.get('/saved', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/saved.html'))
})

app.get('/search', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/search.html'))
})
app.get('/track', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/track.html'))
})

app.listen(httpPort, function () {
  console.log(`Listening on port ${httpPort}!`)
})