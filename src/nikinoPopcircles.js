/*global nikinoPopcircle, $*/

; (function($, window, document, undefined) {
    $.widget('ui.nikinoPopcircle', {

        options: {},

        _positionChildren:function() {
            var children = $(".popcircle-container").find(".popcircle-children").children();
            var angle = Math.PI * 2 / children.length;

            var parent = $(".popcircle-container").find(".popcircle");
            var parentRadius = parent.outerWidth(true) / 2;

            children.each(function (index, el) {
                var thisRad = $(el).width() / 2;
                var num = index * angle;
                var posX = parentRadius + (Math.cos(num)) * (parentRadius) - thisRad;
                var posY = parentRadius + (-Math.sin(num)) * (parentRadius) - thisRad;

                $(el).css({top: posY, left: posX});
            });
        },

        _delegateEvents: function () {
            $(".popcircle-container").bind("mouseenter", function (e) {
                var $this = $(this);
                $this.find(".popcircle-child-free").switchClass("popcircle-child-free", "popcircle-child-active", "slow");
            });

            $(".popcircle-container").bind("mouseleave", function (e) {
                var $this = $(this);
                $this.find(".popcircle-child-active").switchClass("popcircle-child-active", "popcircle-child-free", "fast");
            });

            $(".popcircle-container").draggable({
                handle: ".popcircle",
                containment: "parent"
            })
        },

        _create: function () {
            var options = this.options;

            this._positionChildren();
            this._delegateEvents();
        },

        _setOption: function (key, value) {
            this.options[key] = value;
        },

        _destroy: function () {
            $.Widget.prototype.destroy.apply(this, arguments);
        }
    });
})($, window, document);