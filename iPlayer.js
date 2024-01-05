import { UIElement, UIVector } from './UIElement.js';
import { UIButton, UIButtonDrag, Button2State } from '../UserInterface_JS/UIButton.js'
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
export const ALT_DELTA = .25;
const BORDER_RADIUS = 6;

export class ShadedRect extends Rectangle {
    constructor(options) {
        const {
            width, height,
            borderRadius = BORDER_RADIUS,
            lightHex = HIGHLIGHT_HEX, darkHex = OUTLINE_HEX,
            gradientTopHex = GRADIENT_TOP_HEX, gradientBottomHex = GRADIENT_BOTTOM_HEX,
            boxShadow = '',
            left = 0, top = 0
        } = options;
        const defaultStyle = {
            background:`linear-gradient(${gradientTopHex}, ${gradientBottomHex})`,
            boxShadow: `${boxShadow}inset 0 1px 0 ${lightHex}`
        };
        super({...defaultStyle, width, height, borderRadius, boxSizing:BORDER_BOX, border:`1px solid ${darkHex}`, left, top});
        this.defaultStyle = defaultStyle;
    }
}
export class ShadedRectState extends ShadedRect {
    constructor(options) {
        super(options);
        const {darkHex=OUTLINE_HEX, gradientTopHex=GRADIENT_TOP_HEX, gradientBottomHex=GRADIENT_BOTTOM_HEX, boxShadow=''} = options;
        this.altStyle = {
            background:`linear-gradient(${gradientBottomHex}, ${gradientTopHex})`,
            boxShadow: `${boxShadow}inset 0 ${ALT_DELTA}px 0 ${darkHex}`
        };
    }
    defaultState() {this.assignStyles(this.defaultStyle);}
    altState() {this.assignStyles(this.altStyle);}
}
export class ShadedRectMenu extends ShadedRect {
    constructor(options) {
        super(options);
        this.init = noop;
        this.fini = noop;
    }
}

class ShadedRectStateRim extends ShadedRectState {
    constructor(options) {
        const {
            width, height,
            borderRadius = BORDER_RADIUS,
            lightHex = HIGHLIGHT_HEX, darkHex = '#505050',
            gradientTopHex = GRADIENT_TOP_HEX, gradientBottomHex = RECT_BUTTON_GRADIENT_BOTTOM_HEX,
            rimHex = RIM_HEX,
            left = 0, top = 0
        } = options;
        super({width, height, borderRadius, lightHex, darkHex, gradientTopHex, gradientBottomHex, boxShadow:`0 1px 0 ${rimHex}, `, left, top});
    }
}

export class RectButton extends Button2State {
    constructor(options) {
        const {execFunction, width, height, borderRadius, rimHex, gradientBottomHex, left, top} = options;
        const shadedRectStateRim = new ShadedRectStateRim({width, height, borderRadius, rimHex, gradientBottomHex, left, top});
        super(shadedRectStateRim, null, execFunction);
        this.shadedRectStateRim = shadedRectStateRim;
    }
    get menu() {}
    upState() {this.shadedRectStateRim.defaultState();}
    downState() {this.shadedRectStateRim.altState();}
}

export class ShadedCircle extends Circle {
    constructor(options) {
        const {
            width, height,
            darkHex = OUTLINE_HEX, lightHex = HIGHLIGHT_HEX,
            gradientBottomHex = GRADIENT_BOTTOM_HEX,
            boxShadow = '',
            left = 0, top = 0
        } = options;
        const defaultStyle = {
            background:`linear-gradient(${lightHex}, ${gradientBottomHex})`,
            boxShadow: `${boxShadow}inset 0 1px 0 ${lightHex}`
        };
        super({...defaultStyle, width, height, boxSizing:BORDER_BOX, border:`1px solid ${darkHex}`, left, top});
        this.defaultStyle = defaultStyle;
    }
}

export class ShadedCircleState extends ShadedCircle {
    constructor(options) {
        super(options);
        const {lightHex=HIGHLIGHT_HEX, darkHex=OUTLINE_HEX, gradientBottomHex=GRADIENT_BOTTOM_HEX, boxShadow=''} = options;
        this.altStyle = {
            background:`linear-gradient(${gradientBottomHex}, ${lightHex})`,
            boxShadow: `${boxShadow}inset 0 ${ALT_DELTA}px 0 ${darkHex}`
        };
    }
    defaultState() {this.assignStyles(this.defaultStyle);}
    altState() {this.assignStyles(this.altStyle);}
}

