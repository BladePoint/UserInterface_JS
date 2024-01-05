import { UIElement, UIVector } from './UIElement.js';
import { noop } from '../Utilities_JS/constants.js';
import { clamp } from '../Utilities_JS/mathUtils.js';

export class UIButton {
    static POINTER_ENTER = 'pointerenter';
    static POINTER_LEAVE = 'pointerleave';
    static POINTER_DOWN = 'pointerdown';
    static POINTER_UP = 'pointerup';
    static POINTER_MOVE = 'pointermove';
    static TOUCH_MOVE = 'touchmove';
    static TOUCH_END = 'touchend';
    static MOUSE_MOVE = 'mousemove';
    static MOUSE_UP = 'mouseup';
    static POINTER = 'pointer';
    static DEFAULT = 'default';
    constructor(containerElement, pointerElement=null, execFunction=noop) {
        this._containerElement = containerElement;
        this.pointerElement = pointerElement ? pointerElement : containerElement;
        this.execFunction = execFunction;
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
        this.pointerElement.style.cursor = UIButton.POINTER;
        this.pointerElement.enable();
    }
    disable() {
        this.pointerElement.style.cursor = UIButton.DEFAULT;
        this.pointerElement.disable();
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
    get offsetLeft() {return this._containerElement.offsetLeft;}
    addMouseListeners() {this.setMouseListeners(true);}
    removeMouseListeners() {this.setMouseListeners(false);}
    setMouseListeners(isAdd) {
        let methodString;
        if (this.pointerElement instanceof UIElement && !(this.pointerElement instanceof UIVector)) {
            if (isAdd) methodString = 'addInteractiveListener';
            else methodString = 'removeInteractiveListener';
        } else {
            if (isAdd) methodString = 'addEventListener';
            else methodString = 'removeEventListener'
        }
        this.changeListeners(methodString);
    }
    changeListeners(methodString) {
        const eventTarget = this.getListenerTarget();
        eventTarget[methodString](UIButton.POINTER_DOWN, this.onDown);
        return eventTarget;
    }
    getListenerTarget() {return this.pointerElement instanceof UIVector ? this.pointerElement.polygon : this.pointerElement;}
    onDown(evt) {this.onDownLogic(evt);}
    onDownLogic(evt) {this.execFunction(evt);}
}

export class UIButtonDrag extends UIButton {
    constructor(containerElement, pointerElement=null, execFunction=noop, onDownFunction=noop) {
        super(containerElement, pointerElement, execFunction);
        this.onDownFunction = onDownFunction;
        this.startX = undefined;
    }
    onDownLogic(evt) {
        document.addEventListener(UIButton.TOUCH_MOVE, this.onMove);
        document.addEventListener(UIButton.MOUSE_MOVE, this.onMove);
        document.addEventListener(UIButton.TOUCH_END, this.onUp);
        document.addEventListener(UIButton.MOUSE_UP, this.onUp);
        this.pointerElement.style.cursor = 'grabbing';
        if (evt.touches) this.startX = evt.touches[0].clientX;
        else this.startX = evt.clientX;
        this.onDownFunction(evt);
    }
    onMove = (evt) => {
        const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
        const deltaX = (clientX - this.startX);
        this.execFunction(deltaX);
    }
    onUp = (evt) => {
        document.removeEventListener(UIButton.TOUCH_MOVE, this.onMove);
        document.removeEventListener(UIButton.MOUSE_MOVE, this.onMove);
        document.removeEventListener(UIButton.TOUCH_END, this.onUp);
        document.removeEventListener(UIButton.MOUSE_UP, this.onUp);
        this.pointerElement.style.cursor = 'grab';
    }
    enable() {
        this.pointerElement.style.cursor = 'grab';
        this.pointerElement.enable();
    }
}

export class UIButtonHover extends UIButton {
    constructor(containerElement, pointerElement=null, execFunction=noop) {
        super(containerElement, pointerElement, execFunction);
        this._isHovering = false;
        this._isDown = false;
        this._isSuspended = false;
        this.onEnter = this.onEnter.bind(this);
        this.onLeave = this.onLeave.bind(this);
        this.onUp = this.onUp.bind(this);
        this.addMouseListeners();
    }
    changeListeners(methodString) {
        const eventTarget = super.changeListeners(methodString);
        eventTarget[methodString](UIButton.POINTER_ENTER, this.onEnter);
        eventTarget[methodString](UIButton.POINTER_LEAVE, this.onLeave);
        eventTarget[methodString](UIButton.POINTER_UP, this.onUp);
    }
    onEnter(evt) {
        this._isHovering = true;
        if (!this._isSuspended) this.onEnterLogic();
    }
    onEnterLogic() {}
    onLeave(evt) {
        this._isHovering = false;
        this._isDown = false;
        if (!this._isSuspended) this.onLeaveLogic(evt);
    }
    onLeaveLogic(evt) {}
    onDown(evt) {
        this._isDown = true;
        if (!this._isSuspended) this.onDownLogic(evt);
    }
    onDownLogic(evt) {}
    onUp(evt) {
        if (this._isDown && !this._isSuspended) this.onUpLogic(evt);
        else if (!this._isDown && !this._isSuspended) this.onCancelLogic(evt);
        this._isDown = false;
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
    testState() {if (this._isHovering === true) this.onEnterLogic();}
}