/**
 * @module stb/ui/list
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component'),
	keys      = require('../keys');


/**
 * Mouse click event.
 *
 * @event module:stb/ui/list~List#click:item
 *
 * @type {Object}
 * @property {Node} $item clicked HTML item
 * @property {Event} event click event data
 */

/**
 * Base list implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {number} config.size amount of visible items on a page
 *
 * @fires module:stb/ui/list~List#click:item
 */
function List ( config ) {
	var self = this,  // current execution context
		//index = 0,
		i, item;

	/**
	 * List of DOM elements representing the component lines.
	 *
	 * @type {Node[]}
	 */
	//this.items = [];

	/**
	 * Link to the currently focused DOM element.
	 *
	 * @type {Node}
	 */
	this.$focusItem = null;

	//this.activeIndex = 0;

	this.data = [];

	this.type = this.TYPE_VERTICAL;

	/**
	 * Amount of visible items on a page.
	 *
	 * @type {number}
	 */
	this.size = 5;

	/**
	 * Method the build each list item content.
	 * Can be redefined to provide custom rendering.
	 *
	 * @type {function}
	 */
	this.render = this.defaultRender;

	// sanitize
	config = config || {};

	// parent init
	Component.call(this, config);

	// horizontal or vertical
	if ( config.type !== undefined ) {
		// @ifdef DEBUG
		if ( Number(config.type) !== config.type ) { throw 'config.type must be a number'; }
		// @endif

		this.type = config.type;
	}

	// correct CSS class names
	this.$node.classList.add('list');

	if ( this.type === this.TYPE_HORIZONTAL ) {
		this.$node.classList.add('horizontal');
	}

	//this.$body = document.createElement('ul');
	////this.$body.className = 'body';
	//this.$node.appendChild(this.$body);

	this.init(config);

	//if ( this.$focusItem === null ) {
	//	this.$focusItem = this.$body.firstChild;
	//	//this.activeIndex = 0;
	//	this.$focusItem.classList.add('focus');
	//}

	this.addListener('keydown', function ( event ) {
		//var tmp;

		if ( event.code === keys.ok ) {
			// notify
			self.emit('click:item', {$item: self.$focusItem, event: event});
		}

		if ( (event.code === keys.up && self.type === self.TYPE_VERTICAL) || (event.code === keys.left && self.type === self.TYPE_HORIZONTAL) ) {
			if ( self.$focusItem.index > 0 ) {
				//index--;

				if ( !self.focusPrev() ) {
					// move the last item to the begging
					//self.$body.insertBefore(self.items[self.items.length-1], self.items[0]);
					self.$body.insertBefore(self.$body.lastChild, self.$body.firstChild);

					//if ( config.render !== undefined ) {
					self.render(self.$body.firstChild, self.data[self.$focusItem.index - 1]);
					self.$body.firstChild.index = self.$focusItem.index - 1;
					//self.$body.firstChild.data  = self.data[self.$focusItem.index];
					//} else {
					//	self.$body.firstChild.innerText = self.data[self.activeIndex-1];
					//}

					//self.items.unshift(self.items.pop());
					//self.activeIndex++;
					self.focusPrev();
				}
			}
		}
		if ( (event.code === keys.down && self.type === self.TYPE_VERTICAL) || (event.code === keys.right && self.type === self.TYPE_HORIZONTAL) ) {
			if ( self.$focusItem.index < self.data.length - 1 ) {
				//index++;

				if ( !self.focusNext() ) {
					// move the first item to the end
					//self.$body.appendChild(self.items[0]);
					self.$body.appendChild(self.$body.firstChild);

					//if ( config.render !== undefined ) {
					self.render(self.$body.lastChild, self.data[self.$focusItem.index + 1]);
					self.$body.lastChild.index = self.$focusItem.index + 1;
					//self.$body.firstChild.data  = self.data[self.$focusItem.index];
					//} else {
					//	self.$body.lastChild.innerText = self.data[self.activeIndex + 1];
					//}

					//self.items.push(self.items.shift());
					//self.activeIndex--;
					self.focusNext();
				}
			}
		}

		if ( event.code === keys.pageUp ) {
			//self.activeIndex = self.activeIndex - self.size - 1;
			//self.focusFirst();
			self.focusItem(self.$body.firstChild);
			//self.$focusItem.index = self.$focusItem.index;
		}
		if ( event.code === keys.pageDown ) {
			//self.activeIndex = self.activeIndex + self.size - 1;

			//self.focusLast();
			self.focusItem(self.$body.lastChild);
			//self.$focusItem.index = self.$focusItem.index;

			//for ( i = 0; i < self.size; i++ ) {
				//self.render()
			//}
		}

		// swap edge items
		//tmp = self.items[0];
		//self.items[0] = self.items[self.items.length-1];
		//self.items[self.items.length-1] = tmp;

		//for ( i = 0; i < self.size; i++ ) {
			//self.items[i].innerText = self.data[i+index];
		//}
		//self.$focusItem.classList.remove('focus');
		//self.$focusItem = self.items[Math.abs(index % self.items.length)];
		//self.$focusItem.classList.add('focus');
	});

	this.$body.addEventListener('mousewheel', function ( event ) {
		var direction = event.wheelDeltaY > 0;

		debug.event(event);

		self.emit('keydown', {code: direction ? keys.up : keys.down});
	});
}


// inheritance
List.prototype = Object.create(Component.prototype);
List.prototype.constructor = List;


