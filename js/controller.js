;(function() {
    'user strict';
    var _global;
    var controller = {
        initAWSD:function(targetPlayer){
            var combos = [
                {
                    keys: "w",
                    on_keydown: function () {
                        if(anyOne.messageUI.inputting === true){
                            return
                        }
                        if (targetPlayer.movingUp === true) {
                            return
                        }
                        targetPlayer.movingUp = true;
                    },
                    on_keyup: function () {
                        if(anyOne.messageUI.inputting === true){
                            return
                        }
                        if (targetPlayer.movingUp === false) {
                            return
                        }
                        targetPlayer.movingUp = false;
                        AppConnect.forceSendMovingInfo();
                    }
                },
                {
                    keys: "s",
                    on_keydown: function () {
                        if(anyOne.messageUI.inputting === true){
                            return
                        }
                        if (targetPlayer.movingDown === true) {
                            return
                        }
                        targetPlayer.movingDown = true;
                    },
                    on_keyup: function () {
                        if(anyOne.messageUI.inputting === true){
                            return
                        }
                        if (targetPlayer.movingDown === false) {
                            return
                        }
                        AppConnect.forceSendMovingInfo();
                        targetPlayer.movingDown = false;
                    }
                },
                {
                    keys: "a",
                    on_keydown: function () {
                        if(anyOne.messageUI.inputting === true){
                            return
                        }
                        if (targetPlayer.movingLeft === true) {
                            return false;
                        }
                        targetPlayer.movingLeft = true;
                    },
                    on_keyup: function () {
                        if(anyOne.messageUI.inputting === true){
                            return
                        }
                        if (targetPlayer.movingLeft === false) {
                        }
                        AppConnect.forceSendMovingInfo();
                        targetPlayer.movingLeft = false;
                    }
                },
                {
                    keys: "d",
                    on_keydown: function () {
                        if(anyOne.messageUI.inputting === true){
                            return
                        }
                        if (targetPlayer.movingRight === true) {
                            return
                        }
                        targetPlayer.movingRight = true;
                    },
                    on_keyup: function () {
                        if(anyOne.messageUI.inputting === true){
                            return
                        }
                        AppConnect.forceSendMovingInfo();
                        if (targetPlayer.movingRight === false) {
                            return
                        }
                        targetPlayer.movingRight = false;
                    }
                },
                {
                    keys: "enter",
                    on_keydown: function (e) {
                        e.preventDefault();
                    },
                    on_keyup: function (e) {

                        console.log('key "enter" up')
                        var input = document.getElementById("messageInput");
                        if(anyOne.messageUI.inputting === false){
                            anyOne.messageUI.inputting = true;
                            if(input){
                                input.focus();
                            }
                        }
                        else if(anyOne.messageUI.inputting){
                            if(input){
                                if(input.innerText === ""){
                                    console.log('没有任何东西不发送信息')
                                }
                                else{
                                    var message = input.innerText;
                                    console.log('获取信息：'+message);
                                    anyOne.messageUI.preMessage = message;
                                    AppConnect.sendMessage();
                                    gameRender.sayMessage(gameRender.playerBox,message);
                                    anyOne.addNewMsg(anyOne.currentPlayer.name,message);
                                }
                                input.innerText = '';//清空
                                input.blur();
                            }
                            anyOne.messageUI.inputting = false;
                        }
                    }
                },
            ];
            return combos;
        }
    }
    _global = (function(){return this || (1,eval)('this');}());
    if(typeof module !== 'undefined' && module.exports){
        module.exports = controller;
    }else if(typeof define === "function" && define.amd){
        define(function(){return controller;})
    }else{
        !('controller' in _global) && (_global.controller = controller);
    }
}())