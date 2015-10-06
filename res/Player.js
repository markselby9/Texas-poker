/**
 * Created by fengchaoyi on 14/12/8.
 */

// player class
var Player = function Player(){
    this.socket = null;
    this.id = '';
    this.money = 100;
    this.nickname = "";
    this.prepared = false;
    this.cards = [];
    var cards_unicode = function () {
        var unicode = [];
        for (var card in cards){
            unicode.push(texas.unicode(card));
        }
        return unicode;
    };
    var bet = 0;

    return{
        cards_unicode:cards_unicode
        //getNickname:getNickname,
        //setNickname:setNickname
    }
};
if(typeof exports == 'undefined'){
    var exports = {};
}
exports.Player = Player;