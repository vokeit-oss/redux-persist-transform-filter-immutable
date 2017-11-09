# redux-persist-transform-filter-immutable

[![npm](https://img.shields.io/npm/v/@actra-development-oss/redux-persist-transform-filter-immutable.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/redux-persist-transform-filter-immutable)
[![Build Status](https://travis-ci.org/actra-development-oss/redux-persist-transform-filter-immutable.svg?branch=master)](https://travis-ci.org/actra-development-oss/redux-persist-transform-filter-immutable)

Filter transformator for redux-persist supporting immutable.js

## Installation
```
  npm install @actra-development-oss/redux-persist-transform-filter-immutable
```

## Usage

```js
import { createFilter, createBlacklistFilter } from 'redux-persist-transform-filter-immutable';

// this works too:
import createFilter, { createBlacklistFilter } from 'redux-persist-transform-filter-immutable';

// you want to store only a subset of your state of reducer one
const saveSubsetFilter = createFilter(
    'myReducerOne',
    ['keyYouWantToSave1', 'keyYouWantToSave2']
);

// you want to remove some keys before you save
const saveSubsetBlacklistFilter = createBlacklistFilter(
    'myReducerTwo',
    ['keyYouDontWantToSave1', 'keyYouDontWantToSave2']
);

// you want to load only a subset of your state of reducer two
const loadSubsetFilter = createFilter(
    'myReducerThree',
    null,
    ['keyYouWantToLoad1', 'keyYouWantToLoad2']
);

// saving a subset and loading a different subset is possible
// but doesn't make much sense because you'd load an empty state
const saveAndloadSubsetFilter = createFilter(
    'myReducerFour',
    ['one', 'two']
    ['three', 'four']
);

persistStore(store, {
    transforms: [
        saveSubsetFilter,
        saveSubsetBlacklistFilter,
        loadSubsetFilter,
        saveAndloadSubsetFilter,
    ]
});
```

## Thanks

Thanks to Eduard Baun for [redux-persist-transform-filter](https://github.com/edy/redux-persist-transform-filter) - on which this implementation is based.
Thanks to Zack Story for [redux-persist](https://github.com/rt2zz/redux-persist) from which I took createTransform().
