import { Iterable, Map } from 'immutable';
import { createTransform } from 'redux-persist';
import get from 'lodash.get';
import set from 'lodash.set';
import isString from 'lodash.isString';
import isUndefined from 'lodash.isUndefined';


export default function createFilter(reducerName, inboundPaths, outboundPaths) {
    return createTransform(
        (inboundState, key) => inboundPaths ? persistFilter(inboundState, inboundPaths) : inboundState,
        (outboundState, key) => outboundPaths ? persistFilter(outboundState, outboundPaths) : outboundState,
        {whitelist: [reducerName]}
    );
};


export function persistFilter(state, paths = []) {
    let iterable = Iterable.isIterable(state);
    let subset   = iterable ? Map({}) : {};
    
    (isString(paths) ? [paths] : paths).forEach((path) => {
        let key   = isString(path) ? [path] : path;
        let value = iterable ? state.getIn(key) : get(state, key);
        
        if(!isUndefined(value)) {
            iterable ? (subset = subset.setIn(key, value)) : set(subset, key, value);
        }
    });

    return subset;
}