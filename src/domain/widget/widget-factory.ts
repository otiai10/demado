
module DMD {
    export class WidgetFactory {
        public static createDefault(): Widget {
            return new Widget(new Size(800, 480), new Offset(75, 70));
        }
    }
}