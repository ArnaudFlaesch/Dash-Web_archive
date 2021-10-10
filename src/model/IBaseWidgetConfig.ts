export default interface IBaseWidgetConfig {
  id: number;
  tabId: number;
  onDeleteButtonClicked: (idWidget: number) => void;
}
