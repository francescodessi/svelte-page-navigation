const getArrayOfNumbers = (size) => size > 0 ? [...Array(size).keys()] : [];

const arrayChunks = (array, chunkSize) => {
    const chunks = [];
    
    if(chunkSize > 0) {
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks[chunks.length] = array.slice(i, i + chunkSize);
        }
    }
    
    return chunks;
};

export {getArrayOfNumbers, arrayChunks};