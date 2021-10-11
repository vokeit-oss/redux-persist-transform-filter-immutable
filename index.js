import { isCollection, Map } from 'immutable';
import forIn from 'lodash.forin';
import get from 'lodash.get';
import includes from 'lodash.includes';
import isEmpty from 'lodash.isempty';
import isObject from 'lodash.isobject';
import isString from 'lodash.isstring';
import isUndefined from 'lodash.isundefined';
import pickBy from 'lodash.pickby';
import set from 'lodash.set';
import unset from 'lodash.unset';


export function createTransform(dataToStorage, dataFromStorage, config = {}) {
    const whitelist = isObject(config) && Array.isArray(config.whitelist) ? config.whitelist : null;
    const blacklist = isObject(config) && Array.isArray(config.blacklist) ? config.blacklist : null;
    
    function whitelistBlacklistCheck(key) {
        return (whitelist && !includes(whitelist, key)) || (blacklist && !includes(blacklist, key));
    }
    
    function transformDataToStorage(state, key) {
        return !whitelistBlacklistCheck(key) && dataToStorage ? dataToStorage(state, key) : state;
    }
    
    function transformDataFromStorage(state, key) {
        return !whitelistBlacklistCheck(key) && dataFromStorage ? dataFromStorage(state, key) : state;
    }
    
    return {
        in:                       transformDataToStorage,
        out:                      transformDataFromStorage,
        transformDataToStorage:   transformDataToStorage,
        transformDataFromStorage: transformDataFromStorage
    }
}


export function createFilter(reducerName, inboundPaths, outboundPaths, transformType = 'whitelist') {
    transformType = includes(['whitelist', 'blacklist'], transformType) ? transformType : 'whitelist';
    
    return createTransform(
        (inboundState, key) => inboundPaths ? persistFilter(inboundState, inboundPaths, transformType) : inboundState,
        (outboundState, key) => outboundPaths ? persistFilter(outboundState, outboundPaths, transformType) : outboundState,
        {[transformType]: 'string' === typeof reducerName ?  [reducerName] : reducerName}
    );
};


export function createWhitelistFilter(reducerName, inboundPaths, outboundPaths) {
    return createFilter(reducerName, inboundPaths, outboundPaths, 'whitelist');
}


export function createBlacklistFilter(reducerName, inboundPaths, outboundPaths) {
    return createFilter(reducerName, inboundPaths, outboundPaths, 'blacklist');
}


function filterObject({path, filterFunction = () => true}, state, iterable) {
    const value = iterable ? state.getIn(path) : get(state, path);
    
    return (Array.isArray(value) || isCollection(value)) ? value.filter(filterFunction) : pickBy(value, filterFunction);
}


export function persistFilter(state, paths = [], transformType = 'whitelist') {
    if(!includes(['whitelist', 'blacklist'], transformType)) {
        return state;
    }
    
    const blacklist = ('blacklist' === transformType);
    const iterable  = isCollection(state);
    let subset      = iterable ? Map(blacklist ? state : {}) : (blacklist ? Object.assign({}, state) : {});
    paths           = isString(paths) ? [paths] : paths;
    
    if(!blacklist) {
        paths.forEach((path) => {
            if(isObject(path) && !Array.isArray(path)) {
                if(path.hasOwnProperty('path')) {
                    const value = filterObject(path, state, iterable);
                    
                    if(!isEmpty(value)) {
                        iterable ? (subset = subset.setIn(Array.isArray(path.path) ? path.path : [path.path], value)) : set(subset, path.path, value);
                    }
                }
            }
            else {
                const value = iterable ? state.getIn(Array.isArray(path) ? path : [path]) : get(state, path);
                
                if(!isUndefined(value)) {
                    iterable ? (subset = subset.setIn(Array.isArray(path) ? path : [path], value)) : set(subset, path, value);
                }
            }
        });
    }
    else {
        paths.forEach((path) => {
            if(isObject(path) && !Array.isArray(path)) {
                if(path.hasOwnProperty('path')) {
                    const value = filterObject(path, state, iterable);
                    
                    if(!isEmpty(value)) {
                        if(Array.isArray(value)) {
                            iterable ?
                                (subset = subset.setIn(Array.isArray(path.path) ? path.path : [path.path], subset.getIn(Array.isArray(path.path) ? path.path : [path.path]).filter((x) => false)))
                                :
                                set(subset, path.path, get(subset, path.path).filter((x) => false));
                        }
                        else {
                            forIn(value, (value, key) => {
                                iterable ? (subset = subset.deleteIn([path.path, key])) : unset(subset, `${path.path}[${key}]`);
                            });
                        }
                    }
                }
            }
            else {
                const value = iterable ? state.getIn(Array.isArray(path) ? path : [path]) : get(state, path);
                
                if(!isUndefined(value)) {
                    iterable ? (subset = subset.deleteIn(Array.isArray(path) ? path : [path])) : unset(subset, path);
                }
            }
        });
    }
    
    return subset;
}


export default createFilter;
