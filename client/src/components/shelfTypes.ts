type shelfType = {
  [shelfName: string]: string;
};

export const shelfTypes: shelfType = {
  currentBooks: "Currently Reading",
  pastBooks: "Have Read",
  futureBooks: "Want to Read",
};
