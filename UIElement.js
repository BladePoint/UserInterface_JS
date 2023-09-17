export class UIElement extends EventTarget {
    constructor() {
        super();
        this.element = document.createElement('div');
    }
    get style() {
        return this.element.style;
    }
    applyStyles(element, styles) {
        Object.assign(element.style, styles);
    };
    appendChild(child) {
        if (child instanceof UIElement) this.element.appendChild(child.element);
        else this.element.appendChild(child);
    }
    appendChildTo(parent) {
        parent.appendChild(this.element);
    }
    dispatchEventWith(eventName, eventData = {}) {
        const event = new CustomEvent(eventName, { detail: eventData });
        this.dispatchEvent(event);
    }
}