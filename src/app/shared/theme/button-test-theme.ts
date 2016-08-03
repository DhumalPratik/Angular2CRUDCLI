import { TypedJSON, JsonObject, JsonMember } from '../typed-json';

export class ButtonTestTheme {
    static classes = {
        button: 'btn',
        link: 'btn-link',
        primary: 'btn-primary',
        secondary: 'btn-secondary'
    }

    static options: any;
    static styles: any;

    // deserialize(input) {
    //     return TypedJSON.parse(JSON.stringify(input), ButtonTestTheme);
    // }

    static toJSON() {
        let returnObj: any = {};
        Object.keys(this).forEach(key => {
            if (this[key])
                returnObj[key] = this[key];
        });
        return returnObj;
    }
}
export enum ActionTypes {
    'default',
    'primary',
    'secondary',
    'link'
}

export enum ButtonTypes {
    'button',
    'reset',
    'submit'
}

