import { Iterable, Map } from 'immutable';
import { createTransform } from 'redux-persist';
import get from 'lodash.get';
import set from 'lodash.set';
import isString from 'lodash.isString';
import isUndefined from 'lodash.isUndefined';


export type returnType = Map<string, any> | {[key: string]: any};


export default (reducerName: string, inboundPaths: string | string[], outboundPaths: string | string[]) => {
    return createTransform(
        (inboundState: any, key: string) => inboundPaths ? persistFilter(inboundState, inboundPaths) : inboundState,
        (outboundState: any, key: string) => outboundPaths ? persistFilter(outboundState, outboundPaths) : outboundState,
        {whitelist: [reducerName]}
    );
};


export function persistFilter(state: any, paths: string | string[] | string[][] = []): returnType {
    let iterable: boolean  = Iterable.isIterable(state);
    let subset: returnType = iterable ? Map<string, any>({}) : {};
    
    (isString(paths) ? [paths] : <Array<string>>paths).forEach((path: string | string[]) => {
        let key: string[] = isString(path) ? <Array<string>>[path] : <Array<string>>path;
        let value: any    = iterable ? state.getIn(key) : get(state, key);
        
        if(!isUndefined(value)) {
            iterable ? (subset = (<Map<string, any>>subset).setIn(key, value)) : set(subset, key, value);
        }
    });

    return subset;
}