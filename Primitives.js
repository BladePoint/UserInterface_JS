import { UIElement, UIVector } from './UIElement.js';
import { degreesToRadians } from '../Utilities_JS/mathUtils.js';
import { UP, DOWN, LEFT, RIGHT, LEFT_TO_RIGHT, RIGHT_TO_LEFT, TOP_TO_BOTTOM, BOTTOM_TO_TOP,
         NONE, CONTENT_BOX } from '../Utilities_JS/constants.js';
export function getGradient(id, colors, direction) {
    const parseDirection = (gradient, direction)=> {
        let x1;
        let y1;
        let x2;
        let y2;
        let type = typeof direction;
        if (type === 'string') {
            switch (direction) {
                case LEFT_TO_RIGHT:
                    x1 = 0;
                    y1 = 0;
                    x2 = 100;
                    y2 = 0;
                    break;
                case RIGHT_TO_LEFT:
                    x1 = 100;
                    y1 = 0;
                    x2 = 0;
                    y2 = 0;
                    break;
                case TOP_TO_BOTTOM:
                    x1 = 0;
                    y1 = 0;
                    x2 = 0;
                    y2 = 100;
                    break;
                case BOTTOM_TO_TOP:
                    x1 = 0;
                    y1 = 100;
                    x2 = 0;
                    y2 = 0;
                    break;
                default:
                    throw new Error(`Invalid gradientDirection "${direction}".`);
            }
        } else if (type === 'object') {
            x1 = direction.x1;
            y1 = direction.y1;
            const radians = degreesToRadians(direction.degrees);
            x2 = x1 + Math.cos(radians) * direction.distance;
            y2 = y1 + Math.sin(radians) * direction.distance;
        }
        UIElement.assignAttributes(gradient, {
            x1: `${x1}%`,
            y1: `${y1}%`,
            x2: `${x2}%`,
            y2: `${y2}%`
        });
    }
    const gradient = UIElement.parseElementType(UIElement.LINEAR_GRADIENT);
    gradient.id = id;
    const l = colors.length;
    for (let i=0; i<l; i++) {
        const stop = UIElement.parseElementType(UIElement.STOP);
        UIElement.assignAttributes(stop, {
            offset: `${(i / (l - 1)) * 100}%`,
            'stop-color': colors[i]
        });
        gradient.appendChild(stop);
    }
    parseDirection(gradient, direction);
    return gradient;
}

export class Rectangle extends UIElement {
    constructor(options) {
        super();
        const {width, height, background, borderRadius=0, boxSizing=CONTENT_BOX, border=NONE, boxShadow=NONE, left=0, top=0} = options;
        this.assignStyles({width, height, background, borderRadius, boxSizing, border, boxShadow, left, top});
    }
}

export class Circle extends Rectangle {
    constructor(options) {
        const {width, height, background, boxSizing=CONTENT_BOX, border=NONE, boxShadow=NONE, left=0, top=0} = options;
        super({width, height, background, borderRadius:'50%', boxSizing, border, boxShadow, left, top});
    }
}

export class SemicircleBar extends UIElement {
    constructor(options) {
        super();
        const {width, height, background, boxSizing=CONTENT_BOX, border=NONE, boxShadow = '', left=0, top=0} = options;
        this.assignStyles({width, height, borderRadius:height/2, background, boxSizing, border, boxShadow, left, top});
    }
}

export class AcuteTriangle extends UIVector {
    constructor(options) {
        super(options);
    }
    setPoints(orientation=UP, width, height) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        switch (orientation) {
            case UP: return `0,${height} ${halfWidth},0 ${width},${height}`;
            case DOWN: return `0,0 ${halfWidth},${height} ${width},0`;
            case LEFT: return `${width},0 0,${halfHeight} ${width},${height}`;
            case RIGHT: return `0,0 ${width},${halfHeight} 0,${height}`;
            default: throw new Error(`AcuteTriangle.setPoints: Invalid orientation "${this.orientation}".`);
        }
    }
}

