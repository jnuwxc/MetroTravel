(function () {
    'use strict';

    class Bg {
        constructor() {
            this.direction = [
                210, 150, 210, 150, 30, 150, 30, 330, 30, 150, 30, 330, 30, 150, 30, 330, 30, 330, 210, 330,
                30, 330, 30, 150, 30, 150, 30, 150, 30, 150, 30, 150, 210, 150, 30, 150, 30, 150, 30, 150,
                30, 330, 30, 330, 30, 330, 30, 330, 30, 150, 30, 150, 30, 330, 210, 330, 210, 330, 210, 330,
                210, 330, 210, 330, 30, 150, 30, 150, 30, 330, 30, 150, 30, 330, 30, 330, 30, 330, 30, 330,
                30, 150, 30, 330, 30, 330, 210, 330, 210, 330, 30, 330, 30, 330, 210, 330, 210, 330, 210, 150,
                210, 150, 210, 150, 210, 330, 210, 330, 210, 330, 210, 330, 210, 150, 210, 150, 210, 150, 30, 150,
                30, 150, 30, 150, 210, 330, 210, 330, 210, 330, 210, 330, 210, 330, 210, 330, 210, 150, 210, 150,
                210, 150, 210, 330, 210, 330, 210, 330, 210
            ];
            this.moveX = { 30: -0.87, 150: 0.87, 210: 0.87, 330: -0.87 };
            this.moveY = { 30: 0.5, 150: 0.5, 210: -0.5, 330: -0.5 };
            this.turnXY = [[-1800, -3225], [-1668, -3130], [-1795, -3032], [-1594, -2917],
                [-1431, -3000], [-1045, -2760], [-1482, -2494], [-1274, -2368], [-800, -2630]];
        }
        getDirection(i) {
            return this.direction[i];
        }
        getMoveX(angle) {
            return this.moveX[angle];
        }
        getMoveY(angle) {
            return this.moveY[angle];
        }
        getTurnXY(i) {
            return this.turnXY[i];
        }
    }

    class GameControl extends Laya.Script {
        constructor() {
            super();
            this.height = Laya.stage.height;
            this.width = Laya.stage.width;
            this.pxs = 3.5;
        }
        onEnable() {
            this.bgImg = this.owner.getChildByName("bg");
            this.bgx = this.bgImg.x;
            this.bgy = this.bgImg.y;
            this.bg = new Bg();
            this.moveI = 0;
            this.angle = this.bg.getDirection(this.moveI);
            this.moveX = this.pxs * this.bg.getMoveX(this.angle);
            this.moveY = this.pxs * this.bg.getMoveY(this.angle);
            this.gameStart = false;
        }
        onClick() {
            if (this.gameStart) {
                this.moveI++;
                if (this.moveI % 30 == 0) {
                    this.pxs += 0.3;
                }
                this.angle = this.bg.getDirection(this.moveI);
                this.moveX = this.pxs * this.bg.getMoveX(this.angle);
                this.moveY = this.pxs * this.bg.getMoveY(this.angle);
            }
            else {
                this.gameStart = true;
                let txt = this.owner.getChildByName("startText");
                txt.removeSelf();
                console.log("游戏开始");
            }
        }
        onUpdate() {
            if (this.gameStart) {
                if (this.isDied()) {
                    this.gameStart = false;
                }
                else {
                    this.bgx += this.moveX;
                    this.bgy += this.moveY;
                    this.bgImg.pos(this.bgx, this.bgy);
                }
            }
        }
        isDied() {
            return false;
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("GameControl.ts", GameControl);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "parkour.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            let txt = new Laya.Text();
            txt.text = "L O A D I N G ...";
            txt.width = 640;
            txt.height = 1138;
            txt.color = "#cc0000";
            txt.fontSize = 40;
            txt.align = "center";
            txt.valign = "middle";
            Laya.stage.addChild(txt);
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
