import { UIElement } from './UIElement.js';
import { noop } from '../Utilities_JS/constants.js';

export class UIButton {
    static MOUSE_ENTER = 'mouseenter';
    static MOUSE_LEAVE = 'mouseleave';
    static MOUSE_DOWN = 'mousedown';
    static MOUSE_UP = 'mouseup';

    constructor(containerElement, pointerElement=null, upFunction=noop) {
        this._containerElement = containerElement;
        this._pointerElement = pointerElement ? pointerElement : containerElement;
        this.upFunction = upFunction;
        this.isMouseHover = false;
        this.isMouseDown = false;
    }
    get style() {
        return this._containerElement.style;
    }
    assignStyles(styleObject) {
        const parsedObject = UIElement.parsePxObject(styleObject);
        UIElement.assignStyles(this, parsedObject);
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
            this._pointerElement.addInteractiveListener(UIButton.MOUSE_LEAVE, this.onLeave);
            this._pointerElement.addInteractiveListener(UIButton.MOUSE_ENTER, this.onEnter);
            this._pointerElement.addInteractiveListener(UIButton.MOUSE_DOWN, this.onDown);
            this._pointerElement.addInteractiveListener(UIButton.MOUSE_UP, this.onUp);
        } else {
            this._pointerElement.addEventListener(UIButton.MOUSE_ENTER, this.onEnter);
            this._pointerElement.addEventListener(UIButton.MOUSE_LEAVE, this.onLeave);
            this._pointerElement.addEventListener(UIButton.MOUSE_DOWN, this.onDown);
            this._pointerElement.addEventListener(UIButton.MOUSE_UP, this.onUp);
        }
    }
    removeMouseListeners() {
        if (this._pointerElement instanceof UIElement) {
            this._pointerElement.removeInteractiveListener(UIButton.MOUSE_LEAVE, this.onLeave);
            this._pointerElement.removeInteractiveListener(UIButton.MOUSE_ENTER, this.onEnter);
            this._pointerElement.removeInteractiveListener(UIButton.MOUSE_DOWN, this.onDown);
            this._pointerElement.removeInteractiveListener(UIButton.MOUSE_UP, this.onUp);
        } else {
            this._pointerElement.removeEventListener(UIButton.MOUSE_ENTER, this.onEnter);
            this._pointerElement.removeEventListener(UIButton.MOUSE_LEAVE, this.onLeave);
            this._pointerElement.removeEventListener(UIButton.MOUSE_DOWN, this.onDown);
            this._pointerElement.removeEventListener(UIButton.MOUSE_UP, this.onUp);
        }
    }
    onEnter(evt) {
        this.isMouseHover = true;
    }
    onLeave(evt) {
        this.isMouseHover = false;
        this.isMouseDown = false;
    }
    onDown(evt) {
        this.isMouseDown = true;
    }
    onUp(evt) {
        if (this.isMouseDown) this.upFunction(this);
        this.isMouseDown = false;
    }
    enable() {
        this._pointerElement.style.cursor = 'pointer';
        this._pointerElement.enable();
    }
    disable() {
        this._pointerElement.style.cursor = 'default';
        this._pointerElement.disable();
    }
}

export class Button2State extends UIButton {
    constructor(containerElement, pointerElement=null, upFunction=noop) {
        super(containerElement, pointerElement, upFunction);
        this.onEnter = this.onEnter.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onDown = this.onDown.bind(this);
        this.onUp = this.onUp.bind(this);
        this.addMouseListeners();
    }
    onEnter(evt) {
        super.onEnter(evt);
        this.onEnterLogic();
    }
    onEnterLogic() {}
    onLeave(evt) {
        super.onLeave(evt);
        this.onLeaveLogic();
    }
    onLeaveLogic() {this.upState();}
    onDown(evt) {
        super.onDown(evt);
        this.onDownLogic();
    }
    onDownLogic() {this.downState();}
    onUp(evt) {
        super.onUp(evt);
        this.onUpLogic();
    }
    onUpLogic() {this.upState();}
    upState() {}
    downState() {}
}

export class Button3State extends Button2State {
    constructor(containerElement, pointerElement=null, upFunction=noop) {
        super(containerElement, pointerElement, upFunction);
    }
    onEnterLogic() {this.hoverState();}
    onUpLogic() {this.hoverState();}
    hoverState() {}
}