export class ArrowBar extends UIVector {
    constructor(options) {
        super(options);
    }
    setPoints(orientation=LEFT_TO_RIGHT, width, height) {
        const halfHeight = height / 2;
        const widthMinusHalfHeight = width - halfHeight;
        switch (orientation) {
            case LEFT_TO_RIGHT: return `0,${halfHeight} ${halfHeight},0 ${widthMinusHalfHeight},0 ${width},${halfHeight}, ${widthMinusHalfHeight},${height} ${halfHeight},${height}`;
            default: throw new Error(`ArrowBar.setPoints: Invalid orientation "${this.orientation}".`);
        }
    }
}

export class EqTriangle extends UIElement {// Can be a solid color only
    static WIDTH = 97;
    static HEIGHT = 84;
    static HEIGHT_MULTIPLIER = Math.sqrt(3) / 2;
    static WIDTH_MULTIPLIER = 1 / this.HEIGHT_MULTIPLIER;
    constructor(options) {
        super();
        const {orientation = UP, color, width=NaN, height=NaN, left=0, top=0} = options;
        this._originalWidth;
        this._originalHeight;
        this._heightMultiplier;
        this._widthMultiplier;
        this._width;
        this._height;
        this._scaleX = 1;
        this._scaleY = 1;
        this.draw(orientation, color);
        if (width && !height) this.setWidth(width, true);
        else if (!width && height) this.setHeight(height, true);
        else if (width && height) {
            this.setWidth(width, false);
            this.setHeight(height, false);
        } else this.setWidth(EqTriangle.WIDTH, true);
        UIElement.assignStyles(this, {
            left: `${left}px`,
            top: `${top}px`
        });
    }
    draw(orientation, color) {
        const halfWidth = EqTriangle.WIDTH / 2;
        UIElement.assignStyles(this, {
            transformOrigin: 'top left'
        });
        switch (orientation) {
            case RIGHT:
                this._originalWidth = this._width = EqTriangle.HEIGHT;
                this._originalHeight = this._height = EqTriangle.WIDTH;
                this._heightMultiplier = EqTriangle.WIDTH_MULTIPLIER;
                this._widthMultiplier = EqTriangle.HEIGHT_MULTIPLIER;
                UIElement.assignStyles(this, {
                    width: '0',
                    height: '0',
                    borderTop: `${halfWidth}px solid transparent`,
                    borderBottom: `${halfWidth}px solid transparent`,
                    borderLeft: `${EqTriangle.HEIGHT}px solid ${color}`
                });
                break;
            case LEFT:
                this._originalWidth = this._width = EqTriangle.HEIGHT;
                this._originalHeight = this._height = EqTriangle.WIDTH;
                this._heightMultiplier = EqTriangle.WIDTH_MULTIPLIER;
                this._widthMultiplier = EqTriangle.HEIGHT_MULTIPLIER;
                UIElement.assignStyles(this, {
                    width: '0',
                    height: '0',
                    borderTop: `${halfWidth}px solid transparent`,
                    borderBottom: `${halfWidth}px solid transparent`,
                    borderRight: `${EqTriangle.HEIGHT}px solid ${color}`
                });
                break;
            case DOWN:
                this._originalWidth = this._width = EqTriangle.WIDTH;
                this._originalHeight = this._height = EqTriangle.HEIGHT;
                this._heightMultiplier = EqTriangle.HEIGHT_MULTIPLIER;
                this._widthMultiplier = EqTriangle.WIDTH_MULTIPLIER;
                UIElement.assignStyles(this, {
                    width: '0',
                    height: '0',
                    borderLeft: `${halfWidth}px solid transparent`,
                    borderRight: `${halfWidth}px solid transparent`,
                    borderTop: `${EqTriangle.HEIGHT}px solid ${color}`
                });
                break;
            default: // Default to upward pointing triangle
                this._originalWidth = this._width = EqTriangle.WIDTH;
                this._originalHeight = this._height = EqTriangle.HEIGHT;
                this._heightMultiplier = EqTriangle.HEIGHT_MULTIPLIER;
                this._widthMultiplier = EqTriangle.WIDTH_MULTIPLIER;
                UIElement.assignStyles(this, {
                    width: '0',
                    height: '0',
                    borderLeft: `${halfWidth}px solid transparent`,
                    borderRight: `${halfWidth}px solid transparent`,
                    borderBottom: `${EqTriangle.HEIGHT}px solid ${color}`
                });
                break;
        }
    }
    getWidth() {return this._width;}
    setWidth(newWidth, keepAspectRatio=true) {
        if (isNaN(newWidth)) return;
        this._width = newWidth;
        this._scaleX = newWidth / this._originalWidth;
        if (keepAspectRatio) {
            this._height = newWidth * this._heightMultiplier;
            this._scaleY = this._scaleX;
        }
        UIElement.assignStyles(this, {transform: `scaleX(${this._scaleX}) scaleY(${this._scaleY})`});                
    }
    getHeight() {return this._height;}
    setHeight(newHeight, keepAspectRatio=true) {
        if (isNaN(newHeight)) return;
        this._height = newHeight;
        this._scaleY = newHeight / this._originalHeight;
        if (keepAspectRatio) {
            this._width = newHeight * this._widthMultiplier;
            this._scaleX = this._scaleY;
        }
        UIElement.assignStyles(this, {transform: `scaleX(${this._scaleX}) scaleY(${this._scaleY})`});  
    }
}

