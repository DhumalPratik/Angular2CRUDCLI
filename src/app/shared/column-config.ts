export class ColumnConfig {
    ColumnName: string;
    IsClickable: boolean;
    ClassName: string = "";
    HeaderClassName: string = "";
    DisplayName: string = "";
    Callback: Object;
    HasButton: boolean;

    constructor(obj: Object) {
        if (obj['ColumnName']) {
            this.ClassName = obj['ClassName'] || "";
            this.HeaderClassName = obj['HeaderClassName'] || "";
            this.ColumnName = obj['ColumnName'] || "";
            this.IsClickable = obj['IsClickable'] || false;
            this.HasButton = obj['HasButton'] || false;
            this.DisplayName = obj['DisplayName'] || "";
            this.Callback = obj['Callback'];
        }
    }

}
