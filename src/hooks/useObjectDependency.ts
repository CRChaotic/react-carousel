import { useRef } from "react";


function compare(valueA:any, valueB:any) {

    if(
        typeof valueA === "object" && typeof valueB === "object" && 
        valueA !== null && valueB !== null &&
        Object.getPrototypeOf(valueA) === Object.getPrototypeOf(valueB) &&
        (Object.getPrototypeOf(valueA) === Array.prototype || Object.getPrototypeOf(valueA) === Object.prototype) &&
        Object.keys(valueA).length === Object.keys(valueB).length
    ){

        for(let key of Object.keys(valueA)){
            if(!compare(valueA[key], valueB[key])){
                return false;
            }
        }

        return true;
    }

    return valueA === valueB;
}


function useObjectDependency<T>(objectDependency:T):T{

    const dependecyRef = useRef(objectDependency);

    if(!compare(dependecyRef.current, objectDependency)){
        dependecyRef.current = objectDependency;
    }

    return dependecyRef.current;
}

export { compare };
export default useObjectDependency;

