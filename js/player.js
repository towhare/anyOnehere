var Player = function(options) {
    if(typeof options === 'undefined'){
        options = {
            type:"Player",
            id:0,
            name:"starter",
            speed:5,
            maxSpeed:20,
            minSpeed:2,
        }
    }
    this.type = "Player";
    this.id =  options.id || 0;
    this.name = options.name || "name";
    this.info = {
        speed: options.speed || 5,
        maxSpeed:options.maxSpeed || 20,
        minSpeed:2,
    };
    this.currentInfo={
        speed:5,
        isMoving:false,
    };
    this.position={
        x:options.position.x || 0,
        y:options.position.y || 0,
    };
    this.targetPosition={
        x:(options.targetPosition && typeof options.targetPosition.x === 'number')? options.targetPosition.x:Math.round(Math.random() * 10 - 5 ),
        y:(options.targetPosition && typeof options.targetPosition.y === 'number')? options.targetPosition.y:Math.round(Math.random() * 10 - 5 )
    };
    this.movingUp = false;
    this.movingDown = false;
    this.movingLeft = false;
    this.movingRight = false;
};

Player.prototype = {
    moving:function(delta){
        if(this.type !== "Player") {return false;}
        if(this.movingUp === true){
            this.targetPosition.y = this.targetPosition.y - this.currentInfo.speed * delta;
        }
        if(this.movingDown === true){
            this.targetPosition.y = this.targetPosition.y + this.currentInfo.speed * delta;
        }
        if(this.movingLeft === true){
            this.targetPosition.x = this.targetPosition.x - this.currentInfo.speed * delta;
        }
        if(this.movingRight === true){
            this.targetPosition.x = this.targetPosition.x + this.currentInfo.speed * delta;
        }
        if(this.movingUp || this.movingDown || this.movingLeft || this.movingRight){
            this.currentInfo.isMoving = true;
            this.changeSpeed(0.2*delta);//这个0.2其实就是加速度
            //此处把移动的目标位置发送到服务端
            //socket.emit('updateSingle',this.name,this.targetPosition);
            AppConnect.sendMovingInfo();

        }else{
            this.currentInfo.isMoving = false;
            this.changeSpeed(-0.4*delta);//减速度
        }
    },
    //改变速度的方法  加速度
    changeSpeed:function(speedChange){
        var speedWillBe = (speedChange + this.currentInfo.speed);
        if(speedWillBe <= this.info.minSpeed){
            this.currentInfo.speed = this.info.minSpeed;
        }else if(speedWillBe <= this.info.maxSpeed ){
            this.currentInfo.speed += speedChange;
        }else if(speedWillBe > this.info.maxSpeed){
            this.currentInfo.speed = this.info.maxSpeed;
        }
    },
    //改变目标位置以及比较目标位置与现有位置的差距并且对现有位置做出改变的方法
    changePosition:function(percent){
        if(percent === undefined){percent = 0.1};
        if(this == null || this.targetPosition === this.position)return false;
        //获取引用
        //如果目标位置与目前位置在一定范围内则直接让目前位置等于目标位置
        if( (this.position.x >= (this.targetPosition.x-0.01)) && (this.position.x <= (this.targetPosition.x + 0.01)) && (this.position.y >= this.targetPosition.y - 0.01) &&( this.position.y <= this.targetPosition.y + 0.01)){
            this.targetPosition.x = Math.round(this.targetPosition.x);
            this.targetPosition.y = Math.round(this.targetPosition.y);
            this.position.x = this.targetPosition.x;
            this.position.y = this.targetPosition.y;
            return false;
        }
        var playerX = this.position.x;
        var playerY = this.position.y;
        //
        var changeX = (this.targetPosition.x - playerX)*percent;
        var changeY = (this.targetPosition.y - playerY)*percent;

        changeX = Math.round(changeX*1000)/1000;
        changeY = Math.round(changeY*1000)/1000;

        this.position.x += changeX;
        this.position.y += changeY;
    },
    //获取玩家位置（对象）
    getPosition:function(){
        return this.position;
    },
    //获取玩家的目标位置
    getTargetPosition:function(){
      return this.targetPosition;
    }
};