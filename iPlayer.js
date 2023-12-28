import { UIElement, UIVector } from './UIElement.js';
import { UIButton, Button2State } from '../UserInterface_JS/UIButton.js'
import { Circle, Rectangle, SemicircleBar, ArrowBar, getGradient } from './Primitives.js';
import { LEFT_TO_RIGHT, RIGHT_TO_LEFT, TOP_TO_BOTTOM, BOTTOM_TO_TOP,
         UP, DOWN, LEFT, RIGHT, NONE, BORDER_BOX, CONTENT_BOX,
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
        const defaultBase = {background: `linear-gradient(${lightHex}, ${darkHex})`};
        super({...defaultBase, width, height, borderRadius, boxSizing:BORDER_BOX, padding:'1px', border:`1px solid ${darkHex}`, left, top});
        this.defaultBase = defaultBase;
        this.defaultGradient = {height:height-3, background:`linear-gradient(${gradientTopHex}, ${gradientBottomHex})`, top:1};
        this.gradient = new Rectangle({...this.defaultGradient, width:width-2, borderRadius:borderRadius-1});
        this.appendChild(this.gradient);
    }
}
export class ShadedRectState extends ShadedRect {
    constructor(options) {
        super(options);
        const {height, darkHex=OUTLINE_HEX, gradientTopHex=GRADIENT_TOP_HEX, gradientBottomHex=GRADIENT_BOTTOM_HEX} = options;
        this.altBase = {background:darkHex};
        this.altGradient = {height:height-2.25, background:`linear-gradient(${gradientBottomHex}, ${gradientTopHex})`, top:.25};
    }
    defaultState() {
        this.assignStyles(this.defaultBase);
        this.gradient.assignStyles(this.defaultGradient);
    }
    altState() {
        this.assignStyles(this.altBase);
        this.gradient.assignStyles(this.altGradient);
    }
}
export class ShadedRectMenu extends ShadedRect {
    constructor(options) {
        super(options);
        this.init = noop;
        this.fini = noop;
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
        this.shadedRectState = new ShadedRectState({width, height, borderRadius, darkHex, gradientBottomHex, top:-1});
        this.appendChild(this.shadedRectState);
    }
    defaultState() {this.shadedRectState.defaultState();}
    altState() {this.shadedRectState.altState();}
}

export class RectButton extends Button2State {
    constructor(options) {
        const {execFunction, width, height, borderRadius, rimHex, gradientBottomHex, left, top} = options;
        const rectRimGroup = new RectRimGroup({width, height, borderRadius, rimHex, gradientBottomHex, left, top});
        super(rectRimGroup, rectRimGroup.shadedRectState, execFunction);
        this.rectRimGroup = rectRimGroup;
    }
    get menu() {}
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
        const defaultBase = {background:`linear-gradient(${lightHex}, ${gradientBottomHex})`};
        super({...defaultBase, width, height, boxSizing:BORDER_BOX, padding:'1px', border:`1px solid ${darkHex}`, left, top});
        this.defaultBase = defaultBase;
        this.altBase = {background:darkHex};
        this.defaultGradient = {height:height-3, background:`linear-gradient(${lightHex}, ${gradientBottomHex})`, top:1};
        this.altGradient = {height:height-2.25, background:`linear-gradient(${gradientBottomHex}, ${lightHex})`, top:.25};
        this.gradient = new Circle({...this.defaultGradient, width:width-2});
        this.appendChild(this.gradient);
    }
    defaultState() {
        this.assignStyles(this.defaultBase);
        this.gradient.assignStyles(this.defaultGradient);
    }
    altState() {
        this.assignStyles(this.altBase);
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
            execFunction,
            width, height,
            rimHex = '#cccccc',
            darkHex, lightHex,
            gradientBottomHex = '#999999',
            left = 0, top = 0
        } = options;
        const circleRimGroup = new CircleRimGroup({width, height, rimHex, darkHex, lightHex, gradientBottomHex, left, top});
        super(circleRimGroup, circleRimGroup.shadedCircle, execFunction);
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
                this.highColors.light = '#bcbcd3';
                this.highColors.dark = '#a8aac3';
                break;
            default:
                this.normalColors.light = GLASS_LIGHT_HEX;
                this.normalColors.dark = '#cfd2c1';
                break;
        }
        this.normalColors.gradient = `linear-gradient(${this.normalColors.dark}, ${this.normalColors.light})`;
        this.lowColors.gradient = `linear-gradient(${this.lowColors.dark}, ${this.lowColors.light})`;
        this.highColors.gradient = `linear-gradient(${this.highColors.dark}, ${this.highColors.light})`;
        this.shadow = new Rectangle({width, height, borderRadius:borderRadius, boxSizing:BORDER_BOX, padding:'1px', top:-1});
        this.light = new Rectangle({width:width-4, height:height-3, borderRadius:borderRadius-2, top:1, left:2});
        const gradientH = height * 0.45;
        this.gradient = new Rectangle({width:width-4, height:gradientH, borderRadius:`0px 0px ${borderRadius}px ${borderRadius}px`, top:height-gradientH-2, left:2});
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
        this.shadow.style.border = `1px solid ${colorObject.outline}`;
        this.shadow.style.background = colorObject.dark;
        this.light.style.background = colorObject.light;
        this.gradient.style.background = colorObject.gradient;
    }
}

