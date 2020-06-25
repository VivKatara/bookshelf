module.exports = function (items, userAddedTitle, userAddedAuthor) {
  const newItems = items.filter((item) => {
    // Also should do a check here to make sure item.volumeInfo.authors includes userAddedAuthor
    return item.volumeInfo.title.toUpperCase() === userAddedTitle.toUpperCase();
  });
  if (newItems.length) {
    // Found a match
    const finalItem = newItems[0];
    const finalTitle = finalItem.volumeInfo.title;
    const finalAuthors = finalItem.volumeInfo.authors;
    const finalDescription = finalItem.volumeInfo.description;
    const industryIdentifiers = finalItem.volumeInfo.industryIdentifiers;
    const filteredIsbn = industryIdentifiers.filter((identifer) => {
      return identifer.type === "ISBN_13";
    });
    const finalIsbn = filteredIsbn[0].identifier;
    const finalImageLink = finalItem.volumeInfo.imageLinks.thumbnail
      ? finalItem.volumeInfo.imageLinks.thumbnail
      : finalItem.volumeInfo.imageLinks.smallThumbnail;
    return [
      finalTitle,
      finalAuthors,
      finalDescription,
      finalIsbn,
      finalImageLink,
      true,
    ];
  } else {
    // Throw an error because there was no match
    return ["", [], "", "", false];
  }
};
