import { WidgetTypes } from '../enums/WidgetsEnum';

export interface IWidgetConfig {
  id: number;
  type: WidgetTypes;
  data: unknown;
  widgetOrder: number;
  tab: {
    id: number;
  };
}
