export default interface ITab {
    title : string;
    path : string;
    exact? : boolean;
    component : React.ComponentType;
}