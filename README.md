# redux-persist-transform-filter-immutable

Filter transformator for redux-persist supporting immutable.js

## Installation [WIP - not published to NPM yet :-(]
```
  npm install redux-persist-transform-filter
```

## Usage

```js
import createFilter from 'redux-persist-transform-filter-immutable';

// you want to store only a subset of your state of reducer one
const saveSubsetFilter = createFilter(
  'myReducerOne',
  ['keyYouWantToSave1', 'keyYouWantToSave2']
);

// you want to load only a subset of your state of reducer two
const loadSubsetFilter = createFilter(
  'myReducerTwo',
  null,
  ['keyYouWantToLoad1', 'keyYouWantToLoad2']
);

// saving a subset and loading a different subset is possible
// but doesn't make much sense because you'd load an empty state
const saveAndloadSubsetFilter = createFilter(
  'myReducerThree',
  ['one', 'two']
  ['three', 'four']
);

persistStore(store, {
  transforms: [
    saveSubsetFilter,
    loadSubsetFilter,
    saveAndloadSubsetFilter,
  ]
});
```

## Thanks

Thanks to Eduard Baun for redux-persist-transform-filter [https://github.com/edy/redux-persist-transform-filter] - on which this implementation is based.
