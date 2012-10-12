;(function($, window, undefined) {

	"use strict";
	
	/**
	 * Sticky Element constructor
	 * @param ele
	 * @param par
	 * @param options
	 * @constructor
	 */
	var Sticky = function(ele, par, options) {
		this.ele = ele;
		this.par = par;
		this._frozen = false;
		this.options = $.extend({
			animate: false,
			animTime: 300
		}, options);
		this.init();
	};
	
	Sticky.prototype.init = function() {
		this.SetBoundaries();
		this.ele.css({'position':'relative'});
		this.par.css({'position':'relative'});
		this.MoveIt();
	};
	
	Sticky.prototype.Update = function(){
		//This will handle any resizing of the container the sticky scroll is in and update the boundaries if necessary
		this.SetBoundaries();
		this.MoveIt();
	};
	
	Sticky.prototype.MoveIt = function(){
		// This will decide whether to move the stickied item
		var winOffset = window.pageYOffset;
		if(winOffset >= this.yLimitTop && winOffset <= this.yLimitBtm){
			this.UpdateOffset(winOffset - this.yLimitTop);
		}
	};
	
	Sticky.prototype.SetBoundaries = function(){
		// This will set the boundaries the stickied item can move between and it's left position
		this.xPos = this.ele.offset().left;
		this.yLimitTop = this.par.offset().top;
		this.yLimitBtm = this.yLimitTop + this.par.height() - this.ele.outerHeight();
	};
	
	/**
     * Update Stickied Elements' offset
     * @param yOffset
     */
	Sticky.prototype.UpdateOffset = function(yOffset){
		// This moves the item
		if(this.animate){
			this.ele.stop().animate({'top':yOffset},this.animTime);
		} else {
			this.ele.css({'top':yOffset});
		}
	};
	
	Sticky.prototype.ToggleFreeze = function(){
		// This will freeze the stickied item in place wherever it is
		this._frozen = !this._frozen;
	};
	
	$.stickies = [];

	$.fn.sticky = function(par,options) {
		var method, args, ret = false;
		if (typeof options === "string") {
			args = [].slice.call(arguments, 0);
		}
		
		this.each(function() {
			var self = $(this);
			var parent = par;
			parent = (self.closest(parent))? self.closest(parent) : $(document);
			var instance = self.data("stickyInstance");
			
			if (instance && options) {
				if (typeof options === "object") {
					ret = $.extend(instance.options, options);
				} else if (options === "options") {
					ret =  instance.options;
				} else if (typeof instance[options] === "function") {
					ret = instance[options].apply(instance, args.slice(1));
				} else {
					throw new Error("Sticky Element has no option/method named " + method);
				}
			} else {
				instance = new Sticky(self, parent, options || {});
				self.data("stickyInstance", instance);
				$.stickies.push(instance);
			}
		});
		return ret || this;
	};
	
	// Update the position/offset changed on resize and move
	$(window).on('resize',function(){
		$.each($.stickies, function(){
			this.Update();
		});
	});
	
	// Move all those suckers on scroll
	$(window).on('scroll', function(){
		$.each($.stickies, function(){
			if(!this._frozen){
				this.MoveIt();
			}
		});
	});
}(jQuery, window));