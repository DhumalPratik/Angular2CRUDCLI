import { TypedJSON, JsonObject, JsonMember } from '../../shared/typed-json';
import { CustomerNote } from './customer-note';

// function test(a){
// }
// @test
@JsonObject
export class Customer {
    @JsonMember
    CustomerType: string;
    @JsonMember
    CustomerSubType: string;
    @JsonMember
    Surname: string;
    @JsonMember
    FirstName: string;
    @JsonMember
    MiddleName: string;
    @JsonMember
    SuffixName: string;
    @JsonMember
    SalutationName: string;
    @JsonMember
    ExternalId1: string;
    @JsonMember
    ExternalId2: string;
    @JsonMember
    ExternalId3: string;
    @JsonMember
    ExternalId4: string;
    @JsonMember
    ExternalId5: string;
    @JsonMember
    Status: string;
    @JsonMember({ elements: CustomerNote })
    Notes: CustomerNote[];
    @JsonMember
    StatusChangeDate: string;
    @JsonMember
    VcDisplayName: string;
    @JsonMember
    CustomerId: number;

    deserialize(input) {
        //console.log(input);
        return TypedJSON.parse(JSON.stringify(input), Customer);
    }

    toJSON() {
        let returnObj : any = {};
        Object.keys(this).forEach(key => {
            if (this[key])
                returnObj[key] = this[key];
        });
        // console.log(returnObj);
        return returnObj;
    }

    setNotes(notes: CustomerNote[]) {
        this.Notes = notes;
        // return this;
    }

    constructor() {
    }
}


