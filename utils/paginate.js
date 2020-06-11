module.exports = function paginate(array, length, pageNumber, pageSize) {
  if ((pageNumber - 1) * pageSize + pageSize <= length) {
    // Check to make sure that it isn't a problem that this returns a shallow copy
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  } else if ((pageNumber - 1) * pageSize < length) {
    return array.slice((pageNumber - 1) * pageSize);
  } else {
    // Here the pageNumber must be too high, so we're out of range
    return [];
  }
};
