import { UIElement } from './UIElement.js';

const GLASS_LIGHT_HEX = '#eaebdc';
export class ShadedRect extends UIElement {
    constructor(options) {
        super();
        const {
            width, height,
            lightHex = '#ffffff', darkHex = '#666666',
            topGradientHex = '#eeeeee', bottomGradientHex = '#999999'
        } = options;
        const dark = document.createElement('div');
        this.applyStyles(dark, {
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: '6px',
            backgroundColor: darkHex
        });
        const light = document.createElement('div');
        this.applyStyles(light, {
            width: `${width - 2}px`,
            height: `${height - 2}px`,
            borderRadius: '5px',
            background: `linear-gradient(${lightHex}, ${darkHex})`,
            position: 'absolute',
            top: '1px', left: '1px'
        });
        const gradient = document.createElement('div');
        this.applyStyles(gradient, {
            width: `${width - 2}px`,
            height: `${height - 3}px`,
            borderRadius: '5px',
            background: `linear-gradient(${topGradientHex}, ${bottomGradientHex})`,
            position: 'absolute',
            top: '2px', left: '1px'
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
            bottomGradientHex = '#b0b0b0'
        } = options;
        const rim = document.createElement('div');
        this.applyStyles(rim, {
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: '6px',
            backgroundColor: rimHex,
            position: 'absolute',
            top: '1px',
            pointerEvents: 'none'
        });
        const shadedRect = new ShadedRect({
            width,
            height,
            bottomGradientHex
        });
        this.applyStyles(shadedRect, {
            position: 'absolute',
            top: '0px'
        });
        this.appendChild(rim);
        this.appendChild(shadedRect);
    }
}

export class ShadedCircle extends UIElement {
    constructor(options) {
        super();
        const {
            diameter,
            darkHex = '#333333', lightHex = '#ffffff',
            bottomGradientHex = '#999999'
        } = options;
        const dark = document.createElement('div');
        this.applyStyles(dark, {
            width: `${diameter}px`,
            height: `${diameter}px`,
            borderRadius: '50%',
            backgroundColor: darkHex,
            position: 'absolute'
        });
        const light = document.createElement('div');
        this.applyStyles(light, {
            width: `${diameter - 2}px`,
            height: `${diameter - 2}px`,
            borderRadius: '50%',
            backgroundColor: lightHex,
            position: 'absolute',
            top: '1px',
            left: '1px'
        });
        const gradient = document.createElement('div');
        this.applyStyles(gradient, {
            width: `${diameter - 2}px`,
            height: `${diameter - 3}px`,
            borderRadius: '50%',
            background: `linear-gradient(${lightHex}, ${bottomGradientHex})`,
            position: 'absolute',
            top: '2px',
            left: '1px'
        });
        this.appendChild(dark);
        this.appendChild(light);
        this.appendChild(gradient);
    }
}

export class CircleButton extends UIElement {
    constructor(options) {
        super();
        const {
            diameter,
            rimHex = '#cccccc'
        } = options;
        const rim = document.createElement('div');
        this.applyStyles(rim, {
            width: `${diameter}px`,
            height: `${diameter}px`,
            backgroundColor: rimHex,
            borderRadius: '50%',
            position: 'absolute',
            top: '1px',
            pointerEvents: 'none'
        });
        const shadedCircle = new ShadedCircle({ diameter });
        this.applyStyles(shadedCircle, {
            position: 'absolute',
            top: '0px'
        });
        this.appendChild(rim);
        this.appendChild(shadedCircle);
    }
}

export class GlassPanel extends UIElement {
    constructor(options) {
        super();
        const {
            width, height,
            color
        } = options;
        let lightHex, darkHex;
        switch (color) {
            case 'purple':
                lightHex = '#8585ae';
                darkHex = '#7779a0';
                break;
            default:
                lightHex = GLASS_LIGHT_HEX;
                darkHex = '#cfd2c1';
                break;
        }
        const rim = document.createElement('div');
        this.applyStyles(rim, {
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: '4px',
            backgroundColor: '#ffffff',
            position: 'absolute',
            top: '1px',
            pointerEvents: 'none'
        });
        const dark = document.createElement('div');
        this.applyStyles(dark, {
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: '4px',
            backgroundColor: '#666666',
            position: 'absolute',
            top: '0px',
        });
        const shadow = document.createElement('div');
        this.applyStyles(shadow, {
            width: `${width - 2}px`,
            height: `${height - 2}px`,
            borderRadius: '3px',
            background: darkHex,
            position: 'absolute',
            top: '1px',
            left: '1px'
        });
        const light = document.createElement('div');
        this.applyStyles(light, {
            width: `${width - 4}px`,
            height: `${height - 3}px`,
            borderRadius: '2px',
            background: lightHex,
            position: 'absolute',
            top: '2px',
            left: '2px'
        });
        const gradient = document.createElement('div');
        const gradientHeight = height * 0.45;
        this.applyStyles(gradient, {
            width: `${width - 4}px`,
            height: `${gradientHeight}px`,
            borderRadius: '0px 0px 4px 4px',
            background: `linear-gradient(${darkHex}, ${lightHex})`,
            position: 'absolute',
            top: `${height - gradientHeight - 1}px`,
            left: '2px'
        });
        this.appendChild(rim);
        this.appendChild(dark);
        this.appendChild(shadow);
        this.appendChild(light);
        this.appendChild(gradient);
    }
}

export class CapsuleBar extends UIElement {
    constructor(options) {
        super();
        const {
            height,
            width,
            color,
            leftCapInvisible,
            rightCapInvisible
        } = options;
        const capDiameter = height;
        const capRadius = height / 2;
        const trackWidth = width - capDiameter;
        const leftCap = document.createElement('div');
        const rightCap = document.createElement('div');
        const track = document.createElement('div');
        this.applyStyles(leftCap, {
            width: `${capDiameter}px`,
            height: `${capDiameter}px`,
            borderRadius: '50%',
            backgroundColor: color,
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        this.applyStyles(rightCap, {
            width: `${capDiameter}px`,
            height: `${capDiameter}px`,
            borderRadius: '50%',
            backgroundColor: color,
            position: 'absolute',
            top: '0px',
            left: `${trackWidth}px`
        });
        this.applyStyles(track, {
            width: `${trackWidth}px`,
            height: `${capDiameter}px`,
            backgroundColor: color,
            position: 'absolute',
            top: '0px',
            left: `${capRadius}px`
        });
        if (!options.leftCapInvisible) this.appendChild(leftCap);
        if (!options.rightCapInvisible) this.appendChild(rightCap);
        this.appendChild(track);
    }
}

export class SliderBar extends UIElement {
    constructor(options) {
        super();
        const {
            width, height
        } = options;
        const rimOptions = { width, height, color: '#bbbbbb' };
        const darkOptions = { width, height, color: '#333333' };
        const lightOptions = { width: width - 2, height: height - 2, color: GLASS_LIGHT_HEX, leftCapInvisible: true };
        const mediumOptions = { width: width - 2, height: height - 2, color: '#666666', rightCapInvisible: true };
        const rim = new CapsuleBar(rimOptions);
        this.applyStyles(rim, {
            position: 'absolute',
            top: '1px',
            left: '0px'
        });
        const dark = new CapsuleBar(darkOptions);
        this.applyStyles(dark, {
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        const light = new CapsuleBar(lightOptions);
        this.applyStyles(light, {
            position: 'absolute',
            top: '1px',
            left: '1px'
        });
        const medium = new CapsuleBar(mediumOptions);
        this.applyStyles(medium, {
            position: 'absolute',
            top: '1px',
            left: '1px'
        });
        const handle = document.createElement('div');
        this.applyStyles(handle, {
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
        this.appendChild(light);
        this.appendChild(medium);
        this.appendChild(handle);
    }
}