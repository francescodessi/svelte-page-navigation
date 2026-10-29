import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	pageCount,
	clampPage,
	pageWindow,
	arrayChunks,
	getArrayOfNumbers
} from '../src/lib/utilities.js';

test('normalizes invalid counts and clamps pages after a count change', () => {
	for (const value of [NaN, Infinity, -1, 0]) assert.equal(pageCount(value), 0);
	assert.equal(pageCount(3.8), 3);
	assert.equal(clampPage(9, 3), 2);
	assert.equal(clampPage(Infinity, 3), 2);
	assert.equal(clampPage(-1, 3), 0);
	assert.equal(clampPage(NaN, 0), 0);
});

test('groups pages without allocating the entire page range', () => {
	assert.deepEqual(pageWindow(20, 6, 5), { pages: [5, 6, 7, 8, 9], previous: 0, next: 10 });
	assert.deepEqual(pageWindow(12, 11, 5), { pages: [10, 11], previous: 5, next: null });
	assert.deepEqual(pageWindow(10, 0, 0), { pages: [], previous: null, next: null });
	assert.deepEqual(pageWindow(1e9, 999999999, 3).pages, [999999999]);
});

test('retains existing utility behavior', () => {
	assert.deepEqual(getArrayOfNumbers(3), [0, 1, 2]);
	assert.deepEqual(arrayChunks([0, 1, 2], 2), [[0, 1], [2]]);
	assert.deepEqual(arrayChunks([0], 0), []);
});
