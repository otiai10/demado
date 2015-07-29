
module DMD {
    export class AddGameView extends showv.View {
        private tpl = new HBSTemplate("settings/add-game");
        private editTpl = new HBSTemplate("settings/edit-game");
        private commitEnabled = false;
        events(): Object {
            return {
                "click img#add-game-commit": "addGameCommit",
                "change input": "validate"
            };
        }
        render(): AddGameView {
            this.$el.append(this.tpl.render());
            return this;
        }
        renderWithGame(game: Game): AddGameView {
            this.$el.append(this.editTpl.render(game));
            this.commitEnabled = true;
            return this;
        }
        addGameCommit() {
            if (! this.commitEnabled) return this.showInvalidity("入力が不正です");
            var name = this.getInput("name");
            var url = this.getInput("url");
            var width = this.getInput("width");
            var height = this.getInput("height");
            var left = this.getInput("left");
            var top = this.getInput("top");
            GameFactory.createFromInputs(url,name,parseInt(width), parseInt(height),parseInt(left),parseInt(top))
                .done((game: Game) => {
                    GameRepository.ofLocal().save(game).done(() => {
                        // TODO: this.refresh();
                        window.alert("追加しました");
                        location.reload();
                    });
                });
        }
        private getInput(key: string): string {
            return this.$el.find("input[name='" + key + "']").val();
        }
        validate(ev: Event) {
            var target = $(ev.currentTarget);
            if (! this[target.attr('name') + "Validation"]) return;
            this[target.attr('name') + "Validation"](target.val());
        }
        nameValidation(name: string) {
            if (name.length == 0) {
                this.showInvalidity("名前は必須です");
                return this.disable();
            }
            this.enable();
        }
        urlValidation(url: string) {
            if (! GameFactory.expressions["dmm"].test(url)
                && ! GameFactory.expressions["yahoomobage"].test(url)) {
                this.showInvalidity(
                    GameFactory.expressions["dmm"]
                    + "\nまたは、\n" + GameFactory.expressions["yahoomobage"]
                    + "\nの形式のURLを入力してください"
                );
                return this.disable();
            }
            this.enable();
        }
        showInvalidity(message: string) {
            this.$el.find('#validation-message').html(message);
        }
        disable() {
            $('img#add-game-commit').addClass("disabled");
            this.commitEnabled = false;
        }
        enable() {
            this.$el.find('#validation-message').html("");
            $('img#add-game-commit').removeClass("disabled");
            this.commitEnabled = true;
        }
    }
}