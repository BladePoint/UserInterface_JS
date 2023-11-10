import { UIButton } from './UIButton.js';
import { UIElement } from './UIElement.js';
import { getGradient, AcuteTriangle, Circle, Rectangle, SemicircleBar } from './Primitives.js';
import { LEFT_TO_RIGHT, RIGHT_TO_LEFT, TOP_TO_BOTTOM, BOTTOM_TO_TOP } from '../Utilities_JS/constants.js';
import { clamp } from '../Utilities_JS/mathUtils.js';
export const HIGHLIGHT_HEX = '#ffffff';
export const OUTLINE_HEX = '#666666';
export const GRADIENT_TOP_HEX = '#eeeeee';
export const GRADIENT_BOTTOM_HEX = '#999999';
export const RIM_HEX = '#eaeaea';
export const RECT_BUTTON_GRADIENT_BOTTOM_HEX = '#b0b0b0';
export const ICON_UP_TOP_HEX = '#000000';
export const ICON_UP_BOTTOM_HEX = '#333333';
export const ICON_DOWN_TOP_HEX = '#202020';
export const ICON_DOWN_BOTTOM_HEX = '#363363';
export const SHADOW_UP_HEX = '#ffffff';
export const SHADOW_DOWN_HEX = '#bbbbbb';
export const iconUpGradient = getGradient('iconUp', [ICON_UP_TOP_HEX, ICON_UP_BOTTOM_HEX], TOP_TO_BOTTOM);
export const iconDownGradient = getGradient('iconDown', [ICON_DOWN_TOP_HEX, ICON_DOWN_BOTTOM_HEX], TOP_TO_BOTTOM);
export const GLASS_LIGHT_HEX = '#eaebdc';

class iButton extends UIButton {
    constructor(containerElement, pointerElement=null, upFunction=null) {
        super(containerElement, pointerElement, upFunction);
        this.addMouseListeners();
    }
    onDown = (evt) => {
        super.onDown(evt);
        this.downState();
    }
    onLeave = (evt) => {
        super.onLeave(evt);
        this.upState();
    }
    onUp = (evt) => {
        super.onUp(evt);
        this.upState();
    }
    enable() {UIElement.setPointer(this._pointerElement, 'visiblePainted');}
    upState() {}
    downState() {}
}

export class ShadedRect extends Rectangle {
    constructor(options) {
        const {
            width, height,
            borderRadius = 6,
            lightHex = HIGHLIGHT_HEX, darkHex = OUTLINE_HEX,
            gradientTopHex = GRADIENT_TOP_HEX, gradientBottomHex = GRADIENT_BOTTOM_HEX,
            left = 0, top = 0
        } = options;
        super({
            width, height,
            borderRadius,
            background: darkHex,
            left, top
        });
        const innerBorderRadius = borderRadius - 1;
        this.defaultHighlight = {
            width: width - 2,
            height: height - 2,
            borderRadius: innerBorderRadius,
            background: `linear-gradient(${lightHex}, ${darkHex})`,
            top: 1,
            left: 1
        };
        this.highlight = new Rectangle(this.defaultHighlight);
        this.defaultGradient = {
            width: width - 2,
            height: height - 3,
            borderRadius: innerBorderRadius,
            background: `linear-gradient(${gradientTopHex}, ${gradientBottomHex})`,
            top: 2,
            left: 1
        };
        this.gradient = new Rectangle(this.defaultGradient);
        this.appendChild(this.highlight);
        this.appendChild(this.gradient);
    }
}

class RectRimGroup extends Rectangle {
    constructor(options) {
        const {
            width, height,
            borderRadius = 6,
            rimHex = RIM_HEX,
            gradientBottomHex = RECT_BUTTON_GRADIENT_BOTTOM_HEX,
            left = 0, top = 0
        } = options;
        super({
            width,
            height,
            borderRadius,
            background: rimHex,
            left,
            top: top + 1
        });
        this.shadedRect = new ShadedRect({
            width,
            height,
            borderRadius,
            gradientBottomHex,
            top: -1
        });
        this.appendChild(this.shadedRect);
    }
}

