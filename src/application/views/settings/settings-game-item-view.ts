
module DMD {
    export class SettingsGameItemView extends showv.View {
        private tpl = new HBSTemplate("settings/game-item");
        private annotationPopup = new HBSTemplate("settings/annotation-popup");
        constructor(private game: Game) {
            super();
        }
        events(): Object {
            return {
                "mouseover .annotate": "showDescription",
                "mouseout .annotate": "hideAllDescription"
            }
        }
        render(): SettingsGameItemView {
            this.$el.append(this.tpl.render(this.game));
            return this;
        }
        showDescription(ev: Event) {
            var $this = $(ev.currentTarget);
            var $annotation = $(this.annotationPopup.render({
                description: $this.attr('data-description'),
                position: {
                    top: $this.position().top - 10,
                    left: $this.position().left
                }
            }));
            $annotation.insertAfter($this);
        }
        hideAllDescription() {
            $('.annotation-popup').hide().remove();
        }
    }
}