/*global nikinoPopcircle, $*/

; (function($, window, document, undefined) {
    $.widget('ui.nikinoPopcircle', {

        _datasource:"",
        
        options: {
            itemsJson:""
        },

        _create: function () {
            var options = this.options;
            var $this = this.$this = $(this.element);
            this._initHtml();
            this._addExpander();
            this._positionChildren();
            this._delegateEvents();
        },

        _setOption: function (key, value) {
            this.options[key] = value;
        },

        _destroy: function () {
            $.Widget.prototype.destroy.apply(this, arguments);
        },
        
        _initHtml:function(){
            var html = '\
            <div class="popcircle-container" data-active-group="1">\
                <div class="circle-base popcircle" data-json-name="">\
                </div>\
                <div class="popcircle-children" data-item-group="1">\
                    <div class="circle-base popcircle-child popcircle-back" data-json-back="json_name">\
                        <span class="glyphicon glyphicon-circle-arrow-left popcircle-child-glyph" aria-hidden="true"></span>\
                    </div>\
                    <div class="circle-base popcircle-child popcircle-settings">\
                        <span class="glyphicon glyphicon-cog popcircle-child-glyph" aria-hidden="true"></span>\
                    </div>\
                    <div class="circle-base popcircle-child popcircle-fav">\
                        <span class="glyphicon glyphicon-heart-empty popcircle-child-glyph" aria-hidden="true"></span>\
                    </div>\
                </div>\
                <div class="popcircle-children" data-item-group="2">\
                </div>\
            </div>';
            
            this.$this.html(html);
        },
        
        _toggleGroup: function(){
            var $this = this.$this;
            var $cont = $this.find(".popcircle-container");
            var activeGroup = $cont.attr("data-active-group");
            this._foldChildren(activeGroup);
            +activeGroup==1?++activeGroup:--activeGroup;
            this._expandChildren(activeGroup);
            $cont.attr("data-active-group",activeGroup);
        },
        
        _toggleExpander:function(){
           var $this = this.$this;
           var $expander = $this.find(".popcircle-expand");
           if($expander.attr("data-expanded")=="true"){
               $expander.find(".glyphicon-option-horizontal").show();
               $expander.find(".glyphicon-option-vertical").hide();
               $expander.attr("data-expanded", false)
           }else {
               $expander.find(".glyphicon-option-horizontal").hide();
               $expander.find(".glyphicon-option-vertical").show();
               $expander.attr("data-expanded", true)
           }
           $expander.focus();
        },
        _addExpander:function(){
            var expanderTemplate = '\
            <div class="circle-base popcircle-child popcircle-expand" data-expanded="false">\
                <span class="glyphicon glyphicon-option-horizontal popcircle-child-glyph" aria-hidden="true"></span>\
                <span class="glyphicon glyphicon-option-vertical popcircle-child-glyph" aria-hidden="true"></span>\
            </div>'
             $(".popcircle-container").find(".popcircle-children").prepend(expanderTemplate);
             this.$this.find(".popcircle-expand").find(".glyphicon-option-vertical").hide();
        },
        
        _addNavItem:function(json){
            var navItemTemplate = '<div class="circle-base popcircle-child popcircle-nav"></div>';
           
        },

        _positionChildren:function() {
            $(".popcircle-container")
                .find(".popcircle-children")
                    .each(function(index, el){
                
            var children = $(el).children();
            // 2Pi/10 -> only ten placeholders
            var angle = Math.PI * 2 / 10

            var $parent = $(".popcircle-container").find(".popcircle");
            var parentRadius = $parent.outerWidth(true) / 2;
            
            $parent.attr("data-radius", parentRadius);
            
            children.each(function (index, el) {
                var $el = $(el);
                
                var thisRad = $el.width() / 2;
                // to make sure that we start from the 3rd quarter
                var num = index * angle + Math.PI;
                
                var posX = parentRadius + (Math.cos(num)) * (parentRadius/2) - thisRad;
                var posY = parentRadius + (-Math.sin(num)) * (parentRadius/2) - thisRad;
                
                $el.attr("data-x-rad-increment", Math.round(Math.cos(num) * parentRadius/2));
                $el.attr("data-y-rad-increment", Math.round(-Math.sin(num) * parentRadius/2));
                
                $el.css({top: posY, left: posX});
            });
            });
        },

        _expandChildren:function(group){
             var $this = this.$this;
             var groupNumber = group||$(".popcircle-container").attr("data-active-group");
             
             var children = $(".popcircle-container").find(".popcircle-children[data-item-group='"+groupNumber+"']").children();
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
        
        _foldChildren:function(group){
             var groupNumber = group||$(".popcircle-container").attr("data-active-group");
             var children = $(".popcircle-container").find(".popcircle-children[data-item-group='"+groupNumber+"']").children();
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
            });
            
            $(".popcircle-expand").bind("click", function(e){
                that._toggleExpander();
                that._toggleGroup();
            })
            
            
        }
        
    });
})($, window, document);