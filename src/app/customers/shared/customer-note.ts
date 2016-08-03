import {TypedJSON, JsonObject, JsonMember} from '../../shared/typed-json';

@JsonObject
export class CustomerNote {
    @JsonMember
    CustomerId: number;
    @JsonMember
    AlignmentId: number;
    @JsonMember
    EmployeeId: number;
    @JsonMember
    EventId: number;
    @JsonMember
    ProductId: number;
    @JsonMember
    NoteText: string;
    @JsonMember
    NoteDate: Date;
    @JsonMember
    NoteType: string;
    @JsonMember
    NoteDescription: string;
    @JsonMember
    Shared: string;
    @JsonMember
    Status: string;
    @JsonMember
    StatusChangeDate: Date;
    @JsonMember
    NoteId: number;
    @JsonMember
    CreateDate: Date;
    @JsonMember
    DueDate: Date;
    @JsonMember
    IsModified : boolean;

    deserialize(input) {
        return TypedJSON.parse(JSON.stringify(input), CustomerNote);
    }

    toJSON() {
        let returnObj = {};
        Object.keys(this).forEach(key => {
            returnObj[key] = this[key];
        });
        // console.log(returnObj);
        return returnObj;
    }

    constructor() {
    }
}


