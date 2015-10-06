/**
 * Created by fengchaoyi on 14/12/8.
 */
var socket;

function init(){
    socket = io();
    // Start listening for events
    setEventHandlers();
}

var setEventHandlers = function() {
    // Socket connection successful
    socket.on("connect", onSocketConnected);
    // Socket disconnection
    socket.on("disconnect", onSocketDisconnect);
    // New player message received
    socket.on("new player", onNewPlayer);
    // Player removed message received
    socket.on("remove player", onRemovePlayer);
    socket.on("player prepared", onPlayerPrepared);
    socket.on("game started", onGameStarted);
    socket.on("table update", onTableUpdated)
};

// Socket connected
function onSocketConnected() {
    console.log("Connected to socket server");
    my_id = socket.id;
    // Send local player data to the game server
    //socket.emit("new player", {});
}

// Socket disconnected
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}

// New player
function onNewPlayer(data) {
    console.log("On New player connected");
    //my_id = data.your_id;
    updateRemoteList(data.players);
}

// Remove player
function onRemovePlayer(data) {
    // Remove player from array
    updateRemoteList(data.players);
}

function onPlayerPrepared(data){
    //var preparePlayer = playerById(data.id);
    //preparePlayer.prepared=true;
    updateRemoteList(data.players);
}

function onGameStarted(data){
    startGame();
}

function onTableUpdated(data){
    console.log('receive table update', data);
    //var is_controller = false;
    //if (data.controller_id == my_id){
    //    is_controller = true;
    //}
    alert('controller');
    updateTableStatus(data.table, data.controller_id);
}

init();