class ShadedCircleStateRim extends ShadedCircleState {
    constructor(options) {
        const {
            width, height,
            darkHex, lightHex,
            gradientBottomHex,
            rimHex,
            left = 0, top = 0
        } = options;
        super({width, height, darkHex, lightHex, gradientBottomHex, boxShadow:`0 1px 0 ${rimHex}, `, left, top});
    }
}

export class CircleButton extends Button2State {
    constructor(options) {
        const {
            execFunction,
            width, height,
            rimHex = '#cccccc',
            darkHex = '#505050', lightHex,
            gradientBottomHex = '#999999',
            left = 0, top = 0
        } = options;
        const shadedCircleStateRim = new ShadedCircleStateRim({width, height, rimHex, darkHex, lightHex, gradientBottomHex, left, top});
        super(shadedCircleStateRim, null, execFunction);
        this.shadedCircleStateRim = shadedCircleStateRim;
    }
    upState() {this.shadedCircleStateRim.defaultState();}
    downState() {this.shadedCircleStateRim.altState();}
}

export class GlassPanel extends Rectangle {
    static PURPLE = 'purple';
    static NORMAL = 'normal';
    static LOW = 'low';
    static HIGH = 'high';
    constructor(options) {
        const {
            width, height, borderRadius=4, colorString, rimHex=RIM_HEX, level=GlassPanel.NORMAL,
            fontWeight='normal', fontSize=16, fontColor='#000000', textTop=0,
            left=0, top=0} = options;
        super({width, height, borderRadius, boxSizing:BORDER_BOX, left, top});
        this.normalColors = {rim:rimHex, outline:OUTLINE_HEX, light:undefined, dark:undefined, gradient:undefined};
        this.lowColors = {rim:decimalColor(rimHex, .6), outline:OUTLINE_HEX, light:undefined, dark:undefined, gradient:undefined};
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
        const gradientH = height * 0.45;
        this.gradient = new Rectangle({width:width-4, height:gradientH, borderRadius:`0px 0px ${borderRadius}px ${borderRadius}px`, top:height-gradientH-2, left:1});
        this.appendChild(this.gradient);
        this.setLevel(level);
        this.textSpan = new UIElement(UIElement.SPAN);
        this.gradient.appendChild(this.textSpan);
        this.textNode = document.createTextNode('');
        this.textSpan.appendChild(this.textNode);
        this.textSpan.assignStyles({
            width: '100%',
            fontFamily: 'Consolas, monospace', fontSize, color: fontColor, fontWeight,
            textAlign: 'center', whiteSpace: 'nowrap', userSelect: 'none', overflow: 'hidden',
            top: textTop
        });
    }
    set text(value) {this.textNode.nodeValue = value;}
    get text() {return this.textNode.nodeValue;}
    setLevel(level) {
        let colorObject;
        switch (level) {
            case GlassPanel.NORMAL: colorObject = this.normalColors; break;
            case GlassPanel.LOW: colorObject = this.lowColors; break;
            case GlassPanel.HIGH: colorObject = this.highColors; break;
            default: throw new Error(`GlassPanel.setLevel: Invald level "${level}".`);
        }
        this.assignStyles({
            background: colorObject.light,
            border: `1px solid ${colorObject.outline}`,
            boxShadow: `0 1px 0 ${colorObject.rim}, inset 0 1px 0px 0px ${colorObject.dark}, inset 1px 0px 0px 0px ${colorObject.dark}, inset -1px 0px 0px 0px ${colorObject.dark}`
        });
        this.gradient.style.background = colorObject.gradient;
    }
}