export class ProgressBar extends SemicircleBar {
    constructor(options) {
        const {width, height, containerHex, progressHex, minDecimal=0, maxDecimal=1, left=0, top=0} = options;
        super({width, height, background:containerHex, left, top});
        this.minDecimal = minDecimal;
        this.maxDecimal = maxDecimal;
        this.rangeDecimal = maxDecimal - minDecimal;
        this.style.overflow = 'hidden';
        this.progressRect = new Rectangle({width:'0%', height:'100%', background:progressHex});
        this.appendChild(this.progressRect);
    }
    setProgress(decimal) {
        const percent = (this.minDecimal + clamp(decimal, 0, 1)*this.rangeDecimal) * 100;
        this.progressRect.style.width = `${percent}%`
    }
}
export class DoubleProgressBar extends SemicircleBar {
    constructor(options) {
        const {width, height, boxSizing=CONTENT_BOX, border=NONE, containerHex, rearProgressHex, frontProgressHex, top=0, left=0} = options;
        const superOptions = {width, height, background:containerHex, boxSizing, border, top, left};
        super(superOptions);
        this.style.overflow = 'hidden';
        const offset = parseFloat(border);
        const offsetX2 = offset * 2;
        this.progressBar = new ProgressBar({
            width: width - offsetX2, height: height - offsetX2,
            containerHex: rearProgressHex, progressHex: frontProgressHex
        });
        this.appendChild(this.progressBar);
        this.setProgressRear(0);
    }
    setProgressRear(decimal) {
        const percent = clamp(decimal, 0, 1) * 100;
        this.progressBar.style.transform = `translateX(${percent - 100}%)`;
    }
    setProgressFront(decimal) {
        this.progressBar.setProgress(decimal);
    }
}

export class DoubleProgressSeekBar extends SemicircleBar {
    constructor(options) {
        const {width, height, top=0, left=0} = options;
        super({width, height, background: '#cccccc', left, top:top+1});
        this.doubleProgressBar = new DoubleProgressBar({
            width, height,
            containerHex: '#151c23',
            rearProgressHex: GLASS_LIGHT_HEX,
            frontProgressHex: '#666666',
            boxSizing: BORDER_BOX, padding: '1px', border: '1px solid #333333',
            top: -1
        });
        this.appendChild(this.doubleProgressBar);
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

export class Slider extends SemicircleBar {
    constructor(options) {
        const {width, height, containerHex='#bcbcd3', progressHex='#6664BE', thumbDiameter=16, setFunction, scaleValue=1, left=0, top=0} = options;
        super({width, height, background:RIM_HEX, left, top:top+1});
        this.barWidth = width;
        this.thumbMax = width - thumbDiameter;
        this.setFunction = setFunction;
        this.scaleValue = scaleValue;
        const minDecimal = thumbDiameter / this.barWidth / 2;
        this.progressBar = new ProgressBar({width, height, containerHex, progressHex, minDecimal, maxDecimal:1-minDecimal, top:-1});
        this.barButton = new UIButton(this.progressBar, null, this.onBarDown);
        this.barButton.enable();
        this.thumb = new Circle({
            width: thumbDiameter, height: thumbDiameter,
            background: `radial-gradient(circle at center, #c8c8c8, #cccccc, #dddddd, #000000)`,
            top: (height-thumbDiameter)/2 - 1
        });
        this.thumb.style.boxShadow =  '0px 1px 1px rgba(0, 0, 0, .5)';
        this.thumb.style.cursor = 'pointer';
        this.thumb.enable();
        this.appendChild(this.progressBar);
        this.appendChild(this.thumb);
    }
    addListeners() {
        this.barButton.addMouseListeners();
        this.thumb.addInteractiveListener(UIButton.MOUSE_DOWN, this.onThumbDown);
    }
    removeListeners() {
        this.barButton.removeMouseListeners();
        this.thumb.removeInteractiveListener(UIButton.MOUSE_DOWN, this.onThumbDown);
    }
    updateBar(decimal) {this.progressBar.setProgress(decimal);}
    updateThumb(decimal) {this.thumb.style.left = `${this.thumbMax*decimal}px`;}
    onBarDown = (evt) => {
        this.updateProgressByDecimal(evt.offsetX/this.barWidth, true);
    }
    onThumbDown = (evt) => {
        document.addEventListener(UIButton.MOUSE_MOVE, this.onThumbMove);
        document.addEventListener(UIButton.MOUSE_UP, this.onThumbUp);
        this.dragStartX = evt.clientX;
        this.dragStartLeft = this.thumb._element.offsetLeft;
    }
    onThumbMove = (evt) => {
        const delta = (evt.clientX - this.dragStartX) / this.scaleValue;
        const newLeft = clamp(this.dragStartLeft+delta, 0, this.thumbMax);
        this.updateProgressByThumb(newLeft, true);
    }
    onThumbUp = () => {
        document.removeEventListener(UIButton.MOUSE_MOVE, this.onThumbMove);
        document.removeEventListener(UIButton.MOUSE_UP, this.onThumbUp);
    }
    updateProgressByThumb(left, setProgress=false) {
        const decimal = clamp(left/this.thumbMax, 0, 1);
        this.updateBar(decimal);
        this.updateThumb(decimal);
        if (setProgress) {this.setFunction(decimal);}
    }
    updateProgressByDecimal(decimal, setProgress=false) {
        decimal = clamp(decimal, 0, 1);
        this.updateBar(decimal);
        this.updateThumb(decimal);
        if (setProgress) {this.setFunction(decimal);}
    }
}