type BookFields = [string, Array<string>, string, string, string, boolean];

const extractBookFields = (
  items: any,
  userAddedTitle: string,
  userAddedAuthor: string
): BookFields => {
  const newItems = items.filter((item: any) => {
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
    const filteredIsbn = industryIdentifiers.filter((identifer: any) => {
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
    return ["", [], "", "", "", false];
  }
};

export default extractBookFields;