export class ProgressBar extends SemicircleBar {
    constructor(options) {
        const {width, height, containerHex, progressHex, minDecimal=0, maxDecimal=1, boxSizing=CONTENT_BOX, border=NONE, boxShadow=NONE, left=0, top=0} = options;
        super({width, height, background:containerHex, boxSizing, border, boxShadow, left, top});
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
    setContainerHex(colorHex) {this.style.background = colorHex;}
    setProgressHex(colorHex) {this.progressRect.style.background = colorHex;}
}
export class DoubleProgressBar extends ProgressBar {
    constructor(options) {
        const {width, height, boxSizing=CONTENT_BOX, border=NONE, containerHex, rearProgressHex, frontProgressHex, boxShadow=NONE, top=0, left=0} = options;
        const superOptions = {width, height, containerHex, progressHex:rearProgressHex, boxSizing, border, boxShadow, top, left};
        super(superOptions);
        this.containerHex = containerHex;
        this.rearProgressHex = rearProgressHex;
        this.frontProgressHex = frontProgressHex;
        this.setProgressRear(0);
        this.isFront = false;
    }
    setProgressRear(decimal) {
        if (this.isFront) {
            this.setContainerHex(this.containerHex);
            this.setProgressHex(this.rearProgressHex);
            this.isFront = false;
        }
        this.setProgress(decimal);
    }
    setProgressFront(decimal) {
        if (!this.isFront) {
            this.setContainerHex(this.rearProgressHex);
            this.setProgressHex(this.frontProgressHex);
            this.isFront = true;
        }
        this.setProgress(decimal);
    }
}

export class DoubleProgressSeekBar extends DoubleProgressBar {
    constructor(options) {
        const {
            width, height, rimHex = '#cccccc',
            containerHex = '#151c23', rearProgressHex = GLASS_LIGHT_HEX, frontProgressHex = '#666666',
            boxSizing = BORDER_BOX, border = '1px solid #333333',
            top = 0, left = 0
        } = options;
        super({
            width, height,
            containerHex, rearProgressHex, frontProgressHex,
            boxSizing, border,
            boxShadow: `0 1px 0 ${rimHex}`,
            left, top
        });
    }
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
        const darkenDecimal = .5;
        const defaultTopHex = decimalColor(altTopHex, darkenDecimal);
        const defaultBottomHex = decimalColor(altBottomHex, darkenDecimal);
        const defaultStyle = getGradient('defaultGradient', [defaultTopHex, defaultBottomHex], TOP_TO_BOTTOM);
        super({
            width: width-2,
            height: height-2,
            color: defaultStyle,
            left: left + 1,
            top: top + 1
        });
        this.defaultStyle = defaultStyle;
        this.altStyle = getGradient('altGradient', [altTopHex, altBottomHex], TOP_TO_BOTTOM);
        this.assignAttributes({stroke:darkHex, 'stroke-width':2});
    }
    defaultState() {this.colorPolygon(this.defaultStyle);}
    altState() {this.colorPolygon(this.altStyle);}
}
/*export class ShadedArrowBar extends ArrowBar {
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
}*/

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
        const thumb = new Circle({
            width: thumbDiameter, height: thumbDiameter,
            background: `radial-gradient(circle at center, #c8c8c8, #cccccc, #dddddd, #000000)`,
            top: (height-thumbDiameter)/2 - 1
        });
        thumb.style.boxShadow =  '0px 1px 1px rgba(0, 0, 0, .5)';
        thumb.style.cursor = 'pointer';
        this.thumbButton = new UIButtonDrag(thumb, null, this.onThumbMove, this.onThumbDown);
        this.thumbButton.enable();
        this.appendChild(this.progressBar);
        this.appendChild(this.thumbButton);
    }
    addListeners() {
        this.barButton.addMouseListeners();
        this.thumbButton.addMouseListeners();
    }
    removeListeners() {
        this.barButton.removeMouseListeners();
        this.thumbButton.removeMouseListeners();
    }
    updateBar(decimal) {this.progressBar.setProgress(decimal);}
    updateThumb(decimal) {this.thumbButton.style.left = `${this.thumbMax*decimal}px`;}
    onBarDown = (evt) => {this.updateProgressByDecimal(evt.offsetX/this.barWidth, true);}
    onThumbDown = (evt) => {this.dragStartLeft = this.thumbButton.offsetLeft;}
    onThumbMove = (deltaX) => {
        deltaX /= this.scaleValue;
        const newLeft = clamp(this.dragStartLeft+deltaX, 0, this.thumbMax);
        this.updateProgressByThumb(newLeft, true);
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