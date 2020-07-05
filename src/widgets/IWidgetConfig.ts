import { WidgetTypes } from '../enums/WidgetsEnum';

export interface IWidgetConfig {
    id: number;
    type: WidgetTypes;
    data: any;
    tab : {
        id : number;
    }
}