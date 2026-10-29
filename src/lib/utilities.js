/** @param {number} size */
const getArrayOfNumbers = (size) => (size > 0 ? [...Array(size).keys()] : []);

/** @template T @param {T[]} array @param {number} chunkSize */
const arrayChunks = (array, chunkSize) => {
	const chunks = [];

	if (chunkSize > 0) {
		for (let i = 0; i < array.length; i += chunkSize) {
			chunks[chunks.length] = array.slice(i, i + chunkSize);
		}
	}

	return chunks;
};

export { getArrayOfNumbers, arrayChunks };

// Only allocate the visible group, even when there are millions of pages.
/** @param {number} value */
export function pageCount(value) {
	return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

/** @param {number | string} page @param {number} pages */
export function clampPage(page, pages) {
	return Math.min(Math.max(0, Math.floor(Number(page)) || 0), Math.max(0, pages - 1));
}

/** @param {number} pages @param {number} currentPage @param {number} size */
export function pageWindow(pages, currentPage, size) {
	size = Math.min(pageCount(size), pages);
	if (!size) return { pages: [], previous: null, next: null };
	const start = Math.floor(currentPage / size) * size;
	return {
		pages: Array.from({ length: Math.min(size, pages - start) }, (_, i) => start + i),
		previous: start > 0 ? start - size : null,
		next: start + size < pages ? start + size : null
	};
}
