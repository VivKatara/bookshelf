import BookService from "../../services/book";

const BookshelfBookResolvers = {
  BookshelfBook: {
    details: async (parent: any, args: any) => {
      return await BookService.getBook(parent.isbn);
    },
  },
};

export default BookshelfBookResolvers;
