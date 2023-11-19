import { UIButton } from './UIButton.js';

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
        if (elementType === UIElement.DIV) return document.createElement(UIElement.DIV); //HTMLElement
        else if (elementType === UIElement.SVG) return document.createElementNS(UIElement.SVGNS, UIElement.SVG); //SVGElement
        else if (elementType === UIElement.POLYGON) return document.createElementNS(UIElement.SVGNS, UIElement.POLYGON); //SVGElement
        else if (elementType === UIElement.LINEAR_GRADIENT) return document.createElementNS(UIElement.SVGNS, UIElement.LINEAR_GRADIENT); //SVGElement
        else if (elementType === UIElement.STOP) return document.createElementNS(UIElement.SVGNS, UIElement.STOP); //SVGElement
        else throw new Error(`UIElement.parseElementType: Invalid elementType "${elementType}".`);
    }
    static parsePxArgument(argument) {
        return typeof argument === 'number' ? `${argument}px` : argument;
    }
    static parsePxObject(styleObject) {
        const returnObject = {};
        for (const key in styleObject) {
            if (key === 'width' || key === 'height' || key === 'borderRadius' || key === 'left' || key === 'right' || key === 'top' || key === 'bottom' || key === 'fontSize') {
                returnObject[key] = UIElement.parsePxArgument(styleObject[key]);
            } else returnObject[key] = styleObject[key];
        }
        return returnObject;
    }
    static setPointer(element, value) {
        const argumentType = typeof value;
        let pointerString;
        if (argumentType === 'boolean') pointerString = value ? 'auto' : 'none';
        else if (argumentType === 'string') pointerString = value;
        else throw new Error('UIElement.setPointer: Invalid data type for "value" parameter.');
        element.style.pointerEvents = pointerString;
    }

    constructor(elementType=UIElement.DIV) {
        super();
        this._element = UIElement.parseElementType(elementType);
        UIElement.assignDefaultStyles(this._element,elementType);
    }
    get style() {
        return this._element.style;
    }
    assignStyles(styleObject) {
        const parsedObject = UIElement.parsePxObject(styleObject);
        UIElement.assignStyles(this, parsedObject);
    }
    assignAttributes(attributeObject) {
        const parsedObject = UIElement.parsePxObject(attributeObject);
        UIElement.assignAttributes(this._element, parsedObject);
    }
    appendChild(child) {
        if (child instanceof UIElement || child instanceof UIButton) child.appendToParent(this._element);
        else this._element.appendChild(child);
    }
    appendToParent(parent) {
        parent.appendChild(this._element);
    }
    prependChild(child) {
        if (child instanceof UIElement || child instanceof UIButton) child.prependToParent(this._element);
        else this._element.insertBefore(child, this._element.firstChild);
    }
    prependToParent(parent) {
        parent.insertBefore(this._element, parent.firstChild);
    }
    removeChild(child) {
        if (child instanceof UIElement || child instanceof UIButton) child.removeFromParent(this._element);
        else this._element.removeChild(child);
    }
    removeFromParent(parent) {
        parent.removeChild(this._element);
    }
    dispatchEventWith(eventName, eventData = {}) {
        const event = new CustomEvent(eventName, { detail: eventData });
        this.dispatchEvent(event);
    }
    addInteractiveListener(eventName, callback) {
        this._element.addEventListener(eventName, callback);
    }
    removeInteractiveListener(eventName, callback) {
        this._element.removeEventListener(eventName, callback);
    }
    enable() {
        UIElement.setPointer(this, true);
    }
    disable() {
        UIElement.setPointer(this, false);
    }
}