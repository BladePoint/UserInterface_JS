import { UIButton } from './UIButton.js';
import { UIElement } from './UIElement.js';
import { Circle, Rectangle, SemicircleBar } from './Primitives.js';
import { LEFT_TO_RIGHT, RIGHT_TO_LEFT, TOP_TO_BOTTOM, BOTTOM_TO_TOP,
         UP, DOWN, LEFT, RIGHT } from '../Utilities_JS/constants.js';
import { clamp } from '../Utilities_JS/mathUtils.js';
export const HIGHLIGHT_HEX = '#ffffff';
export const OUTLINE_HEX = '#444444';
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
export const BAR_SHADOW_DEFAULT = `linear-gradient(${SHADOW_DOWN_HEX}, #dddddd)`;
export const BAR_SHADOW_ALT = `linear-gradient(#dddddd, ${SHADOW_DOWN_HEX})`;
export const BAR_RECT_DEFAULT = `linear-gradient(${ICON_UP_TOP_HEX}, ${ICON_UP_BOTTOM_HEX})`;
export const BAR_RECT_ALT = `linear-gradient(${ICON_DOWN_TOP_HEX}, ${ICON_DOWN_BOTTOM_HEX})`;
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
        super({width, height, borderRadius, background:darkHex, left, top});
        const innerWidth = width - 2;
        const innerBorderRadius = borderRadius - 1;
        this.defaultHighlight = {
            width: innerWidth,
            height: height - 2,
            borderRadius: innerBorderRadius,
            background: `linear-gradient(${lightHex}, ${darkHex})`,
            top: 1, left: 1
        };
        this.highlight = new Rectangle(this.defaultHighlight);
        this.defaultGradient = {
            width: innerWidth,
            height: height - 3,
            borderRadius: innerBorderRadius,
            background: `linear-gradient(${gradientTopHex}, ${gradientBottomHex})`,
            top: 2, left: 1
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
        super({width, height, borderRadius, background:rimHex, left, top:top+1});
        this.shadedRect = new ShadedRect({width, height, borderRadius, gradientBottomHex, top:-1});
        this.appendChild(this.shadedRect);
    }
}

export class RectButton extends iButton {
    constructor(options) {
        const {upFunction, width, height, borderRadius, rimHex, gradientBottomHex, left, top} = options;
        const rectRimGroup = new RectRimGroup({width, height, borderRadius, rimHex, gradientBottomHex, left, top});
        super(rectRimGroup, rectRimGroup.shadedRect.highlight, upFunction);
    }
}

export class ShadedCircle extends Circle {
    constructor(options) {
        const {
            width, height,
            darkHex = OUTLINE_HEX, lightHex = HIGHLIGHT_HEX,
            gradientBottomHex = GRADIENT_BOTTOM_HEX,
            left = 0, top = 0
        } = options;
        super({width, height, background:darkHex, left, top});
        const innerWidth = width - 2;
        this.defaultHighlight = {background:lightHex};
        this.altHighlight = {background:darkHex};
        this.highlight = new Circle({
            width: innerWidth,
            height: height - 2,
            background: lightHex,
            top: 1, left: 1
        });
        this.defaultGradient = {
            height: height - 3,
            background: `linear-gradient(${lightHex}, ${gradientBottomHex})`,
            top: 2,
        };
        this.altGradient = {
            height: height - 2.25,
            background: `linear-gradient(${gradientBottomHex}, ${lightHex})`,
            top: 1.25,
        };
        this.gradient = new Circle({
            ...this.defaultGradient,
            width: innerWidth,
            left: 1
        });
        this.appendChild(this.highlight);
        this.appendChild(this.gradient);
    }
    defaultState() {
        this.highlight.assignStyles(this.defaultHighlight);
        this.gradient.assignStyles(this.defaultGradient);
    }
    altState() {
        this.highlight.assignStyles(this.altHighlight);
        this.gradient.assignStyles(this.altGradient);
    }
}

class CircleRimGroup extends Circle {
    constructor(options) {
        const {
            width, height,
            rimHex,
            darkHex, lightHex,
            gradientBottomHex,
            left = 0, top = 0
        } = options;
        super({width, height, background:rimHex, left, top:top+1});
        this.shadedCircle = new ShadedCircle({width, height, darkHex, lightHex, gradientBottomHex, top:-1});
        this.appendChild(this.shadedCircle);
    }
    defaultState() {this.shadedCircle.defaultState();}
    altState() {this.shadedCircle.altState();}
}

