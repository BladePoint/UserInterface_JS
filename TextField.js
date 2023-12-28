import { UIElement } from './UIElement.js';
import { BORDER_BOX } from '../Utilities_JS/constants.js';

export class TextField extends UIElement {
    static AUTO = 'auto';
    static BREAK_WORD = 'break-word';
    static NORMAL = 'normal';
    constructor(options) {
        super();
        const {
            text = '',
            width = TextField.AUTO,
            height = TextField.AUTO,
            fontFamily = 'Arial, sans-serif',
            fontWeight = TextField.NORMAL, // 'bold' , 'bolder', 'lighter'
            fontStyle = TextField.NORMAL, // 'normal', 'italic', 'oblique', 'inherit'
            fontSize = '16px',
            color = '#000000',
            textShadow = 'none',
            textAlign = 'left', // 'center', 'right', 'justify'
            whiteSpace = 'nowrap', // 'normal'
            left = '',
            right = '',
            top = '',
            bottom = '',
            transform = 'none'
        } = options;
        this.assignStyles({
            width,
            height,
            fontFamily,
            fontWeight,
            fontStyle,
            fontSize,
            color,
            textShadow,
            textAlign,
            whiteSpace,
            left,
            right,
            top,
            bottom,
            transform,
            userSelect: 'none',
            overflow: 'hidden'
            //, lineHeight,
            //letterSpacing,
            //,border: '2px dotted red'
            //,boxSizing: BORDER_BOX
        });
        if (text !== '') this.text = text;
    }
    set text(newText) {this._element.innerText = newText;}
    get text() {return this._element.innerText;}
    set htmlText(newText) {this._element.innerHTML = newText;}
    get htmlText() {return this._element.innerHTML;}
}