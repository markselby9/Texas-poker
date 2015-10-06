/**
 * Created by fengchaoyi on 14/12/8.
 */

$('#nickname-div').show();
$('#prepare-div').hide();
$('#game-div').hide();

//set nickname
$('#nickname-btn').click(function () {
    var name = $('#nickname-inbox').val();
    if (name.length>0){
        socket.emit('new player', {
            nickname:name
        });
        $('#nickname-div').hide();
        $('#prepare-div').show();
    }else{
        alert('please input a valid nickname')
    }
});


$('#prepare-btn').click(function(){
    socket.emit('prepare');
    //$('#prepare-btn').attr('disabled', true);
});


function updateRemoteList(players){
    var html = "";
    for (var index in players){
        var player_nickname = players[index].nickname;
        var prepared = players[index].prepared;
        html+="<li>"+player_nickname+" ["+prepared+"]</li>";
    }
    $('#player-list').html(html);
}
function startGame(){
    $('#nickname-div').hide();
    $('#prepare-div').hide();
    $('#game-div').show();
}

function updateTableStatus(tabledata, is_controller, controller_id){
    if (is_controller){
        $('#my-controller').show();
    }else{
        $('#my-controller').hide();
    }
    console.log(tabledata);
    $('#game-table').html(JSON.stringify(tabledata));
    $('#other-players').html();
    //var local_player_html = "<div class=\"player\">";
    //local_player_html += "<p>Nickname:"+local_player.nickname+"</p>";
    //local_player_html += "<p>My card: "+local_player.cards_unicode()+"</p>";
    //local_player_html += "</div>";
    //$('#my-controller').html(local_player_html);
    //var table_html = "<p>Now controlling is: "+tabledata.controlling_id+"</p>";
    //$('#game-table').html(table_html);
    //var other_players_html = "<p>Now controlling is: "+tabledata.controlling_id+"</p>";
    //$('#other-players').html(other_players_html);
}

$('#check-btn').click(function(){
    alert();
    socket.emit('player action',{
        action:'check'
    });
});