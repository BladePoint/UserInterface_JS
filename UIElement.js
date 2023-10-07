export class UIElement extends EventTarget {
    static SVGNS = "http://www.w3.org/2000/svg";
    static DIV = 'div';
    static SVG = 'svg';
    static POLYGON = 'polygon';
    static LINEAR_GRADIENT = 'linearGradient';
    static STOP = 'stop';
    static assignStyles(element, styleObject) {
        Object.assign(element.style, styleObject);
    }
    static assignAttributes(element, attributeObject) {
        for (const property in attributeObject) {
            element.setAttribute(property, attributeObject[property]);
        }
    }
    static assignDefaultStyles(element, type) {
        const styleObject = {
            pointerEvents: 'none',
            position: 'absolute'
        };
        if (type == UIElement.DIV) {
            styleObject.display = 'inline-block';
            styleObject.margin = 0;
            styleObject.padding = 0;
        }
        UIElement.assignStyles(element, styleObject);
    }
    static parseElementType(elementType) {
        if (elementType === UIElement.DIV) return document.createElement(UIElement.DIV);
        else if (elementType === UIElement.SVG) return document.createElementNS(UIElement.SVGNS, UIElement.SVG);
        else if (elementType === UIElement.POLYGON) return document.createElementNS(UIElement.SVGNS, UIElement.POLYGON);
        else if (elementType === UIElement.LINEAR_GRADIENT) return document.createElementNS(UIElement.SVGNS, UIElement.LINEAR_GRADIENT);
        else if (elementType === UIElement.STOP) return document.createElementNS(UIElement.SVGNS, UIElement.STOP);
        else throw new Error(`Invalid elementType "${elementType}".`);
    }
    static parsePxArgument(argument) {
        return typeof argument === 'number' ? `${argument}px` : argument;
    }
    static setPointer(element, value) {
        const argumentType = typeof value;
        let pointerString;
        if (argumentType === 'boolean') pointerString = value ? 'auto' : 'none';
        else if (argumentType === 'string') pointerString = value;
        element.style.pointerEvents = pointerString;
    }

    constructor(elementType=UIElement.DIV) {
        super();
        this.element = UIElement.parseElementType(elementType);
        UIElement.assignDefaultStyles(this.element,elementType);
    }
    get style() {
        return this.element.style;
    }
    appendChild(child) {
        if (child instanceof UIElement) this.element.appendChild(child.element);
        else this.element.appendChild(child);
    }
    appendChildTo(parent) {
        parent.appendChild(this.element);
    }
    prependChild(child) {
        if (child instanceof UIElement) this.element.insertBefore(child.element, this.element.firstChild);
        else this.element.insertBefore(child, this.element.firstChild);
    }
    dispatchEventWith(eventName, eventData = {}) {
        const event = new CustomEvent(eventName, { detail: eventData });
        this.dispatchEvent(event);
    }
    enable() {
        UIElement.setPointer(this, true);
    }
    disable() {
        UIElement.setPointer(this, false);
    }
}

export class UIButton extends UIElement {
    static MOUSE_ENTER = 'mouseenter';
    static MOUSE_DOWN = 'mousedown';
    static MOUSE_LEAVE = 'mouseleave';
    static MOUSE_UP = 'mouseup';
    static addEnterListener(eventTarget, callback) {eventTarget.addEventListener(UIButton.MOUSE_ENTER, callback);}
    static addDownListener(eventTarget, callback) {eventTarget.addEventListener(UIButton.MOUSE_DOWN, callback);}
    static addLeaveListener(eventTarget, callback) {eventTarget.addEventListener(UIButton.MOUSE_LEAVE, callback);}
    static addUpListener(eventTarget, callback) {eventTarget.addEventListener(UIButton.MOUSE_UP, callback);}

    constructor(elementType=UIElement.DIV) {
        super(elementType);
        this.isMouseDown = false;
        this.isMouseHover = false;
        this.style.cursor = 'pointer';
    }
    addMouseListeners(elementTarget) {
        const eventTarget = elementTarget instanceof UIElement ? elementTarget.element : elementTarget;
        UIButton.addEnterListener(eventTarget, this.onEnter);
        UIButton.addDownListener(eventTarget, this.onDown);
        UIButton.addLeaveListener(eventTarget, this.onLeave);
        UIButton.addUpListener(eventTarget, this.onUp);
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
        this.isMouseDown = false;
    }
}