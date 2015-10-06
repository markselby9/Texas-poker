/**
 * Created by fengchaoyi on 14/12/8.
 */

//table class

var Table = function(){
    this.deck = [];
    this.players = [];
    this.dealer = 0;
    this.current_controller = 0;
};

if (typeof exports == 'undefined'){
    exports = {};
}
exports.Table = Table;