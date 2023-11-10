import { UIElement } from './UIElement.js';
import { degreesToRadians } from '../Utilities_JS/mathUtils.js';
import { UP, DOWN, LEFT, RIGHT, LEFT_TO_RIGHT, RIGHT_TO_LEFT, TOP_TO_BOTTOM, BOTTOM_TO_TOP } from '../Utilities_JS/constants.js';
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
        const { width, height, background, borderRadius=0, left=0, top=0 } = options;
        this.assignStyles({
            width,
            height,
            borderRadius,
            background,
            left,
            top
        });
    }
}

export class Circle extends UIElement {
    constructor(options) {
        super();
        const { width, height, background, left = 0, top = 0 } = options;
        this.assignStyles({
            width: width,
            height: height,
            borderRadius: '50%',
            background,
            left,
            top
        });
    }
}

export class SemicircleBar extends UIElement {
    constructor(options) {
        super();
        const { width, height, background, left=0, top=0 } = options;
        this.assignStyles({
            width,
            height,
            background,
            borderRadius: height / 2,
            left,
            top
        });
    }
}

export class AcuteTriangle extends UIElement {
    constructor(options) {
        super(UIElement.SVG);
        const { orientation = AcuteTriangle.UP, width, height } = options;
        this.width = width;
        this.height = height;
        this.polygon = this.drawPolygon(orientation, width, height);
        this.appendChild(this.polygon);
        this.assignAttributes({
            width,
            height,
        });
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
                points = `${width},0 0,${height/2} ${width},${height}`;
                break;
            case RIGHT:
                points = `0,0 ${width},${height/2} 0,${height}`;
                break;
            default:
                throw new Error(`Invalid AcuteTriangle orientation "${this.orientation}".`);
        }
        polygon.setAttribute('points', points);
        return polygon;
    }
    colorPolygon(color) {
        const existingGradients = this._element.querySelectorAll('linearGradient');
        existingGradients.forEach((existingGradient) => {
            this.removeChild(existingGradient);
        });
        let fillValue;
        if (color instanceof SVGElement) {
            this.appendChild(color);
            fillValue = `url(#${color.id})`;
        } else if (typeof color === 'string') fillValue = color;
        else throw new Error('AcuteTriangle.colorPolygon: Invalid color.');
        this.polygon.setAttribute("fill", fillValue);
    }
    /*parseStateOptions(options) {
        this.colorPolygon(options.color);
        this.element.setAttribute('transform', `translate(${options.left}, ${options.top})`);
    }*/
}

export class EqTriangle extends UIElement {// Can be a solid color only
    static WIDTH = 97;
    static HEIGHT = 84;
    static HEIGHT_MULTIPLIER = Math.sqrt(3) / 2;
    static WIDTH_MULTIPLIER = 1 / this.HEIGHT_MULTIPLIER;
    constructor(options) {
        super();
        const { orientation = UP, color, width=NaN, height=NaN, left=0, top=0 } = options;
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
