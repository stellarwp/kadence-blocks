Memize
======

Memize is a unabashedly-barebones memoization library with an aim toward speed. By all accounts, Memize is __the fastest memoization implementation__ in JavaScript (see [benchmarks](#benchmarks), [how it works](#how-it-works)). It supports multiple arguments, including non-primitive arguments (by reference). All this weighing in at less than 0.3kb minified and gzipped, with no dependencies.

## Example

Simply pass your original function as an argument to Memize. The return value is a new, memoized function.

```js
function fibonacci( number ) {
	if ( number < 2 ) {
		return number;
	}

	return fibonacci( number - 1 ) + fibonacci( number - 2 );
}

var memoizedFibonacci = memize( fibonacci );

memoizedFibonnaci( 8 ); // Invoked, cached, and returned
memoizedFibonnaci( 8 ); // Returned from cache
memoizedFibonnaci( 5 ); // Invoked, cached, and returned
memoizedFibonnaci( 8 ); // Returned from cache
```

## Installation

Using [npm](https://www.npmjs.com/) as a package manager:

```
npm install memize
```

Otherwise, download a pre-built copy from unpkg:

[https://unpkg.com/memize/dist/memize.min.js](https://unpkg.com/memize/dist/memize.min.js)

## Usage

Memize accepts a function to be memoized, and returns a new memoized function.

```
memize( fn: Function, options: ?{
	maxSize?: number
} ): Function
```

Optionally, pass an options object with `maxSize` defining the maximum size of the cache.

The memoized function exposes a `clear` function if you need to reset the cache:

```js
memoizedFn.clear();
```

## Benchmarks

The following benchmarks are performed in Node 8.2.1 on a MacBook Pro (Late 2016), 2.9 GHz Intel Core i7. Lodash, Underscore, and Ramda are only included in the first benchmark because they do not support multiple argument memoization.

__Single argument__

![Benchmark](https://cldup.com/BbpWXvSdjR.png)

| Name               | Ops / sec  | Relative margin of error |
| -------------------|------------|------------------------- |
| memize             | 46,802,274 | ± 0.95%                  |
| moize              | 36,659,057 | ± 1.09%                  |
| fast-memoize       | 28,318,096 | ± 2.31%                  |
| moize (serialized) | 14,363,716 | ± 0.82%                  |
| underscore         | 12,934,260 | ± 0.75%                  |
| lru-memoize        | 11,648,537 | ± 1.13%                  |
| memoizee           | 11,120,460 | ± 1.02%                  |
| lodash             | 9,896,950  | ± 0.51%                  |
| memoizerific       | 2,252,795  | ± 1.26%                  |
| memoizejs          | 1,357,025  | ± 0.76%                  |
| ramda              | 1,109,387  | ± 0.85%                  |

__Multiple arguments (primitive)__

![Benchmark](https://cldup.com/R5LPxwxpAH.png)

| Name               | Ops / sec  | Relative margin of error |
| -------------------|------------|------------------------- |
| memize             | 35,171,560 | ± 0.62%                  |
| moize              | 22,314,974 | ± 1.01%                  |
| moize (serialized) | 11,188,031 | ± 0.84%                  |
| lru-memoize        | 8,625,528  | ± 1.83%                  |
| memoizee           | 8,435,400  | ± 0.77%                  |
| memoizerific       | 1,438,243  | ± 1.04%                  |
| memoizejs          | 1,130,111  | ± 0.61%                  |
| fast-memoize       | 754,958    | ± 0.64%                  |

__Multiple arguments (non-primitive)__

![Benchmark](https://cldup.com/RYJPiEQxC5.png)

| Name               | Ops / sec  | Relative margin of error |
| -------------------|------------|------------------------- |
| memize             | 35,439,005 | ± 0.58%                  |
| moize              | 22,624,991 | ± 1.11%                  |
| lru-memoize        | 8,562,363  | ± 1.76%                  |
| memoizee           | 8,424,725  | ± 1.11%                  |
| moize (serialized) | 1,575,815  | ± 0.87%                  |
| memoizerific       | 1,466,993  | ± 0.87%                  |
| memoizejs          | 832,957    | ± 0.94%                  |
| fast-memoize       | 649,054    | ± 0.53%                  |

## How it works

If you haven't already, feel free to [glance over the source code](./index.js). It's approximately 100 lines of code of heavily commented code, and should help provide substance to the implementation concepts.

Memize creates a [last-in first-out stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type)) implemented as a [doubly linked list](https://en.wikipedia.org/wiki/Doubly_linked_list). It biases recent access favoring real-world scenarios where the function is subsequently invoked multiple times with the same arguments. The choice to implement as a linked list is due to dramatically better performance characteristics compared to `Array#unshift` for surfacing an entry to the head of the list ([jsperf](https://jsperf.com/array-unshift-linked-list)). A downside of linked lists is inability to efficiently access arbitrary indices, but iterating from the beginning of the cache list is optimized by guaranteeing the list is sorted by recent access / insertion.

Each node in the list tracks the original arguments as an array. This acts as a key of sorts, matching arguments of the current invocation by performing a shallow equality comparison on the two arrays. Other memoization implementations often use `JSON.stringify` to generate a string key for lookup in an object cache, but this benchmarks much slower than a shallow comparison ([jsperf](https://jsperf.com/lookup-json-stringify-vs-shallow-equality)).

Finally, special care is made toward treatment of `arguments` due to engine-specific deoptimizations which can occur in V8 via [arguments leaking](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments). Order is important here; we only create a shallow clone when necessary, after the cache has been checked, to avoid creating a clone unnecessarily if a cache entry exists. Looking at the code, you'd not be blamed for thinking that dropping the shallow clone would improve performance, but in fact it would _slow_ execution by approximately 60%. This is due to how the lingering `arguments` reference would carry over by reference ("leaks") in the node's `args` property.

## License

Copyright 2017 Andrew Duthie

Released under the [MIT License](./LICENSE.md).
