/**
 * Created by fengchaoyi on 14/12/8.
 */
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var Player = require('./res/Player.js').Player;
var Table = require('./res/Table.js').Table;

var players = [];
var table = new Table();
var texas = require('texas');
// a hashmap for socket
var socket_map = {
    Set : function(key,value){this[key] = value},
    Get : function(key){return this[key]},
    Contains : function(key){return (this.Get(key) != null)},
    Remove : function(key){delete this[key]}
};


function init(){
    players = [];
    //routing
    app.use("/res", express.static(__dirname + '/res'));
    app.use("/", express.static(__dirname + '/'));
    app.get('/', function(req, res){
        res.sendFile(__dirname+'/index.html');
    });
    io.on('connection', onSocketConnection);
}

function onSocketConnection(client){
    console.log('new socket connected');
    client.on('disconnect',onClientDisconnect);
    client.on('new player', onNewPlayer);
    client.on('prepare', onPrepare);
    client.on('player action',onPlayerAction);
}

// player disconnect
function onClientDisconnect(){
    var removePlayer = indexOfPlayerById(this.id);
    if (removePlayer!=-1){
        // Remove player from players array
        players.splice(removePlayer, 1);

        // Broadcast removed player to connected socket clients
        this.broadcast.emit("remove player", {players: players});
    }
    //socket_map.Remove(this.id);
}

function onNewPlayer(data){
    // Create a new player
    var newPlayer = new Player();
    newPlayer.id = this.id;
    newPlayer.nickname = data.nickname;
    newPlayer.prepared = false;
    //newPlayer.socket = this;
    players.push(newPlayer);
    //socket_map.Set(this.id, this);

    var i;
    for (i = 0; i < players.length; i++) {
        this.broadcast.emit("new player", {your_id:players[i].id, players:players});
        this.emit("new player", {your_id:players[i].id, players:players});
    }
}

function onPrepare(data){
    var index = indexOfPlayerById(this.id);
    players[index].prepared = true;
    this.emit('player prepared', {players:players});
    this.broadcast.emit('player prepared', {players:players});
    var canbegin = false;
    if (players.length>=2){
        canbegin = true;
        for (var i in players){
            if (false == players[i].prepared) {
                canbegin = false;
            }
        }
    }
    if (canbegin){
        startGame();
    }
}

function indexOfPlayerById(id){
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return i;
    }
    return -1;
}

//======== start game ===========

function startGame(data){
    console.log("Start GAME");
    table = new Table();
    table.deck = texas.deck();
    table.players = players;

    //set socket map
    var t;
    for (t = 0; t < io.sockets.sockets.length; t++){
        var socket = io.sockets.sockets[t];
        socket_map.Set(socket.id, socket);
    }

    //send cards to players
    for (var i in table.players){
        var player = table.players[i];
        var cards = [];
        cards.push(table.deck.pop());
        cards.push(table.deck.pop());
        player.cards = cards.slice();
        console.log(cards);
    }

    table.current_controller = table.dealer;
    var controller_id = table.players[table.current_controller].id;
    //table.startController();
    io.sockets.emit('game started');

    var controller_socket = socket_map.Get(controller_id);
    controller_socket.emit('table update', {table:table});
    //controller_socket.broadcast('table update', {table:table});
    //io.sockets.emit('table update',
    //    {table:table, controller_id:controller_id}
    //);
}

// after a player make an action
function onPlayerAction(data){
    var action = data.action;
    var index = getPlayerIdInTable(this.id, table.players);
    if (action == 'check'){
        table.players[i].money -= 10;
        table.current_player = (table.current_player == this.players.length)?0:table.current_player+1;
    }
}

//get the index of acted player in the table object
function getPlayerIdInTable(id, players_array){
    var i;
    for (i=0;i<players_array.length;i++){
        if (players_array[i].id == id){
            return i;
        }
    }
    return -1;
}

init();
server.listen(3000, function () {
    console.log('listening to port 3000...')
});