export class RectButton extends iButton {
    constructor(options) {
        const {
            upFunction,
            width, height,
            borderRadius,
            rimHex,
            gradientBottomHex,
            left, top
        } = options;
        const rectRimGroup = new RectRimGroup({
            width, height,
            borderRadius,
            rimHex,
            gradientBottomHex,
            left, top
        });
        super(rectRimGroup, rectRimGroup.shadedRect.highlight, upFunction);
    }
}

export class ShadedCircle extends Circle {
    constructor(options) {
        const {
            width, height,
            darkHex = '#333333', lightHex = HIGHLIGHT_HEX,
            gradientBottomHex = GRADIENT_BOTTOM_HEX,
            left = 0, top = 0
        } = options;
        super({
            width, height,
            background: darkHex,
            left, top
        });
        this.light = new Circle({
            width: width - 2,
            height: height - 2,
            background: lightHex,
            top: 1,
            left: 1
        });
        this.defaultGradient = {
            width: width - 2,
            height: height - 3,
            background: `linear-gradient(${lightHex}, ${gradientBottomHex})`,
            top: 2,
            left: 1
        };
        this.altGradient = {
            width: width - 2,
            height: height - 2,
            background: `linear-gradient(${gradientBottomHex}, ${lightHex})`,
            top: 1,
            left: 1
        };
        this.gradient = new Circle(this.defaultGradient);
        this.appendChild(this.light);
        this.appendChild(this.gradient);
    }
}

class CircleRimGroup extends Circle {
    constructor(options) {
        const {
            width, height,
            rimHex = '#cccccc',
            darkHex = '#333333', lightHex,
            gradientBottomHex,
            left = 0, top = 0
        } = options;
        super({
            width,
            height,
            background: rimHex,
            left,
            top: top + 1
        });
        this.shadedCircle = new ShadedCircle({
            width, height,
            darkHex, lightHex,
            gradientBottomHex,
            top: -1
        });
        this.appendChild(this.shadedCircle);
    }
}
/*export class ShadedCircle extends iButton {
    constructor(options) {
        const {
            upFunction,
            diameter,
            darkHex = '#333333', lightHex = '#ffffff',
            gradientBottomHex = '#999999'
        } = options;
        const dark = new Circle({
            diameter,
            background: darkHex
        });
        super(dark, upFunction);
        this.upOptions = {
            width: diameter - 2,
            height: diameter - 3,
            background: `linear-gradient(${lightHex}, ${gradientBottomHex})`,
            top: 2,
            left: 1
        };
        this.downOptions = {
            width: diameter - 2,
            height: diameter - 2,
            background: `linear-gradient(${gradientBottomHex}, ${lightHex})`,
            top: 1,
            left: 1
        };
        this.light = new Circle({
            diameter: diameter - 2,
            background: lightHex,
            top: 1,
            left: 1
        });
        this.gradient = new Circle(this.upOptions);
        this.appendChild(dark);
        this.appendChild(this.light);
        this.appendChild(this.gradient);
    }
    upState() {
        this.light.style.display = 'inline-block';
        this.gradient.parseOptions(this.upOptions);
    }
    downState() {
        this.light.style.display = 'none';
        this.gradient.parseOptions(this.downOptions);
    }
}*/

