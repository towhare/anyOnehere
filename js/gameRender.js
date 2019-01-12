;(function(undefined) {
    "use strict"
    var _global;
    var Tool = {
        initTextCanvas:function(options){
            var settings;
            if(typeof options === 'undefined'){
                console.log('没有传入任何从参数 字是白色的');
                settings = {
                    canvasW : 1000,
                    canvasH : 1000,
                    text:'测试文字',
                    fontColor: 'black',
                    font:'40 微软雅黑'
                }
            }else{
                settings = {
                    canvasW : options.canvasWidth || 400,
                    canvasH : options.canvasHeight || 400,
                    text: options.text || '测试文字',
                    fontColor: options.color || 'white',
                    font:options.font || '30px 微软雅黑'
                }
            }
            var canvas = document.createElement('canvas');
            canvas.width = settings.canvasW;
            canvas.height = settings.canvasH;
            var ctx = canvas.getContext('2d');

            ctx.font = settings.font;
            ctx.fillStyle = settings.fontColor;
            ctx.shadowBlur= 16;
            ctx.shadowColor = "#6666ff";
            ctx.textAlign = 'center';
            ctx.fillText(settings.text,settings.canvasW/2,settings.canvasH/2);

            document.body.appendChild(canvas);
            return canvas;
        },
        initTextSprite:function(canvas){
            var spriteMaterial = new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas)});
            var TextSprite = new THREE.Sprite(spriteMaterial);
            return TextSprite;
        },
        changeText(canvas,options){
            var settings;
            if(typeof options === 'undefined'){
                console.log('没有传入任何从参数 字是白色的');
                settings = {
                    text:'测试文字',
                    fontColor: 'black',
                    font:'40 微软雅黑'
                }
            }else{
                settings = {
                    text: options.text || '',
                    fontColor: options.color || 'white',
                    font:options.font || '30px 微软雅黑'
                }
            }
            var ctx = canvas.getContext('2d');
            //清除画布
            ctx.clearRect(0,0,canvas.width,canvas.height);
            //重绘
            ctx.font = settings.font;
            ctx.fillStyle = settings.fontColor;
            ctx.shadowBlur= 16;
            ctx.shadowColor = "#6666ff";
            ctx.textAlign = 'center';
            ctx.fillText(settings.text,canvas.width/2,canvas.height/2);
        },
		shot(scene,camera){
            var image = new Image();
            gameRender.renderer.render(gameRender.scene, gameRender.camera);

            let imgData = gameRender.renderer.domElement.toDataURL("image/jpeg");
            image.src = imgData;
            document.body.appendChild(image);
		},
		randomColor:function(){
			var letters = '789ABCDEF'.split('');
			var color = '#';
			for (var i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 9)];
			}
			return color;
		}
    }
    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Tool;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return Tool;});
    } else {
        !('Tool' in _global) && (_global.Tool = Tool);
    }
}());
;(function(undefined){
    'use strict';
    var _global;
    //分别是 渲染器 相机 场景
    var renderer, camera, scene,light;
    var playerBox;
    var players;
    var closeStars,backgroundStars;
    var stats;
    var gameRender = {
        //初始化
        renderer : renderer,
        camera :camera,
        scene : scene,
        light : light,
        playerBox: playerBox,
        players:players,
        closeStars:closeStars,
        backgroundStars:backgroundStars,
        stats:stats,
        init:function(){
            if(typeof THREE === 'undefined'){
                console.log('渲染部分需要引用three.js');
                return false;
            }

            var canvas = document.getElementById('output');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;


            this.scene = initScene();
            this.renderer = initRenderer(canvas);
            this.camera = initCamera();
            this.playerBox = initObjs();
            this.light = initLights();
            this.stats = new Stats();
            this.stats.dom.style.left = "150px";
            document.body.appendChild( this.stats.dom );
        },
        initPlayers:function(players){
            var playersGroup = new THREE.Group();
            var index = anyOne.playersName.indexOf(anyOne.currentPlayer.name);
            if(players instanceof Array === true || players.length > 0){
                for(var i = 0 ; i < players.length; i ++){
                    var singlePlayer = players[i];
                    var playerGroup = initaPlayer(singlePlayer);
                    playerGroup.position.set(singlePlayer.position.x,singlePlayer.position.y,0);
                    if(index === i){
                        playerGroup.visible = false;
                    }
                    playersGroup.add( playerGroup );
                }
                this.scene.add(playersGroup);
                return playersGroup;
            }else{
                console.log('no otherPlayers');
            }
        },
        updatePlayersPosition:function(){
            if(typeof (this.players) === 'undefined'){console.log('no players');return false;}
            var index = anyOne.playersName.indexOf(anyOne.currentPlayer.name);
            for(var i = 0 ; i < this.players.children.length; i++ ){
                if(i === index)continue;
                var player = this.players.children[i];
                player.position.x = (anyOne.players[i].position.x)/10;
                player.position.y = - (anyOne.players[i].position.y)/10;
            }
        },
        addAPlayer:function(player){
            var singlePlayer = initaPlayer(player);
            singlePlayer.position.set(player.position.x,player.position.y,0);
            this.players.add(singlePlayer);
        },
        updateCameraPosition:function(){
            var playerPosition = anyOne.currentPlayer.position;
            var cameraPosition = this.camera.position;
            if(cameraPosition.x > (playerPosition.x/10 - 0.1) && cameraPosition.x < (playerPosition.x/10 + 0.1) && cameraPosition.y > (playerPosition.y/10 - 0.1) && cameraPosition.y < (playerPosition.y/10 + 0.1)){
                return false;
            }
            this.camera.position.x += (playerPosition.x/10 - cameraPosition.x)*0.1;
            this.camera.position.y += (playerPosition.y/-10 - cameraPosition.y)*0.1;
        },
        initSomeStarsTest:function(){
            var canvas = generateStarSprite();
            var canvasTexture = new THREE.CanvasTexture(canvas);
            var vertices = [];
            for ( var i = 0; i < 10000; i ++ ) {
                var x = Math.random() * 1000 - 500;
                var y = Math.random() * 1000 - 500;
                var z = Math.random() * 500 - 250;
                vertices.push( x, y, z );
            }
            var textureLoader = new THREE.TextureLoader();
            var geometry = new THREE.BufferGeometry();
            geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
            //var sprite = textureLoader.load( 'img/star.png' );
            var material = new THREE.PointsMaterial( { size: 20, map: canvasTexture, blending: THREE.AdditiveBlending, depthTest: false, transparent : true} );

            var particles = new THREE.Points( geometry, material );
            particles.position.set(0,0,-250)

            //this.scene.add(particles);
            return particles;
        },
        checkPlayerPositionAndInitStars:function (){

        },
        initCloseStars:function(){
            var canvas = generateStarSprite();

            var spriteMaterial = new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,opacity:1});
            var CloseStarGroup = new THREE.Group();
            for(var i = 0 ; i < 500;i++){
                var StarSprite = new THREE.Sprite(spriteMaterial);

                StarSprite.position.set(Math.random()*1000-500,Math.random()*1000-500,Math.random()*100+30)
                StarSprite.scale.set(6,6,1);
                CloseStarGroup.add(StarSprite);
            }
            return CloseStarGroup;
        },
        addATextTest(group,text){
            var newTextCanvas = Tool.initTextCanvas({
                text:text,
                canvasW:300,
                canvasH:100,
                font:'25px 微软雅黑'
            });
            var newTextSprite = Tool.initTextSprite(newTextCanvas);
            newTextSprite.position.set(0,4,0);
            newTextSprite.scale.set(60,60,1);
            group.add(newTextSprite);
        },
        addAText(group,text){
            var newTextCanvas = Tool.initTextCanvas({
                text:text,
                canvasWidth:512,
                canvasHeight:128,
                font:'25px 微软雅黑'
            });
            var newTextSprite = Tool.initTextSprite(newTextCanvas);
            newTextSprite.position.set(0,4,0);
            newTextSprite.scale.set(96,24,1);
            newTextSprite.name = 'message';
            newTextSprite.visible = false;
            group.add(newTextSprite);
        },
        sayMessage(playerGroup,message){
            var messageBox = playerGroup.getObjectByName('message');
            console.log(messageBox.material);
            Tool.changeText(messageBox.material.map.image,{
                text:message,
				color:Tool.randomColor()
            });
            messageBox.material.map.needsUpdate = true;//改变材质的贴图之后需要重新更新
            messageBox.visible = true;
        }
    }
    //创建一个角色的渲染部分的函数 包括名字展现 消息展现等
    function initaPlayer(player){
        var playerGroup = new THREE.Group();//新建组 用于将一个玩家的信息全部存入
        var textCanvas = Tool.initTextCanvas({
            canvasWidth:300,
            canvasHeight:100,
            font:'30px 微软雅黑',
            text:player.name
        });
        var nameSprite = Tool.initTextSprite(textCanvas);
        nameSprite.scale.set(48,16,1);
        nameSprite.position.set(0,-6,0);
        playerGroup.name = player.name;

        playerGroup.add(nameSprite);
        var color = 'rgb('+(Math.round(Math.random()*200)+55)+','+(Math.round(Math.random()*200)+55)+','+(Math.round(Math.random()*200)+55)+')';
        var boxMaterial = new THREE.MeshLambertMaterial({color:color,transparent:true,opacity: 1});
        var boxgeometry = new THREE.BoxGeometry( 2, 2, 2 );
        playerBox = new THREE.Mesh(boxgeometry,boxMaterial);
        playerGroup.add(playerBox);

        gameRender.addAText(playerGroup,'');

        return playerGroup;
    }
    function initRenderer(outPutCanvas){
        renderer = new THREE.WebGLRenderer({antialias:true,canvas:outPutCanvas});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth,window.innerHeight);
        renderer.setClearColor(0x000033);
        return renderer;
    }
    function initScene(){
        scene = new THREE.Scene();
        return scene;
    }
    function initCamera(){
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        //camera = new THREE.OrthographicCamera(-20, 20, 20, -20, 1, 1000 );
        camera.position.set(0,0,200);
        camera.lookAt(0,0,0);
        return camera;
    }
    function initObjs(){
        console.log(anyOne.currentPlayer.name);
        var self = initaPlayer(anyOne.currentPlayer);
        scene.add(self);
        return self;
    }
    function initLights(){
        scene.add(new THREE.AmbientLight(0x444444));
        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(-10, 20, 20);

        light.castShadow = true;
        light.shadow.camera.top = 10;
        light.shadow.camera.bottom = -10;
        light.shadow.camera.left = -10;
        light.shadow.camera.right = 10;

        light.castShadow = true;

        scene.add(light);
        return light;
    }
    function generateStarSprite() {
        //创建canvas画布
        var canvas = document.createElement( 'canvas' );
        canvas.width = 32;
        canvas.height = 32;
        //绘制
        var context = canvas.getContext( '2d' );
        //生成渐变圆点
        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.1, 'rgba(0,125,255,0.8)' );
        gradient.addColorStop( 0.3, 'rgba(0,125,255,0.1)' );
        gradient.addColorStop( 1, 'rgba(0,125,255,0)' );

        context.fillStyle = gradient;
        context.fillRect( 0, 0, canvas.width, canvas.height );

        return canvas;
    }
    //传入玩家数组 初始化玩家
    _global = (function(){return this || (0,eval)('this');}());
    if(typeof module !== 'undefined' && module.exports){
        module.exports = gameRender;
    }else if(typeof define === 'function' && define.amd){
        define(function(){return gameRender;});
    }else{
        !('gameRender' in _global) && (_global.gameRender = gameRender);
    }
}());

