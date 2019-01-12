
var anyOne = new Vue({
    el:"#VueApp",
    data:{
        currentPlayer:{
            name:'???',
            Type:'Player',
            position:{
                x:0,
                y:0,
            },
            targetPosition:{
                x:0,
                y:0
            },
            currentInfo:{
                speed:5
            }
        },
        players:[

        ],
        playersName:[

        ],
        loginUI:{
            allHidden:false,
            ishidden:false,
            nameShow:"",
            info:"请输入昵称，w/a/s/d 移动 enter打开发送信息窗口",
            isLogin:false
        },
        messageUI:{
            playerMsgs:[
                {
                    playName:'system',
                    message:'欢迎~~',
                    time:''
                }
            ],
            isHide:true,
            preMessage:'',
            inputting:false,
            msgGroup:[
                {
                    player:'系统',
                    msg:'欢迎进入',
                    color:'red',
                    time:''
                }
            ]
        }
    },
    methods:{
        login(){
            if(this.loginUI.nameShow === ""){
                console.log('未输入姓名');
                this.loginUI.info = "不能为空";
            }else{
                this.currentPlayer.name = this.loginUI.nameShow;
                AppConnect.login(this.currentPlayer)
            }
        },
        messageShow(){
            if(this.messageUI.isHide){
                this.messageUI.isHide = false;
            }else{
                this.messageUI.isHide = true;
            }
        },
        now(){
            var date = new Date();
            function addzero(num){
                var text = '';
                if(num<10){
                    text='0'+num;
                }else{
                    text=num;
                }
                return text;
            }
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            var dataText = addzero(hour)+':'+addzero(min)+':'+addzero(sec);
            console.log(dataText);
            return dataText;
        },
        addNewMsg(playerName,text){
            var color = '#33ccff';
            var time = this.now();
            var msgObj = {
                player:playerName,
                time:time,
                color:color,
                msg:text
            }
            this.messageUI.msgGroup.push(msgObj);
            Vue.nextTick(function () {
                var msgContainer = document.getElementById('msgContainer');
                if(msgContainer){
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }
            })
        },
        sendMessage(){
            var input = document.getElementById('messageInput')
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
        }
    }
});
;(function(undefined){
    "use strict";
    var _global;
    var game = {
        init: function () {
            var player1 = new Player({
                name:'towrabbit',
                position:{
                    x:0,
                    y:0
                }
            });
            anyOne.currentPlayer = player1;
            var combos = controller.initAWSD(anyOne.currentPlayer);
            keypress.register_many(combos);

            //通过插件添加控制器

        },
        //创建一个新的玩家
        initNewPlayer:function(playerInfo){
            var playerToNew = new Player({
                name:playerInfo.name,
                Type:playerInfo.Type,
                position:playerInfo.position,
                targetPosition:playerInfo.targetPosition,
                currentInfo:playerInfo.currentInfo,
            });
            return playerToNew;
        },
        throttle:function(callback, delay) {
            console.log('throttle...');
            var previousCall = new Date().getTime();
            return function() {
                var time = new Date().getTime();
                if ((time - previousCall) >= delay) {
                    console.log('send');
                    previousCall = time;
                    callback.apply(null, arguments);
                }
            };
        },
    }

    _global = (function(){return this || (0,eval)("this");}());
    if(typeof module !== "undefined" && module.exports){
        module.exports = game;
    }else if(typeof define === "function" && define.amd){
        define(function(){return game;});
    }else{
        !('game' in _global)&& (_global.game = game);
    }
}());


var delta = new Date() - 0;
function render(){
    gameRender.updateCameraPosition();
    gameRender.updatePlayersPosition();
    gameRender.playerBox.position.x = (anyOne.currentPlayer.position.x)/10;
    gameRender.playerBox.position.y = - (anyOne.currentPlayer.position.y)/10;
    gameRender.renderer.render(gameRender.scene,gameRender.camera);
    gameRender.stats.update();
}

function loop(){
    var now = new Date() - 0;
    var d = (now - delta)/(1000/60);
    delta = now;
    update(d);//数据层更新
    render();
    //将渲染层的更新放在这


    requestAnimationFrame(loop);
}

function update(delta){
    anyOne.currentPlayer.moving(delta);
    anyOne.currentPlayer.changePosition();
    for(var i = 0 ; i < anyOne.players.length; i++){
        anyOne.players[i].changePosition();
    }
}

var AppConnect = new Connection();
AppConnect.init("http://193.112.88.60:1232/anyOne");
game.init();
window.onload = function(){
}
