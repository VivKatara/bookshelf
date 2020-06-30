import axios from "axios";
import config from "../config";
import BookCollection from "../models/BooksCollection";

type BookFields = [string, Array<string>, string, string, string];

export default class BookService {
  public static addBook = async (
    title: string,
    author: string
  ): Promise<string> => {
    // search Book Collection for the book
    const book: any = await BookCollection.findOne({ title });
    if (book) return book.isbn;

    // search Google Books API
    const matches = await BookService.searchGoogleBooksAPI(title, author);

    const [
      finalTitle,
      finalAuthors,
      finalDescription,
      finalIsbn,
      finalImageLink,
    ] = BookService.findExactMatch(matches, title, author);

    // Just search by isbn again in case the title search wasn't enough
    const foundBook: any = await BookCollection.findOne({ finalIsbn });
    if (foundBook) return foundBook.isbn;

    const newBook = new BookCollection({
      title: finalTitle,
      authors: finalAuthors,
      description: finalDescription,
      isbn: finalIsbn,
      coverImage: finalImageLink,
    });
    await newBook.save();
    return finalIsbn;
  };

  private static searchGoogleBooksAPI = async (
    title: string,
    author: string
  ): Promise<any> => {
    // Preparing the search terms
    const newTitle = title.split(" ").join("+");
    const newAuthor = author.split(" ").join("+");
    const searchTerms = `${newTitle}+intitle:${newTitle}+inauthor:${newAuthor}`;

    const googleBooksApiResponse = await axios.get(
      config.googleBooksVolumeApiUrl,
      {
        params: { q: searchTerms, key: config.googleBooksApiKey },
      }
    );

    if (
      googleBooksApiResponse.status === 200 &&
      googleBooksApiResponse.data.totalItems > 0
    ) {
      return googleBooksApiResponse.data.items;
    } else {
      throw { status: 404, message: "Could not find this particular book" };
    }
  };

  private static findExactMatch = (
    items: any,
    userAddedTitle: string,
    userAddedAuthor: string
  ): BookFields => {
    // TODO: Make this function a bit more robust
    const finalMatches = items.filter((item: any) => {
      // Also should do a check here to make sure item.volumeInfo.authors includes userAddedAuthor
      return (
        item.volumeInfo.title.toUpperCase() === userAddedTitle.toUpperCase()
      );
    });

    if (!finalMatches.length) {
      throw {
        status: 404,
        message: "Error! Could not find this particular book",
      };
    }

    // Must have found a match, let's just assume the one we're looking for is the first
    const finalMatch = finalMatches[0];
    const finalTitle = finalMatch.volumeInfo.title;
    const finalAuthors = finalMatch.volumeInfo.authors;
    const finalDescription = finalMatch.volumeInfo.description;
    const industryIdentifiers = finalMatch.volumeInfo.industryIdentifiers;
    const filteredIsbn = industryIdentifiers.filter((identifer: any) => {
      return identifer.type === "ISBN_13";
    });
    const finalIsbn = filteredIsbn[0].identifier;
    const finalImageLink = finalMatch.volumeInfo.imageLinks.thumbnail
      ? finalMatch.volumeInfo.imageLinks.thumbnail
      : finalMatch.volumeInfo.imageLinks.smallThumbnail;

    return [
      finalTitle,
      finalAuthors,
      finalDescription,
      finalIsbn,
      finalImageLink,
    ];
  };
}
