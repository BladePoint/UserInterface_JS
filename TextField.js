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
        UIElement.assignStyles(this, {
            width: UIElement.parsePxArgument(width),
            height: UIElement.parsePxArgument(height),
            fontFamily,
            fontWeight,
            fontSize: UIElement.parsePxArgument(fontSize),
            color,
            textAlign,
            whiteSpace,
            left: UIElement.parsePxArgument(left),
            right: UIElement.parsePxArgument(right),
            top: UIElement.parsePxArgument(top),
            bottom: UIElement.parsePxArgument(bottom),
            userSelect : 'none',
            overflow: 'hidden'
            /*lineHeight,
            letterSpacing,
            border: '2px solid red',
            //boxSizing: 'border-box'*/
        });
        this.text = text;
    }
    /**
     * @param {string} newText
     */
    set text(newText) {
        this.element.innerText = newText;
    }
}