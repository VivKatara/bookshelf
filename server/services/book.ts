import axios from "axios";
import config from "../config";
import BookCollection from "../models/BookCollection";
import { errorNames } from "../errors";

type BookFields = [string, Array<string>, string, string, string];

export default class BookService {
  public static getBook = async (isbn: string) => {
    return await BookCollection.findOne({ isbn });
  };
  public static addBook = async (
    title: string,
    author: string
  ): Promise<any> => {
    // search Book Collection for the book
    const book: any = await BookCollection.findOne({ title });
    if (book) return book;

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
    return newBook;
  };

  public static getBooks = async (args: any) => {
    let query = await BookCollection.find();
    const pageInfo = await BookService.getPageInfo(
      query,
      args.page,
      args.pageSize
    );
    query = await BookService.applyPagination(
      query,
      query.length,
      args.page,
      args.pageSize
    );
    return {
      query,
      pageInfo,
    };
  };

  private static getPageInfo = (query: any, page: any, pageSize: any) => {
    return {
      totalPages: Math.ceil(query.length / pageSize),
      hasNextPage: Math.ceil(query.length / pageSize) > page,
      hasPreviousPage: page > 1,
    };
  };

  private static applyPagination = async (
    array: any,
    length: any,
    pageNumber: any,
    pageSize: any
  ) => {
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
      throw new Error(errorNames.COULD_NOT_FIND_BOOK);
    }
  };

  // Get the details of given book
  public static getBookDetails = async (
    isbn: string
  ): Promise<{
    title: string;
    authors: Array<string>;
    description: string;
    coverImage: string;
  }> => {
    const book = await BookCollection.findOne({ isbn });
    if (!book) {
      throw { status: 500, message: "Something unexpected occurred" };
    }
    const { title, authors, description, coverImage } = book;
    return { title, authors, description, coverImage };
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
      throw new Error(errorNames.COULD_NOT_FIND_BOOK);
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
