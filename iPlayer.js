import { UIButton } from './UIButton.js';
import { UIElement, UIVector } from './UIElement.js';
import { Button2State } from '../UserInterface_JS/UIButton.js'
import { Circle, Rectangle, SemicircleBar, ArrowBar, getGradient } from './Primitives.js';
import { LEFT_TO_RIGHT, RIGHT_TO_LEFT, TOP_TO_BOTTOM, BOTTOM_TO_TOP,
         UP, DOWN, LEFT, RIGHT, NONE,
         noop } from '../Utilities_JS/constants.js';
import { clamp, decimalColor } from '../Utilities_JS/mathUtils.js';
import { Tween } from '../Utilities_JS/Tween.js';
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
const BORDER_RADIUS = 6;

export class ShadedRect extends Rectangle {
    constructor(options) {
        const {
            width, height,
            borderRadius = BORDER_RADIUS,
            lightHex = HIGHLIGHT_HEX, darkHex = OUTLINE_HEX,
            gradientTopHex = GRADIENT_TOP_HEX, gradientBottomHex = GRADIENT_BOTTOM_HEX,
            left = 0, top = 0
        } = options;
        super({width, height, borderRadius, background:darkHex, left, top});
        const innerWidth = width - 2;
        const innerBorderRadius = borderRadius - 1;
        this.defaultHighlight = {background: `linear-gradient(${lightHex}, ${darkHex})`};
        this.altHighlight = {background:darkHex};
        this.highlight = new Rectangle({
            ...this.defaultHighlight,
            width: innerWidth,
            height: height - 2,
            borderRadius: innerBorderRadius,
            top: 1, left: 1
        });
        this.defaultGradient = {
            height: height - 3,
            background: `linear-gradient(${gradientTopHex}, ${gradientBottomHex})`,
            top: 2
        };
        this.altGradient = {
            height: height - 2.25,
            background: `linear-gradient(${gradientBottomHex}, ${gradientTopHex})`,
            top: 1.25
        };
        this.gradient = new Rectangle({
            ...this.defaultGradient,
            width: innerWidth,
            borderRadius: innerBorderRadius,
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

class RectRimGroup extends Rectangle {
    constructor(options) {
        const {
            width, height,
            borderRadius = BORDER_RADIUS,
            rimHex = RIM_HEX,
            darkHex = '#505050',
            gradientBottomHex = RECT_BUTTON_GRADIENT_BOTTOM_HEX,
            left = 0, top = 0
        } = options;
        super({width, height, borderRadius, background:rimHex, left, top:top+1});
        this.shadedRect = new ShadedRect({width, height, borderRadius, darkHex, gradientBottomHex, top:-1});
        this.appendChild(this.shadedRect);
    }
    defaultState() {this.shadedRect.defaultState();}
    altState() {this.shadedRect.altState();}
}

export class RectButton extends Button2State {
    constructor(options) {
        const {upFunction, width, height, borderRadius, rimHex, gradientBottomHex, left, top} = options;
        const rectRimGroup = new RectRimGroup({width, height, borderRadius, rimHex, gradientBottomHex, left, top});
        super(rectRimGroup, rectRimGroup.shadedRect.highlight, upFunction);
        this.rectRimGroup = rectRimGroup;
    }
    upState() {this.rectRimGroup.defaultState();}
    downState() {this.rectRimGroup.altState();}
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
        this.defaultHighlight = {background:`linear-gradient(${lightHex}, ${gradientBottomHex})`};
        this.altHighlight = {background:darkHex};
        this.highlight = new Circle({
            ...this.defaultHighlight,
            width: innerWidth,
            height: height - 2,
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

export class CircleButton extends Button2State {
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
    static PURPLE = 'purple';
    static NORMAL = 'normal';
    static LOW = 'low';
    static HIGH = 'high';
    constructor(options) {
        const {width, height, colorString, rimHex=RIM_HEX, level=GlassPanel.NORMAL, borderRadius=4, left=0, top=0} = options;
        super({width, height, borderRadius, left, top:top+1});
        this.normalColors = {rim:rimHex, outline:OUTLINE_HEX, light:undefined, dark:undefined, gradient:undefined};
        this.lowColors = {rim:decimalColor(rimHex, .75), outline:OUTLINE_HEX, light:undefined, dark:undefined, gradient:undefined};
        this.highColors = {rim:HIGHLIGHT_HEX, outline:OUTLINE_HEX, light:undefined, dark:undefined, gradient:undefined};
        switch (colorString) {
            case GlassPanel.PURPLE:
                this.normalColors.light = '#aeaec9';
                this.normalColors.dark = '#9a9bb8';
                this.lowColors.light = '#61617f';
                this.lowColors.dark = '#575874';
                this.highColors.light = '#BCBCD3';
                this.highColors.dark = '#A8AAC3';
                break;
            default:
                this.normalColors.light = GLASS_LIGHT_HEX;
                this.normalColors.dark = '#cfd2c1';
                break;
        }
        this.normalColors.gradient = `linear-gradient(${this.normalColors.dark}, ${this.normalColors.light})`;
        this.lowColors.gradient = `linear-gradient(${this.lowColors.dark}, ${this.lowColors.light})`;
        this.highColors.gradient = `linear-gradient(${this.highColors.dark}, ${this.highColors.light})`;
        this.outline = new Rectangle({width, height, borderRadius, top:-1});
        this.shadow = new Rectangle({
            width: width - 2,
            height: height - 2,
            borderRadius: borderRadius - 1,
            left: 1
        });
        this.light = new Rectangle({
            width: width - 4,
            height: height - 3,
            borderRadius: borderRadius - 2,
            top: 1, left: 2
        });
        const gradientHeight = height * 0.45;
        this.gradient = new Rectangle({
            width: width - 4,
            height: gradientHeight,
            borderRadius: `0px 0px ${borderRadius}px ${borderRadius}px`,
            top: height - gradientHeight - 2,
            left: 2
        });
        this.appendChild(this.outline);
        this.appendChild(this.shadow);
        this.appendChild(this.light);
        this.appendChild(this.gradient);
        this.setLevel(level);
    }
    setLevel(level) {
        let colorObject;
        switch (level) {
            case GlassPanel.NORMAL: colorObject = this.normalColors; break;
            case GlassPanel.LOW: colorObject = this.lowColors; break;
            case GlassPanel.HIGH: colorObject = this.highColors; break;
            default: throw new Error(`GlassPanel.setLevel: Invald level "${level}".`);
        }
        this.style.background = colorObject.rim;
        this.outline.style.background = colorObject.outline;
        this.shadow.style.background = colorObject.dark;
        this.light.style.background = colorObject.light;
        this.gradient.style.background = colorObject.gradient;
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

export class TriangleShadow extends UIVector {
    constructor(options) {
        const {orientation, width, height, color, left=0, top=0} = options;
        const superOptions = {orientation, width, height:height+1, color, left, top};
        super(superOptions);
    }
    setPoints(orientation=UP, width, height) {
        height -= 1;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const heightPlusOne = height + 1;
        switch (orientation) {
            case UP: return `0,${heightPlusOne} 0,${height} ${halfWidth},0 ${width},${height} ${width},${heightPlusOne}`;
            case DOWN: return `0,0 ${halfWidth},${height} ${width},0`;
            case LEFT: return `${width},0 0,${halfHeight} 0,${halfHeight+1} ${width},${heightPlusOne}`;
            case RIGHT: return `0,0 ${width},${halfHeight} ${width},${halfHeight+1} 0,${heightPlusOne}`;
            default: throw new Error(`TriangleShadow.setPoints: Invalid orientation "${this.orientation}".`);
        }
    }
}

export class RimmedBar extends Rectangle {
    constructor(options) {
        const {rimSide=LEFT, width, height, background, barHex, left, top, transform, transformOrigin} = options;
        super({width, height, background, left, top, transform, transformOrigin});
        let innerWidth;
        let innerLeft;
        switch (rimSide) {
            case LEFT:
                innerWidth = width - 1;
                innerLeft = 1;
                break;
            case RIGHT:
                innerWidth = width - 1;
                innerLeft = 0;
                break;
            case NONE:
                innerWidth = width;
                innerLeft = 0;
                break;
        }
        const innerHeight = height - 1;
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

export class ShadedArrowBar extends ArrowBar {
    constructor(options) {
        const {
            width, height,
            darkHex = OUTLINE_HEX, altTopHex = GRADIENT_TOP_HEX, altBottomHex = GRADIENT_BOTTOM_HEX,
            left = 0, top = 0
        } = options;
        super({width, height, color:darkHex, left, top});
        const darkenDecimal = .5;
        const defaultTopHex = decimalColor(altTopHex, darkenDecimal);
        const defaultBottomHex = decimalColor(altBottomHex, darkenDecimal);
        this.defaultGradient = getGradient('defaultGradient', [defaultTopHex, defaultBottomHex], TOP_TO_BOTTOM);
        this.altGradient = getGradient('altGradient', [altTopHex, altBottomHex], TOP_TO_BOTTOM);
        this.gradientArrowBar = new ArrowBar({
            color: this.defaultGradient,
            width: width - 4,
            height: height - 2,
            top: 1, left: 2,
            useXY: true
        });
        this.appendChild(this.gradientArrowBar);
    }
    defaultState() {
        this.gradientArrowBar.colorPolygon(this.defaultGradient);
    }
    altState() {
        this.gradientArrowBar.colorPolygon(this.altGradient);
    }
}

export class TransitionRect extends Rectangle {
    constructor(options) {
        const {borderRadius=BORDER_RADIUS, thickness=1, colorHex=OUTLINE_HEX} = options;
        super({borderRadius});
        this.assignStyles({
            border: `${thickness}px solid ${colorHex}`,
            boxSizing: 'border-box'
        });
        this.current = {width:undefined, height:undefined, left:undefined, top:undefined};
        this.progress = 0;
    }
    transitionTo(options) {
        const {startObject, endObject, duration=100, startProgress=0, onUpdate=noop, onComplete=noop} = options;
        const startWidth = parseInt(startObject.style.width, 10);
        const startHeight = parseInt(startObject.style.height, 10);
        const startLeft = parseInt(startObject.style.left, 10);
        const startTop = parseInt(startObject.style.top, 10);
        const endWidth = parseInt(endObject.style.width, 10);
        const endHeight = parseInt(endObject.style.height, 10);
        const endLeft = parseInt(endObject.style.left, 10);
        const endTop = parseInt(endObject.style.top, 10);
        const updateTransition = () => {
            const progress = this.progress;
            const decimalRemaining = 1 - progress;
            const current = this.current;
            current.width = startWidth*decimalRemaining + endWidth*progress;
            current.height = startHeight*decimalRemaining + endHeight*progress;
            current.left = startLeft*decimalRemaining + endLeft*progress;
            current.top = startTop*decimalRemaining + endTop*progress;
            this.assignStyles(current);
            onUpdate(progress);
        }
        const completeTransition = () => {
            Tween.putInstance(this.tween);
            this.progress = 0;
            onComplete();
        }
        this.progress = startProgress;
        this.tween = Tween.getInstance({
            targetObject: this, targetProperty: 'progress', propertyValue: 1,
            duration, onUpdate:updateTransition, onComplete:completeTransition
        });
        this.tween.animate();
    }
}