
module DMD {
    export class Widget {
        constructor(public size: Size, public offset: Offset, public position: Position) {}
    }
    /**
     * Size
     * 画面枠の大きさ
     */
    export class Size {
        constructor(public width: number, public height: number) {}
    }
    /**
     * Offset
     * 画面内でずらす幅
     */
    export class Offset {
        constructor(public top: number, public left: number) {}
    }
    /**
     * Position
     * 画面枠を出す位置
     */
    export class Position {
        constructor(public top: number, public left: number) {}
    }
}