/*export class ArrowBar extends Rectangle {
    constructor(options) {
        const radians = degreesToRadians(45);
        const sine = Math.sin(radians);
        const cosine = Math.cos(radians);
        const {width, height, background, borderRadius=6, left=0, top=0} = options;
        const arrowSide = Math.abs(height * Math.cos(Math.PI / 4));
        const cornerDifference = (Math.sqrt(2 * Math.pow(borderRadius, 2)) - borderRadius);
        const leftVerticalOffset = cornerDifference;
        const sideAdjust = leftVerticalOffset * Math.sqrt(2);
        const adjustedArrowSide = arrowSide + sideAdjust;
        const leftHorizontalOffset = Math.sqrt(2 * Math.pow(adjustedArrowSide,2)) / 2 - cornerDifference;
        const leftDeltaX = cosine * -leftVerticalOffset + sine * leftHorizontalOffset;
        const leftDeltaY = sine * -leftVerticalOffset - cosine * leftHorizontalOffset;
        super({
            width: width-leftHorizontalOffset*2,
            height,
            background: background.replace(/to bottom right, /, ''),
            left: left+leftHorizontalOffset,
            top
        });
        const leftArrow = new Rectangle({
            width: adjustedArrowSide,
            height: adjustedArrowSide,
            borderRadius,
            background,
            left: -leftHorizontalOffset
        });
        leftArrow.assignStyles({
            transform: `rotate(45deg) translate(${leftDeltaX}px, ${leftDeltaY}px)`,
            transformOrigin: '0 0'
        });
        this.appendChild(leftArrow);
        const rightArrow = new Rectangle({
            width: adjustedArrowSide,
            height: adjustedArrowSide,
            borderRadius,
            background
        });
        const rightHorizontalOffset = width - leftHorizontalOffset*2;
        const rightVerticalOffset = leftVerticalOffset;
        const rightDeltaX = cosine * -rightVerticalOffset + sine * rightHorizontalOffset;
        const rightDeltaY = sine * -rightVerticalOffset - cosine * rightHorizontalOffset;
        rightArrow.assignStyles({
            transform: `rotate(45deg) translate(${rightDeltaX}px, ${rightDeltaY}px)`,
            transformOrigin: '0 0'
        });
        this.appendChild(rightArrow);
    }
}*/
