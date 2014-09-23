/// <reference path="../../definitions/handlebars.d.ts" />
module DMD {
    export class HBSTemplate {
        private template: HandlebarsTemplate = null;
        constructor(private name: string) {
            this.template = HBS['src/tpl/' + name + '.hbs'];
        }
        render(param?: Object): string {
            return this.template(param);
        }
    }
}