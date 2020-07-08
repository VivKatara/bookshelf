const ShelfResolvers = {
  Shelf: {
    shelfInfo: (parent: any, args: any) => {
      return parent.shelfInfo;
    },
    bookshelfBooks: (parent: any, args: any) => {
      return parent.bookshelfBooks;
    },
  },
};

export default ShelfResolvers;
