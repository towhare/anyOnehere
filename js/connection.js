var Connection = function(){
    this.socket = null;
    this.time = new Date().getTime();
    this.startTime = this.time;
}
Connection.prototype = {
    init:function(url){
        this.socket = io.connect(url);
        this.socket.on('connect',function(){
            anyOne.loginUI.ishidden = true;
            console.log('connect success');
        });
        this.socket.on('nameTooLong',function(){
            console.log('名字太长了');
            anyOne.loginUI.info = "名字太长了，不要超过12个字";
        })
        //登录成功事件监听
        this.socket.on('loginSuccess',function(players,playersName){
            console.log('服务器这个时候应该传回信息');
            anyOne.players = [];
            for(var i = 0 ; i < players.length; i++){
                var player = game.initNewPlayer(players[i]);
                console.log(player);
                anyOne.players.push(player);
            }

            anyOne.playersName = playersName;
            anyOne.loginUI.info = "登陆成功,正在初始化渲染";
            gameRender.init();

            anyOne.loginUI.isLogin = true;


            gameRender.players = gameRender.initPlayers(players);
            gameRender.backgroundStars = gameRender.initSomeStarsTest();
            //gameRender.closeStars = gameRender.initCloseStars();



            for(var i = -5 ; i <= 5; i++ ){
                for(var j = -5 ; j <= 5 ; j++ ){
                    var stars2 = gameRender.backgroundStars.clone();
                    /*var stars3 = gameRender.closeStars.clone();*/
                    stars2.position.set(1000 * i,1000*j,-250);
                    gameRender.scene.add(stars2);

                    /*stars3.position.set(1000 * i,1000*j,-250);
                    gameRender.scene.add(stars3);*/
                    console.log('complate:'+i+','+j);
                }
            }
            anyOne.loginUI.info = "渲染完成";
            anyOne.loginUI.allHidden = true;
            loop();//开启游戏帧数循环
        });
        //有个新的玩家加入
        this.socket.on('newPlayerJoin',function(newPlayer){
            if(anyOne.loginUI.isLogin === false){
                return false;
            }
            var player = game.initNewPlayer(newPlayer);
            anyOne.players.push(player);
            anyOne.playersName.push(player.name);
            gameRender.addAPlayer(player);
        });
        //有个玩家退出
        this.socket.on('aPlayerExit',function(playerName){
            if(anyOne.loginUI.isLogin === false){
                return false;
            }
            console.log('玩家'+playerName+"退出");
            var index = anyOne.playersName.indexOf(playerName);
            if(index < 0){
                console.log("没这个人");
                return false;
            }else{
                //清理
                anyOne.playersName.splice(index,1);
                anyOne.players.splice(index,1);
                gameRender.players.children.splice(index,1);
            }
        })
        this.socket.on('nameExited',function(){
            anyOne.loginUI.info = "抱歉，用户名已经存在，请换一个吧";
        });
        this.socket.on('updateSinglePlayerPosition',function(name,position){
            //没有登录不获取信息
            if(anyOne.loginUI.isLogin === false){
                return false;
            }
            var index = anyOne.playersName.indexOf(name);
            if(index >= 0){
                anyOne.players[index].targetPosition = position;
            }
        })
        this.socket.on('singlePlayerMessage',function(name,message){
            var index = anyOne.playersName.indexOf(name);
            console.log('获得服务器发送的信息：'+message);
            if(index>=0){
                gameRender.sayMessage(gameRender.players.children[index],message);
                anyOne.addNewMsg(name,message);
            }
        })
    },
    login:function(){
        if(typeof this.socket === "undefined"){
            console.log('未初始化')
            return false;
        }else if(anyOne.loginUI.nameShow){
            anyOne.currentPlayer.name = anyOne.loginUI.nameShow;
            this.socket.emit('login',anyOne.currentPlayer);
            anyOne.loginUI.info = "登陆中";
        }
    },
    sendMovingInfo:function(){
        var timeNow = new Date().getTime();
        if(timeNow - this.time < 50){
            return false;
        }
        console.log('sendMoving info');
        this.socket.emit('updateSingle',anyOne.currentPlayer.name,anyOne.currentPlayer.targetPosition)
    },
    sendMessage:function(){
        console.log('sendMessage');
        this.socket.emit('sendMessage',anyOne.currentPlayer.name,anyOne.messageUI.preMessage)
    },
    forceSendMovingInfo:function(){
        this.socket.emit('updateSingle',anyOne.currentPlayer.name,anyOne.currentPlayer.targetPosition)
    }
}