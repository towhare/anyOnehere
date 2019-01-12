let express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    players = [],
    playersName = [],
    msgLog = [];
app.use('/',express.static(__dirname + '/new'));
server.listen(process.env.PORT || 1232,() => {
    console.log('listening on *:1232');
})

let anyOne = io.of('/anyOne');

anyOne.on('connection',anyOne => {
    console.log('someOne connect anyoneApp');
    //连接事件
    anyOne.on("login",(playerInfo)=>{
        console.log('login event activated')
        if(playerInfo && typeof playerInfo.name !== 'undefined'){
            console.log('玩家:('+playerInfo.name.toString()+')尝试登陆');
            if(playersName.indexOf(playerInfo.name) < 0){
                if(playerInfo.name.length > 12){
                    anyOne.emit('nameTooLong');
                    return false;
                }
                anyOne.nickname = playerInfo.name;
                //将数组中添加玩家信息以及玩家姓名
                players.push(playerInfo);
                playersName.push(playerInfo.name);

                //发送登录成功消息 并传送目前服务器中玩家的信息
                anyOne.emit('loginSuccess',players,playersName);
                //向其他客户端广播有一个新的玩家加入了游戏
                anyOne.broadcast.emit('newPlayerJoin',playerInfo);
            }else{
                anyOne.emit('nameExited');
            }
        }
        else{
            console.log('player not exited or name not defined')
        }
    });
    //退出连接事件
    anyOne.on("disconnect",()=>{
        if(anyOne.nickname != null){
            let nameIndex = playersName.indexOf(anyOne.nickname);
            anyOne.broadcast.emit('aPlayerExit',anyOne.nickname);
            players.splice(nameIndex,1);
            playersName.splice(nameIndex,1);
            console.log(''+ anyOne.nickname+' disconnected,players now:'+playersName);
        }else{
            console.log('一位无名氏直接退出了');
        }
    });
    //某玩家位置更新事件
    anyOne.on("updateSingle",(name,position)=>{
        let playerIndex = playersName.indexOf(name);
        if(playerIndex < 0){return false;}
        else if(name === anyOne.nickname){
            anyOne.emit('updateSinglePlayerPosition',name,position);
        }
        players[playerIndex].position = position;
        players[playerIndex].targetPosition = position;
        anyOne.broadcast.emit('updateSinglePlayerPosition',name,position);
    });
    anyOne.on('sendMessage',(name,message)=>{
        console.log('recive message'+message);
        let playerIndex = playersName.indexOf(name);
        if(playerIndex < 0 || message === '')return false;
        console.log('broadcase message');
        anyOne.broadcast.emit('singlePlayerMessage',name,message);
    })
})