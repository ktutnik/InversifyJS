import interfaces from "../interfaces/interfaces";
import * as METADATA_KEY from "../constants/metadata_keys";

let traverseAncerstors = (
    request: interfaces.Request,
    constraint: (request: interfaces.Request) => boolean
): boolean => {

    let parent = request.parentRequest;
    if (parent !== null) {
        return constraint(parent) ? true : traverseAncerstors(parent, constraint);
    } else {
        return false;
    }
};

// This helpers use currying to help you to generate constraints

let taggedConstraint = (key: string) => (value: any) => (request: interfaces.Request) => {
    return request.target.matchesTag(key)(value);
};

let namedConstraint = taggedConstraint(METADATA_KEY.NAMED_TAG);

let typeConstraint = (type: (Function|string)) => (request: interfaces.Request) => {

    // Using index 0 because constraints are applied 
    // to one binding at a time (see Planner class)
    let binding = request.bindings[0];

    if (typeof type === "string") {
        let serviceIdentifier = binding.serviceIdentifier;
        return serviceIdentifier === type;
    } else {
        let constructor = request.bindings[0].implementationType;
        return type === constructor;
    }
};

export { traverseAncerstors, taggedConstraint, namedConstraint, typeConstraint };
