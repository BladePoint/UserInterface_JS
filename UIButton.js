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
        this._isMouseHover = false;
        this._isMouseDown = false;
        this._isSuspended = false;
        this.onEnter = this.onEnter.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onDown = this.onDown.bind(this);
        this.onUp = this.onUp.bind(this);
        this.addMouseListeners();
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
        this._isMouseHover = true;
        if (!this._isSuspended) this.onEnterLogic();
    }
    onEnterLogic() {}
    onLeave(evt) {
        this._isMouseHover = false;
        this._isMouseDown = false;
        if (!this._isSuspended) this.onLeaveLogic();
    }
    onLeaveLogic() {}
    onDown(evt) {
        this._isMouseDown = true;
        if (!this._isSuspended) this.onDownLogic();
    }
    onDownLogic() {}
    onUp(evt) {
        if (this._isMouseDown && !this._isSuspended) this.onUpLogic();
        this._isMouseDown = false;
    }
    onUpLogic() {this.upFunction(this);}
    enable() {
        this._pointerElement.style.cursor = 'pointer';
        this._pointerElement.enable();
    }
    disable() {
        this._pointerElement.style.cursor = 'default';
        this._pointerElement.disable();
    }
    suspend() {this._isSuspended = true;}
    unsuspend() {this._isSuspended = false;}
}

export class Button2State extends UIButton {
    constructor(containerElement, pointerElement=null, upFunction=noop) {
        super(containerElement, pointerElement, upFunction);
    }
    onLeaveLogic() {this.upState();}
    onDownLogic() {this.downState();}
    onUpLogic() {this.upState(); super.onUpLogic();}
    upState() {}
    downState() {}
}

export class Button3State extends Button2State {
    constructor(containerElement, pointerElement=null, upFunction=noop) {
        super(containerElement, pointerElement, upFunction);
    }
    onEnterLogic() {this.hoverState();}
    onUpLogic() {this.hoverState(); super.onUpLogic();}
    testState() {if (this._isMouseHover === true) this.onEnterLogic();}
}