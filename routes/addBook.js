const express = require("express");
const axios = require("axios");
const router = express.Router();

const CurrentBook = require("../models/CurrentBooks");

const authenticateToken = require("../validation/authenticateToken");

router.get("/", authenticateToken, (req, res) => {
  const title = req.query.title;
  const author = req.query.author;
  // const shelf = req.query.shelf;
  const newTitle = title.split(" ").join("+");
  const newAuthor = author.split(" ").join("+");

  const searchTerms = `${newTitle}+intitle:${newTitle}+inauthor:${newAuthor}`;
  const googleBooksApiUrl = process.env.GOOGLE_BOOKS_VOLUME_BASE_API;

  axios
    .get(googleBooksApiUrl, {
      params: {
        q: searchTerms,
        key: process.env.GOOGLE_BOOKS_API_KEY,
      },
    })
    .then((response) => {
      const items = response.data.items;
      const newItems = items.filter((item) => {
        return item.volumeInfo.title.toUpperCase() === title.toUpperCase();
      });
      if (newItems.length) {
        const finalItem = newItems[0];
        const email = req.user.email;
        const finalTitle = finalItem.volumeInfo.title;
        const finalAuthors = finalItem.volumeInfo.authors;
        const industryIdentifiers = finalItem.volumeInfo.industryIdentifiers;
        const filteredIsbn = industryIdentifiers.filter((identifer) => {
          return identifer.type === "ISBN_13";
        });
        const finalIsbn = filteredIsbn[0].identifier;
        const finalImageLink = finalItem.volumeInfo.imageLinks.thumbnail
          ? finalItem.volumeInfo.imageLinks.thumbnail
          : finalItem.volumeInfo.imageLinks.smallThumbnail;
        CurrentBook.findOne({
          email,
          title: finalTitle,
          authors: finalAuthors,
          isbn: finalIsbn,
          coverImage: finalImageLink,
        })
          .then((book) => {
            if (book) {
              return res.status(200).json({
                msg: "This book already exists on your shelf!",
                success: true,
              });
            } else {
              const newBook = new CurrentBook({
                email,
                title: finalTitle,
                authors: finalAuthors,
                isbn: finalIsbn,
                coverImage: finalImageLink,
              });
              newBook
                .save()
                .then((savedBook) => {
                  // Let them know that it was successful save
                  console.log("Before save");
                  return res.status(200).json({
                    msg: "This book has been successfully saved to your shelf.",
                    success: true,
                  });
                  console.log("after save");
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      } else {
        console.log("No matches");
      }
    })
    .catch((err) => console.log(err));
});

module.exports = router;
