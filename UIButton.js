import { UIElement } from './UIElement.js';

export class UIButton {
    static MOUSE_ENTER = 'mouseenter';
    static MOUSE_DOWN = 'mousedown';
    static MOUSE_LEAVE = 'mouseleave';
    static MOUSE_UP = 'mouseup';

    constructor(containerElement, pointerElement=null, upFunction=null) {
        this._containerElement = containerElement;
        this._pointerElement = pointerElement ? pointerElement : containerElement;
        this._pointerElement.style.cursor = 'pointer';
        this.upFunction = upFunction;
        this.isMouseDown = false;
        this.isMouseHover = false;
    }
    appendToParent(parent) {
        if (this._containerElement instanceof UIElement) this._containerElement.appendToParent(parent);
        else parent.appendChild(this._containerElement);
    }
    prependToParent(parent) {
        if (this._containerElement instanceof UIElement) this._containerElement.prependToParent(parent);
        else parent.insertBefore(this._containerElement, parent.firstChild);
    }
    removeFromParent(parent) {
        if (this._containerElement instanceof UIElement) this._containerElement.removeFromParent(parent);
        parent.removeChild(this._containerElement);
    }
    addMouseListeners() {
        if (this._pointerElement instanceof UIElement) {
            this._pointerElement.addInteractiveListener(UIButton.MOUSE_ENTER, this.onEnter);
            this._pointerElement.addInteractiveListener(UIButton.MOUSE_DOWN, this.onDown);
            this._pointerElement.addInteractiveListener(UIButton.MOUSE_LEAVE, this.onLeave);
            this._pointerElement.addInteractiveListener(UIButton.MOUSE_UP, this.onUp);
        } else {
            this._pointerElement.addEventListener(UIButton.MOUSE_ENTER, this.onEnter);
            this._pointerElement.addEventListener(UIButton.MOUSE_DOWN, this.onDown);
            this._pointerElement.addEventListener(UIButton.MOUSE_LEAVE, this.onLeave);
            this._pointerElement.addEventListener(UIButton.MOUSE_UP, this.onUp);
        }
    }
    onEnter(evt) {
        this.isMouseHover = true;
    }
    onDown(evt) {
        this.isMouseDown = true;
    }
    onLeave(evt) {
        this.isMouseHover = false;
        this.isMouseDown = false;
    }
    onUp(evt) {
        if (this.isMouseDown && this.upFunction) this.upFunction();
        this.isMouseDown = false;
    }
    enable() {this._pointerElement.enable();}
    disable() {this._pointerElement.disable();}
}