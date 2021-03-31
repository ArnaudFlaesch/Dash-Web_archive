import { WidgetTypes } from '../enums/WidgetsEnum';

export interface IWidgetConfig {
  id: number;
  type: WidgetTypes;
  data: any;
  widgetOrder: number;
  tab: {
    id: number;
  };
}