List.prototype.TYPE_VERTICAL   = 1;
List.prototype.TYPE_HORIZONTAL = 2;


List.prototype.init = function ( config ) {
	var self     = this,
		currSize = this.$body.children.length,
		onClick  = function ( event ) {
			if ( this.data !== undefined ) {
				self.focusItem(this);
				// notify
				self.emit('click:item', {$item: this, event: event});
			}
			//self.$focusItem.index = this.index;
			//event.stopPropagation();
			//self.$focusItem.classList.remove('focus');
			//self.$focusItem = this;
			//self.$focusItem.classList.add('focus');
		},
		item, i;

	// apply list of items
	if ( config.data !== undefined ) {
		// @ifdef DEBUG
		if ( !Array.isArray(config.data) ) { throw 'wrong config.data type'; }
		// @endif

		this.data = config.data;
	}

	// custom render method
	if ( config.render !== undefined ) {
		// @ifdef DEBUG
		if ( typeof config.render !== 'function' ) { throw 'wrong config.render type'; }
		// @endif

		this.render = config.render;
	}

	// list items amount on page
	if ( config.size !== undefined ) {
		// @ifdef DEBUG
		if ( Number(config.size) !== config.size ) { throw 'config.size must be a number'; }
		if ( config.size <= 0 ) { throw 'config.size should be positive'; }
		// @endif

		this.size = config.size;
	}

	// geometry has changed or initial draw
	if ( this.size !== currSize ) {
		// non-empty list
		if ( currSize > 0 ) {
			// clear old items
			this.$body.textContent = null;
		}

		// create new items
		for ( i = 0; i < this.size; i++ ) {
			//item = document.createElement('li');
			item = document.createElement('div');
			item.index = i;
			item.className = 'item';
			//item.innerText = this.data[i];
			//if ( this.data[i] !== undefined ) {
				//this.render(item, this.data[i]);

				item.addEventListener('click', onClick);
			//}
			//this.items.push(this.$body.appendChild(item));
			this.$body.appendChild(item);
		}
	}

	this.renderPage();
};

List.prototype.moveNext = function () {

};


List.prototype.movePrev = function () {

};


List.prototype.renderPage = function () {
	var $item, i;

	for ( i = 0; i < this.size; i++ ) {
		$item = this.$body.children[i];
		if ( $item.index !== undefined && this.data[$item.index] !== undefined ) {
			$item.data = this.data[$item.index];
			this.render($item, this.data[$item.index]);
		}
	}
};


List.prototype.defaultRender = function ( $item, data ) {
	$item.innerText = data;
};


/**
 * Highlight the given DOM element as focused.
 * Remove focus from the previously focused item and generate associated event.
 *
 * @param {Node} $item element to focus
 *
 * @return {boolean} operation status
 *
 * @fires module:stb/ui/list~List#focus:item
 */
List.prototype.focusItem = function ( $item ) {
	var $prev = this.$focusItem;

	// different element
	if ( $item !== undefined && $prev !== $item ) {
		// @ifdef DEBUG
		if ( !($item instanceof Node) ) { throw 'wrong $item type'; }
		if ( $item.parentNode !== this.$body ) { throw 'wrong $item parent element'; }
		// @endif

		// some item is focused already
		if ( $prev !== null ) {
			$prev.classList.remove('focus');

			// notify
			this.emit('blur:item', {$item: $prev});
		}
		// reassign
		this.$focusItem = $item;

		this.$focusItem.data = this.data[this.$focusItem.index];

		// correct CSS
		$item.classList.add('focus');

		/**
		 * Set focus to an element.
		 *
		 * @event module:stb/ui/list~List#focus:item
		 *
		 * @type {Object}
		 * @property {*} [$prev] old/previous focused HTML element
		 * @property {*} [$curr] new/current focused HTML element
		 */
		this.emit('focus:item', {$prev: $prev, $curr: $item});

		return true;
	}

	// nothing was done
	return false;
};


List.prototype.focusNext = function () {
	//if ( this.activeIndex < this.size - 1 ) {
	if ( this.$focusItem !== this.$body.lastChild ) {
		//this.activeIndex++;
		//console.log(this.activeIndex);
		//this.$focusItem.classList.remove('focus');
		////this.$focusItem = this.items[this.activeIndex];
		//this.$focusItem = this.$focusItem.nextSibling;
		//this.$focusItem.classList.add('focus');

		return this.focusItem(this.$focusItem.nextSibling);
	}
	return false;
};


List.prototype.focusPrev = function () {
	//if ( this.activeIndex > 0 ) {
	if ( this.$focusItem !== this.$body.firstChild ) {
		//this.activeIndex--;
		//console.log(this.activeIndex);
		//this.$focusItem.classList.remove('focus');
		////this.$focusItem = this.items[this.activeIndex];
		//this.$focusItem = this.$focusItem.previousSibling;
		//this.$focusItem.classList.add('focus');

		return this.focusItem(this.$focusItem.previousSibling);
	}
	return false;
};


//List.prototype.focusFirst = function () {
//	this.$focusItem.classList.remove('focus');
//	this.$focusItem = this.$body.firstChild;
//	this.$focusItem.classList.add('focus');
//	this.activeIndex = this.$focusItem.index;
//};

//List.prototype.focusLast = function () {
//	this.$focusItem.classList.remove('focus');
//	this.$focusItem = this.$body.lastChild;
//	this.$focusItem.classList.add('focus');
//	this.activeIndex = this.$focusItem.index;
//};


// public export
module.exports = List;
