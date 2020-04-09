import Bg from "./BG";

export default class GameControl extends Laya.Script{
    height: number = Laya.stage.height; //舞台宽高
    width: number = Laya.stage.width;
    bg: Bg; //背景相关数据
    bgImg: Laya.Sprite; //背景图片
    bgx: number; //背景的坐标
    bgy: number;
    moveI: number; //转弯次数
    pxs: number = 3.5;//每帧移动多少像素
    angle: number; //当前路径的角度
    moveX: number; //当前路径下x每次移动的像素
    moveY: number; //当前路径下y每次移动的像素
    gameStart: boolean; //游戏是否已经开始

    constructor(){
        super();
    }

    onEnable(){
        this.bgImg = this.owner.getChildByName("bg") as Laya.Sprite;
        this.bgx = this.bgImg.x;
        this.bgy = this.bgImg.y;
        this.bg = new Bg();
        this.moveI = 0;
        this.angle = this.bg.getDirection(this.moveI);
        this.moveX = this.pxs * this.bg.getMoveX(this.angle);
        this.moveY = this.pxs * this.bg.getMoveY(this.angle);
        this.gameStart = false;
    }

    onClick(){
        if(this.gameStart){
            this.moveI++;
            if(this.moveI % 30 == 0){
                this.pxs += 0.3;
            }
            this.angle = this.bg.getDirection(this.moveI);
            this.moveX = this.pxs * this.bg.getMoveX(this.angle);
            this.moveY = this.pxs * this.bg.getMoveY(this.angle);
        }else{
            this.gameStart = true;
            let txt: Laya.Text = this.owner.getChildByName("startText") as Laya.Text;
            txt.removeSelf();
            console.log("游戏开始");
        }
    }
    
    onUpdate(){
        if(this.gameStart){
            if(this.isDied()){
                this.gameStart = false;
            }else{
                this.bgx += this.moveX;
                this.bgy += this.moveY;
                this.bgImg.pos(this.bgx, this.bgy);
            }
        }
    }
    
    isDied(){
        return false;
    }
}