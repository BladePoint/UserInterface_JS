import { UIElement } from './UIElement.js';

export class TextField extends UIElement {
    constructor(options) {
        super();
        const {
            text = '',
            width = 'auto',
            height = 'auto',
            fontFamily = 'Arial, sans-serif',
            fontWeight = 'normal', // 'bold' , 'bolder', 'lighter'
            fontSize = '16px',
            color = '#000000',
            textAlign = 'left', // 'center', 'right', 'justify'
            whiteSpace = 'nowrap', // 'normal'
            left = '',
            right = '',
            top = '',
            bottom = ''
        } = options;
        this.assignStyles({
            width,
            height,
            fontFamily,
            fontWeight,
            fontSize,
            color,
            textAlign,
            whiteSpace,
            left,
            right,
            top,
            bottom,
            userSelect: 'none',
            overflow: 'hidden'
            //, lineHeight,
            //letterSpacing,
            //,border: '2px solid red',
            //boxSizing: 'border-box'
        });
        this.text = text;
    }
    set text(newText) {this._element.innerText = newText;}
    get text() {return this._element.innerText;}
}