
module DMD {
    export class Widget {
        constructor(public size: Size, public offset: Offset) {}
    }
    export class Size {
        constructor(public width: number, public height: number) {}
    }
    export class Offset {
        constructor(public top: number, public left: number) {}
    }
}