export class CircleButton extends iButton {
    constructor(options) {
        const {
            upFunction,
            width, height,
            rimHex = '#cccccc',
            darkHex = '#333333', lightHex = '#ffffff',
            gradientBottomHex = '#999999',
            left = 0, top = 0
        } = options;
        const circleRimGroup = new CircleRimGroup({
            width, height,
            rimHex,
            darkHex, lightHex,
            gradientBottomHex,
            left, top
        });
        super(circleRimGroup, circleRimGroup.shadedCircle, upFunction);
    }
}
/*
export class ShadedCircle extends iButton {
    constructor(options) {
        const {
            upFunction,
            diameter,
            darkHex = '#333333', lightHex = '#ffffff',
            gradientBottomHex = '#999999'
        } = options;
        const dark = new Circle({
            diameter,
            background: darkHex
        });
        super(dark, upFunction);
        this.upGradient = `linear-gradient(${lightHex}, ${gradientBottomHex})`;
        this.downGradient = `linear-gradient(${gradientBottomHex}, ${lightHex})`;
        this.upOptions = {
            width: diameter - 2,
            height: diameter - 3,
            background: this.upGradient,
            top: 2,
            left: 1
        };
        this.downOptions = {
            width: diameter - 2,
            height: diameter - 2,
            background: this.downGradient,
            top: 1,
            left: 1
        };
        this.light = new Circle({
            diameter: diameter - 2,
            background: lightHex,
            top: 1,
            left: 1
        });
        this.gradient = new Circle(this.upOptions);
        this.appendChild(dark);
        this.appendChild(this.light);
        this.appendChild(this.gradient);
    }
    upState() {
        this.light.style.display = 'inline-block';
        this.gradient.parseOptions(this.upOptions);
    }
    downState() {
        this.light.style.display = 'none';
        this.gradient.parseOptions(this.downOptions);
    }
}

export class CircleButton extends ShadedCircle {
    constructor(options) {
        const {
            diameter,
            rimHex = '#cccccc',
            left = 0, top = 0
        } = options;
        super(options);
        const rim = new Circle({
            diameter,
            background: rimHex,
            top: 1
        });
        this.prependChild(rim);
        this.assignStyles({
            left,
            top
        });
    }
}*/

export class GlassPanel extends Rectangle {
    constructor(options) {
        const {width, height, colorString, rimHex = RIM_HEX, left=0, top=0} = options;
        const borderRadius = 4;
        super({
            width,
            height,
            borderRadius: 4,
            background: rimHex,
            left,
            top: top + 1,
        });
        const dark = new Rectangle({
            width,
            height,
            borderRadius,
            background: OUTLINE_HEX,
            top: -1
        });
        let lightHex, darkHex;
        switch (colorString) {
            case 'purple':
                lightHex = '#8585ae';
                darkHex = '#7779a0';
                break;
            default:
                lightHex = GLASS_LIGHT_HEX;
                darkHex = '#cfd2c1';
                break;
        }
        const shadow = new Rectangle({
            width: width - 2,
            height: height - 2,
            borderRadius: borderRadius - 1,
            background: darkHex,
            left: 1
        });
        const light = new Rectangle({
            width: width - 4,
            height: height - 3,
            borderRadius: borderRadius - 2,
            background: lightHex,
            top: 1,
            left: 2
        });
        const gradientHeight = height * 0.45;
        const gradient = new Rectangle({
            width: width - 4,
            height: gradientHeight,
            borderRadius: `0px 0px ${borderRadius}px ${borderRadius}px`,
            background: `linear-gradient(${darkHex}, ${lightHex})`,
            top: height - gradientHeight - 2,
            left: 2
        });
        this.appendChild(dark);
        this.appendChild(shadow);
        this.appendChild(light);
        this.appendChild(gradient);
    }
}

export class ProgressBar extends SemicircleBar {
    constructor(options) {
        const {width, height, containerHex, progressHex} = options;
        const superOptions = {
            width: width,
            height: height,
            background: containerHex
        };
        super(superOptions);
        UIElement.assignStyles(this, {
            overflow: 'hidden'
        });
        this.progressRect = new Rectangle({
            width: '0%',
            height: '100%',
            background: progressHex
        });
        this.appendChild(this.progressRect);
    }
    setProgress(percent) {
        percent = clamp(percent, 0, 100);
        this.progressRect.style.width = `${percent}%`
    }
}
export class DoubleProgressBar extends SemicircleBar {
    constructor(options) {
        const {width, height, containerHex, rearProgressHex, frontProgressHex, top=0, left=0} = options;
        const superOptions = {
            width: width,
            height: height,
            background: containerHex,
            top,
            left
        };
        super(superOptions);
        this.style.overflow = 'hidden';
        const progressBarOptions = {
            width: width,
            height: height,
            containerHex: rearProgressHex,
            progressHex: frontProgressHex
        }
        this.progressBar = new ProgressBar(progressBarOptions);
        this.appendChild(this.progressBar);
        this.setProgressRear(0);
    }
    setProgressRear(percent) {
        percent = clamp(percent, 0, 100);
        UIElement.assignStyles(this.progressBar, {
            transform: `translateX(${percent - 100}%)`
        });
    }
    setProgressFront(percent) {
        percent = clamp(percent, 0, 100);
        this.progressBar.setProgress(percent);
    }
}

