declare module "@actra-development-oss/redux-persist-transform-filter-immutable" {
    import { Transform } from "redux-persist";
    
    
    type TransformType = 'whitelist' | 'blacklist';
    
    
    export function createFilter<State, Raw>(reducerName: string | string[], inboundPaths?: string[], outboundPaths?: string[], transformType?: TransformType): Transform<State, Raw>;
    export function createWhitelistFilter<State, Raw>(reducerName: string | string, inboundPaths?: string[], outboundPaths?: string[]): Transform<State, Raw>;
    export function createBlacklistFilter<State, Raw>(reducerName: string | string, inboundPaths?: string[], outboundPaths?: string[]): Transform<State, Raw>;
    export function persistFilter<State, Raw>(state: State, paths: string[], transformType: TransformType): Transform<State, Raw>;
    
    
    export default createFilter;
}
