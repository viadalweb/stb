/**
 * @module stb/ui/modal.message
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Component = require('../component');


/**
 * Modal window implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {Object} [config.title] message title
 * @param {Object} [config.className] message classname
 * @param {Object} [config.icon] icon at header
 * @param {Object} [config.visible] visibility flag
 * @param {Object} [config.children] content (inherited from the parent)
 *
 *
 * page.modalMessage = new ModalMessage({
 *        title: 'My Title',
 *        icon: 'star',
 *        children: [new Button({value: 'Create'})]
 *    });
 * page.add(page.modalMessage);
 * page.modalMessage.show();
 *
 */
function ModalMessage ( config ) {
    var $overlay;

    // sanitize
    config = config || {};

    if ( DEBUG ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.icon && typeof config.icon !== 'string' ) { throw new Error(__filename + ': wrong or empty config.icon'); }
        if ( config.title && typeof config.title !== 'string' ) { throw new Error(__filename + ': wrong or empty config.title'); }
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
        if ( config.$body ) { throw new Error(__filename + ': config.$body should not be provided in ModalMessage manually'); }
    }

    // usually can't accept focus
    config.focusable = config.focusable || false;
    // set default className if classList property empty or undefined
    config.className = 'modalMessage ' + (config.className || '');
    // hide by default
    config.visible = config.visible || false;
    // create centered div
    config.$body = document.createElement('div');
    config.$body.className = 'body';

    // parent constructor call
    Component.call(this, config);

    // add table-cell wrappers
    this.$node.appendChild(document.createElement('div'));
    this.$node.firstChild.classList.add('alignBox');
    this.$node.firstChild.appendChild(document.createElement('div'));

    // add header div
    this.$header = document.createElement('div');
    this.$header.className = 'header';

    // insert caption placeholder
    this.$text = this.$header.appendChild(document.createElement('div'));
    this.$text.classList.add('text');
    this.$text.innerText = config.title || '';

    // optional icon
    if ( config.icon ) {
        // insert icon
        this.$icon = this.$header.appendChild(document.createElement('div'));
        this.$icon.className = 'icon ' + config.icon;
    }

    $overlay = document.createElement('div');
    $overlay.className = 'overlay';

    // add to dom
    this.$node.firstChild.firstChild.appendChild(this.$header);
    this.$node.firstChild.firstChild.appendChild(this.$body);
    this.$node.firstChild.firstChild.appendChild($overlay);
}


// inheritance
ModalMessage.prototype = Object.create(Component.prototype);
ModalMessage.prototype.constructor = ModalMessage;


/**
 * Redefine default component focus to set additional css
 */
ModalMessage.prototype.focus = function () {
    this.$node.classList.add('active');
    Component.prototype.focus.call(this);
    if ( this.children[0] && this.children[0] instanceof Component ) {
        this.children[0].focus();
    }
};

/**
 * Blur message
 */
ModalMessage.prototype.blur = function () {
    this.$node.classList.remove('active');
    Component.prototype.blur.call(this);
};


// public
module.exports = ModalMessage;
