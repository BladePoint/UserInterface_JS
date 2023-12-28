import { UIElement } from './UIElement.js';
import { noop } from '../Utilities_JS/constants.js';

export class UIButton {
    static MOUSE_ENTER = 'mouseenter';
    static MOUSE_LEAVE = 'mouseleave';
    static MOUSE_DOWN = 'mousedown';
    static MOUSE_MOVE = 'mousemove';
    static MOUSE_UP = 'mouseup';
    static TOUCH_START = 'touchstart';
    static TOUCH_END = 'touchend';
    constructor(containerElement, pointerElement=null, execFunction=noop) {
        this._containerElement = containerElement;
        this._pointerElement = pointerElement ? pointerElement : containerElement;
        this.execFunction = execFunction;
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onDown = this.onDown.bind(this);
    }
    get style() {
        return this._containerElement.style;
    }
    assignStyles(styleObject) {
        const parsedObject = UIElement.parsePxObject(styleObject);
        UIElement.assignStyles(this, parsedObject);
    }
    enable() {
        this._pointerElement.style.cursor = 'pointer';
        this._pointerElement.enable();
    }
    disable() {
        this._pointerElement.style.cursor = 'default';
        this._pointerElement.disable();
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
        if (this._pointerElement instanceof UIElement) this.changeListeners('addInteractiveListener');
        else this.changeListeners('addEventListener');
    }
    removeMouseListeners() {
        if (this._pointerElement instanceof UIElement) this.changeListeners('removeInteractiveListener');
        else this.changeListeners('removeEventListener');
    }
    changeListeners(methodString) {
        this._pointerElement[methodString](UIButton.MOUSE_DOWN, this.onDown);
        this._pointerElement[methodString](UIButton.TOUCH_START, this.onTouchStart);
    }
    onTouchStart(evt) {
        if (evt.cancelable) {
            evt.preventDefault();
            this.onDown(evt);
        }
        else evt.target.style.opacity = 0.1;
    }
    onDown(evt) {this.onDownLogic(evt);}
    onDownLogic(evt) {this.execFunction(evt);}
}

export class UIButtonHover extends UIButton {
    constructor(containerElement, pointerElement=null, execFunction=noop) {
        super(containerElement, pointerElement, execFunction);
        this._isMouseHover = false;
        this._isMouseDown = false;
        this._isSuspended = false;
        this.onEnter = this.onEnter.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onUp = this.onUp.bind(this);
        this.addMouseListeners();
    }
    changeListeners(methodString) {
        super.changeListeners(methodString);
        this._pointerElement[methodString](UIButton.MOUSE_ENTER, this.onEnter);
        this._pointerElement[methodString](UIButton.MOUSE_LEAVE, this.onLeave);
        this._pointerElement[methodString](UIButton.MOUSE_UP, this.onUp);
        this._pointerElement[methodString](UIButton.TOUCH_END, this.onUp);
    }
    onEnter(evt) {
        this._isMouseHover = true;
        if (!this._isSuspended) this.onEnterLogic();
    }
    onEnterLogic() {}
    onLeave(evt) {
        this._isMouseHover = false;
        this._isMouseDown = false;
        if (!this._isSuspended) this.onLeaveLogic(evt);
    }
    onLeaveLogic(evt) {}
    onDown(evt) {
        this._isMouseDown = true;
        if (!this._isSuspended) this.onDownLogic(evt);
    }
    onDownLogic(evt) {}
    onUp(evt) {
        if (this._isMouseDown && !this._isSuspended) {
            if (evt.changedTouches) {
                const clientX = evt.changedTouches[0].clientX;
                const clientY = evt.changedTouches[0].clientY;
                const buttonRect = evt.target.getBoundingClientRect();
                if (clientX >= buttonRect.left && clientX <= buttonRect.right && clientY >= buttonRect.top && clientY <= buttonRect.bottom) this.onUpLogic();
                else this.onCancelLogic(evt);
            } else this.onUpLogic(evt);
        } else this.onCancelLogic(evt);
        this._isMouseDown = false;
    }
    onUpLogic(evt) {this.execFunction(this);}
    onCancelLogic(evt) {}
    suspend() {this._isSuspended = true;}
    unsuspend() {this._isSuspended = false;}
}

export class Button2State extends UIButtonHover {
    constructor(containerElement, pointerElement=null, execFunction=noop) {
        super(containerElement, pointerElement, execFunction);
    }
    onLeaveLogic(evt) {this.upState();}
    onDownLogic(evt) {this.downState();}
    onUpLogic(evt) {this.upState(); super.onUpLogic();}
    onCancelLogic(evt) {this.upState();}
    upState() {}
    downState() {}
}

export class Button3State extends Button2State {
    constructor(containerElement, pointerElement=null, execFunction=noop) {
        super(containerElement, pointerElement, execFunction);
    }
    onEnterLogic(evt) {this.hoverState();}
    onUpLogic(evt) {this.hoverState(); super.onUpLogic();}
    testState() {if (this._isMouseHover === true) this.onEnterLogic();}
}