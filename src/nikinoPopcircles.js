/*global nikinoPopcircle, $*/

; (function($, window, document, undefined) {
    $.widget('ui.nikinoPopcircle', {

        options: {},

        _positionChildren:function() {
            var children = $(".popcircle-container").find(".popcircle-children").children();
            // 2Pi/10 -> only ten placeholders
            var angle = Math.PI * 2 / 10

            var $parent = $(".popcircle-container").find(".popcircle");
            var parentRadius = $parent.outerWidth(true) / 2;
            
            $parent.attr("data-radius", parentRadius);
            
            children.each(function (index, el) {
                var $el = $(el);
                
                var thisRad = $el.width() / 2;
                // to make sure that we start from the 3rd quarter
                var num = index * angle + Math.PI +Math.PI/4;
                
                var posX = parentRadius + (Math.cos(num)) * (parentRadius/2) - thisRad;
                var posY = parentRadius + (-Math.sin(num)) * (parentRadius/2) - thisRad;
                
                $el.attr("data-x-rad-increment", Math.round(Math.cos(num) * parentRadius/2));
                $el.attr("data-y-rad-increment", Math.round(-Math.sin(num) * parentRadius/2));
                
                $el.css({top: posY, left: posX});
            });
        },

        _expandChildren:function(){
             var children = $(".popcircle-container").find(".popcircle-children").children();
             children.finish();
             
             children.each(function (index, el) {
                var $el = $(el);
                
                var newTop = $el.position().top+ +$el.attr("data-y-rad-increment");
                var newLeft = $el.position().left+ +$el.attr("data-x-rad-increment");
                
                $el.animate({top: newTop, left: newLeft, opacity:0.5}, "fast", function(){
                    $el.addClass("popcircle-child-visible");
                });
             });
        },
        
        _foldChildren:function(){
            var children = $(".popcircle-container").find(".popcircle-children").children();
             children.finish();
             children.each(function (index, el) {
                var $el = $(el);
                
                var newTop = $el.position().top- +$el.attr("data-y-rad-increment");
                var newLeft = $el.position().left- +$el.attr("data-x-rad-increment");
                
                $el.animate({top: newTop, left: newLeft, opacity:0.0}, "fast");
                $el.removeClass("popcircle-child-visible");
             });
        },
        
        _delegateEvents: function () {
            var that = this;
            $(".popcircle-container").bind("mouseenter", function (e) {
                var $this = $(this);
                that._expandChildren();
        });

            $(".popcircle-container").bind("mouseleave", function (e) {
                var $this = $(this);
                that._foldChildren();    
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