export class CircleButton extends iButton {
    constructor(options) {
        const {
            upFunction,
            width, height,
            rimHex = '#cccccc',
            darkHex, lightHex,
            gradientBottomHex = '#999999',
            left = 0, top = 0
        } = options;
        const circleRimGroup = new CircleRimGroup({width, height, rimHex, darkHex, lightHex, gradientBottomHex, left, top});
        super(circleRimGroup, circleRimGroup.shadedCircle.highlight, upFunction);
        this.circleRimGroup = circleRimGroup;
    }
    upState() {this.circleRimGroup.defaultState();}
    downState() {this.circleRimGroup.altState();}
}

export class GlassPanel extends Rectangle {
    constructor(options) {
        const {width, height, colorString, rimHex = RIM_HEX, borderRadius=4, left=0, top=0} = options;
        super({width, height, borderRadius, background:rimHex, left, top:top+1});
        const dark = new Rectangle({width, height, borderRadius, background:OUTLINE_HEX, top:-1});
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
            top: 1, left: 2
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
        const superOptions = {width, height, background:containerHex};
        super(superOptions);
        this.style.overflow = 'hidden';
        this.progressRect = new Rectangle({width:'0%', height:'100%', background:progressHex});
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
        const superOptions = {width, height, background:containerHex, top, left};
        super(superOptions);
        this.style.overflow = 'hidden';
        const progressBarOptions = {width, height, containerHex:rearProgressHex, progressHex:frontProgressHex}
        this.progressBar = new ProgressBar(progressBarOptions);
        this.appendChild(this.progressBar);
        this.setProgressRear(0);
    }
    setProgressRear(percent) {
        percent = clamp(percent, 0, 100);
        this.progressBar.style.transform = `translateX(${percent - 100}%)`;
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
        this.assignStyles({left, top});
    }
    set rearProgress(percent) {this.doubleProgressBar.setProgressRear(percent);}
    set frontProgress(percent) {this.doubleProgressBar.setProgressFront(percent);}
}

export class TriangleShadow extends UIElement {
    constructor(options) {
        super(UIElement.SVG);
        const { orientation=UP, width, height, colorHex, left=0, top=0 } = options;
        this.polygon = this.drawPolygon(orientation, width, height);
        this.appendChild(this.polygon);
        this.assignAttributes({
            width,
            height: height + 1,
        });
        this.colorPolygon(colorHex);
        this.translatePolygon(left, top);
    }
    drawPolygon(orientation, width, height) {
        const polygon = UIElement.parseElementType(UIElement.POLYGON);
        let points;
        switch (orientation) {
            case UP:
                points = `0,${height} ${width/2},0 ${width},${height}`;
                break;
            case DOWN:
                points = `0,0 ${width/2},${height} ${width},0`;
                break;
            case LEFT:
                points = `${width},0 0,${height/2} 0,${height/2+1} ${width},${height+1}`;
                break;
            case RIGHT:
                points = `0,0 ${width},${height/2} ${width},${height/2+1} 0,${height+1}`;
                break;
            default:
                throw new Error(`TriangleShadow.drawPolygon: Invalid orientation "${this.orientation}".`);
        }
        polygon.setAttribute('points', points);
        return polygon;
    }
    colorPolygon(colorHex) {
        this.polygon.setAttribute('fill', colorHex);
    }
    translatePolygon(left, top) {
        this._element.setAttribute('transform', `translate(${left}, ${top})`);
    }
    colorAndTranslate(options) {
        const { colorHex, left=0, top=0 } = options;
        this.colorPolygon(colorHex);
        this.translatePolygon(left, top);
    }
}

export class RimmedBar extends Rectangle {
    constructor(options) {
        const {rimSide=LEFT, width, height, background, barHex, left=0, top=0} = options;
        super({width, height, background, left, top});
        const innerWidth = width - 1;
        const innerHeight = height - 1;
        const innerLeft = rimSide === LEFT ? 1 : 0;
        this.bar = new Rectangle({width:innerWidth, height:innerHeight, background:barHex, left:innerLeft});
        this.appendChild(this.bar);
        Object.defineProperty(this.style, 'barHex', {
            get: () => {this.bar.style.background},
            set: (newHex) => {this.bar.style.background = newHex;},
            enumerable: true,
            configurable: false,
        });
    }
}