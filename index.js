import { Iterable, Map } from 'immutable';
import { createTransform } from 'redux-persist';
import get from 'lodash.get';
import includes from 'lodash.includes';
import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import isUndefined from 'lodash.isundefined';
import set from 'lodash.set';
import unset from 'lodash.unset';


export function createFilter(reducerName, inboundPaths, outboundPaths, transformType = 'whitelist') {
    transformType = includes(['whitelist', 'blacklist'], transformType) ? transformType : 'whitelist';
    
    return createTransform(
        (inboundState, key) => inboundPaths ? persistFilter(inboundState, inboundPaths, transformType) : inboundState,
        (outboundState, key) => outboundPaths ? persistFilter(outboundState, outboundPaths, transformType) : outboundState,
        {whitelist: [reducerName]}
    );
};


export function createWhitelistFilter(reducerName, inboundPaths, outboundPaths) {
    return createFilter(reducerName, inboundPaths, outboundPaths, 'whitelist');
}


export function createBlacklistFilter(reducerName, inboundPaths, outboundPaths) {
    return createFilter(reducerName, inboundPaths, outboundPaths, 'blacklist');
}


function filterObject({path, filterFunction = () => true}, state) {
    let value = get(state, path);
    
    return Array.isArray(value) ? value.filter(filterFunction) : pickBy(value, filterFunction);
}


export function persistFilter(state, paths = [], transformType = 'whitelist') {
    if(!includes(['whitelist', 'blacklist'], transformType)) {
        return state;
    }
    
    let blacklist = ('blacklist' === transformType);
    let iterable  = Iterable.isIterable(state);
    let subset    = iterable ? Map(blacklist ? state : {}) : (blacklist ? state : {});
    
    (isString(paths) ? [paths] : paths).forEach((path) => {
        let key         = isString(path) ? [path] : path;
        let keyIsObject = (isObject(key) && !Array.isArray(key) && key.hasOwnProperty('path'));
        let value       = iterable ? state.getIn(key) : (keyIsObject ? filterObject(key, state) : get(state, key));
        
        if(!isUndefined(value)) {
            iterable ?
                (subset = blacklist ? subset.deleteIn(key) : subset.setIn(key, value))
                :
                (blacklist ?
                    (keyIsObject ?
                        (Array.isArray(value) ?
                            set(subset, key.path, get(subset, key.path).filter((x) => false))
                            :
                            forIn(value, (iterateeValue, iterateeKey) => { unset(subset, `${key.path}.${iterateeKey}`) })
                        )
                        :
                        unset(subset, path)
                    )
                    :
                    set(subset, keyIsObject ? key.path : key, value)
                );
        }
    });

    return subset;
}


export default createFilter;