/*export class Slider extends UIElement {
    constructor(options) {
        super();
        const {width, height} = options;
        const rimOptions = { width, height, colorHex: '#bbbbbb' };
        const darkOptions = { width, height, colorHex: '#333333' };
        const progressOptions = { width: width - 2, height: height - 2, containerHex: GLASS_LIGHT_HEX, progressHex: '#666666' };
        const rim = new SemicircleBar(rimOptions);
        UIElement.assignStyles(rim, {
            position: 'absolute',
            top: '1px',
            left: '0px'
        });
        const dark = new SemicircleBar(darkOptions);
        UIElement.assignStyles(dark, {
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        const progressBar = new ProgressBar(progressOptions);
        UIElement.assignStyles(progressBar, {
            position: 'absolute',
            top: '1px',
            left: '1px'
        });
        const handle = document.createElement('div');
        UIElement.assignStyles(handle, {
            width: `${height}px`,
            height: `${height}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, #c8c8c8, #cccccc, #dddddd, #ffffff)`,
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        this.appendChild(rim);
        this.appendChild(dark);
        this.appendChild(progressBar);
        this.appendChild(handle);
    }
}*/
export class DoubleProgressSeekBar extends UIElement {
    constructor(options) {
        super();
        const {width, height, top=0, left=0} = options;
        const rimOptions = {width, height, background: '#bbbbbb', top: 1};
        const rim = new SemicircleBar(rimOptions);
        const darkOptions = {width, height, background: '#333333'};
        const dark = new SemicircleBar(darkOptions);
        const doubleProgressOptions = {
            width: width - 2,
            height: height - 2,
            containerHex: '#151c23',
            rearProgressHex: GLASS_LIGHT_HEX,
            frontProgressHex: '#666666',
            top: 1,
            left: 1
        }
        this.doubleProgressBar = new DoubleProgressBar(doubleProgressOptions);
        this.appendChild(rim);
        this.appendChild(dark);
        this.appendChild(this.doubleProgressBar);
        UIElement.assignStyles(this, {
            left: `${left}px`,
            top: `${top}px`
        });
    }
    setProgressRear(percent) {
        this.doubleProgressBar.setProgressRear(percent);
    }
    setProgressFront(percent) {
        this.doubleProgressBar.setProgressFront(percent);
    }
}

/*export class TriangleShadow extends UIElement {
    constructor(options) {
        super(UIElement.SVG);
        const {orientation = AcuteTriangle.UP, width, height} = options;
        this.polygon = this.drawPolygon(orientation, width, height);
        this.element.appendChild(this.polygon);
        UIElement.assignAttributes(this.element, {
            width,
            height: height + 1
        });
    }
    drawPolygon(orientation, width, height) {
        const polygon = UIElement.parseElementType(UIElement.POLYGON);
        let points;
        switch (orientation) {
            case AcuteTriangle.UP:
                //points = `0,${height} ${width/2},0 ${width},${height}`;
                break;
            case AcuteTriangle.DOWN:
                //points = `0,0 ${width/2},${height} ${width},0`;
                break;
            case AcuteTriangle.LEFT:
                //points = `${width},0 0,${height/2} ${width},${height}`;
                break;
            case AcuteTriangle.RIGHT:
                points = `0,0 ${width},${height/2} ${width},${height/2+1} 0,${height+1}`;
                break;
            default:
                throw new Error(`Invalid TriangleShadow orientation "${this.orientation}".`);
        }
        polygon.setAttribute('points', points);
        return polygon;
    }
    parseStateOptions(options) {
        this.element.setAttribute('transform', `translate(${options.left}, ${options.top})`);
        this.colorPolygon(options.colorHex);
    }
    colorPolygon(colorHex) {
        this.polygon.setAttribute("fill", colorHex);
    }
}*/