import { UIElement, UIButton } from './UIElement.js';
import { Rectangle } from './Primitives.js';
import { Circle } from './Primitives.js';
import { SemicircleBar } from './Primitives.js';
import { clamp } from '../Utilities_JS/mathUtils.js';

const GLASS_LIGHT_HEX = '#eaebdc';
export class ShadedRect extends UIElement {
    constructor(options) {
        super();
        const {
            width, height,
            lightHex = '#ffffff', darkHex = '#666666',
            topGradientHex = '#eeeeee', bottomGradientHex = '#999999'
        } = options;
        const dark = new Rectangle({
            width,
            height,
            borderRadius: 6,
            background: darkHex
        });
        const light = new Rectangle({
            width: width - 2,
            height: height - 2,
            borderRadius: 5,
            background: `linear-gradient(${lightHex}, ${darkHex})`,
            top: 1,
            left: 1
        });
        const gradient = new Rectangle({
            width: width - 2,
            height: height - 3,
            borderRadius: 5,
            background: `linear-gradient(${topGradientHex}, ${bottomGradientHex})`,
            top: 2,
            left: 1
        });
        this.appendChild(dark);
        this.appendChild(light);
        this.appendChild(gradient);
    }
}

export class RectButton extends UIElement {
    constructor(options) {
        super();
        const {
            width, height,
            rimHex = '#ffffff',
            bottomGradientHex = '#b0b0b0',
            left = 0, top = 0
        } = options;
        const rim = new Rectangle({
            width,
            height,
            borderRadius: 6,
            background: rimHex,
            top: 1
        });
        const shadedRect = new ShadedRect({
            width,
            height,
            bottomGradientHex
        });
        this.appendChild(rim);
        this.appendChild(shadedRect);
        UIElement.assignStyles(this, {
            left: UIElement.parsePxArgument(left),
            top: UIElement.parsePxArgument(top)
        });
    }
}

class iButton extends UIButton {
    constructor(pointerElement, upFunction=null) {
        super();
        this.pointerElement = pointerElement;
        this.addMouseListeners(pointerElement);
        this.upFunction = upFunction;
    }
    enable() {this.pointerElement.enable();}
    disable() {this.pointerElement.disable();}
    onDown = (evt) => {
        super.onDown(evt);
        this.downState();
    }
    onLeave = (evt) => {
        super.onLeave(evt);
        this.upState();
    }
    onUp = (evt) => {
        if (this.isMouseDown) {
            console.log('up');
            if (this.upFunction) this.upFunction();
        }
        super.onUp(evt);
        this.upState();
    }
    upState() {}
    downState() {}
}
export class ShadedCircle extends iButton {
    constructor(options) {
        const {
            upFunction,
            diameter,
            darkHex = '#333333', lightHex = '#ffffff',
            bottomGradientHex = '#999999'
        } = options;
        const dark = new Circle({
            diameter,
            background: darkHex
        });
        super(dark, upFunction);
        this.upGradient = `linear-gradient(${lightHex}, ${bottomGradientHex})`;
        this.downGradient = `linear-gradient(${bottomGradientHex}, ${lightHex})`;
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
        super({ diameter });
        const rim = new Circle({
            diameter,
            background: rimHex,
            top: 1
        });
        this.prependChild(rim);
        UIElement.assignStyles(this, {
            left: UIElement.parsePxArgument(left),
            top: UIElement.parsePxArgument(top)
        });
    }
}

export class GlassPanel extends UIElement {
    constructor(options) {
        super();
        const {width, height, colorHex, left=0, top=0} = options;
        let lightHex, darkHex;
        switch (colorHex) {
            case 'purple':
                lightHex = '#8585ae';
                darkHex = '#7779a0';
                break;
            default:
                lightHex = GLASS_LIGHT_HEX;
                darkHex = '#cfd2c1';
                break;
        }
        const rim = new Rectangle({
            width,
            height,
            borderRadius: 4,
            background: '#ffffff',
            top: 1
        });
        const dark = new Rectangle({
            width,
            height,
            borderRadius: 4,
            background: '#666666'
        });
        const shadow = new Rectangle({
            width: width - 2,
            height: height - 2,
            borderRadius: 3,
            background: darkHex,
            top: 1,
            left: 1
        });
        const light = new Rectangle({
            width: width - 4,
            height: height - 3,
            borderRadius: 2,
            background: lightHex,
            top: 2,
            left: 2
        });
        const gradientHeight = height * 0.45;
        const gradient = new Rectangle({
            width: width - 4,
            height: gradientHeight,
            borderRadius: '0px 0px 4px 4px',
            background: `linear-gradient(${darkHex}, ${lightHex})`,
            top: height - gradientHeight - 1,
            left: 2
        });
        this.appendChild(rim);
        this.appendChild(dark);
        this.appendChild(shadow);
        this.appendChild(light);
        this.appendChild(gradient);
        UIElement.assignStyles(this, {
            left: `${left}px`,
            top: `${top}px`
        });
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
        this.setProgress(0);
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
export class DoubleProgressSlider extends UIElement {
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