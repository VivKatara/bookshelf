import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  FunctionComponent,
} from "react";
import axios from "axios";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import Shelf from "./Shelf";
import Loading from "./Loading";
import NotFound from "./NotFound";
import PageCount from "./PageCount";
import NotLoggedInHeader from "./headers/NotLoggedInHeader";
import AddBookModal from "./modals/AddBookModal";
import AddBookLink from "./links/AddBookLink";
import AuthLinks from "./links/AuthLinks";
import NextPreviousNavigation from "./links/NextPreviousNavigation";
import { useModal } from "../hooks/useModal";
import { useBookModalUpdates } from "../hooks/useBookModalUpdates";
import {
  FullShelfActionTypes,
  UPDATE_ISBNS,
  PAGE_MOUNT,
} from "../types/actions";
import { FullShelfIsbnState, FullShelfPageState } from "../types/FullShelf";
import { RouteComponentProps } from "react-router-dom";
import { AppState } from "../store/configureStore";
import { User } from "../types/User";
import { useQuery } from "@apollo/react-hooks";
import { GET_USER_BOOKSHELF_AND_BOOK_QUERY } from "../graphql/queries";
import { shelfTypes } from "./shelfTypes";

// Keep track of array of ISBNs to pass down to shelves
const initialIsbnState: any = {
  firstShelfIsbn: [],
  secondShelfIsbn: [],
  thirdShelfIsbn: [],
};

const isbnReducer = (state: any, action: FullShelfActionTypes): any => {
  switch (action.type) {
    case UPDATE_ISBNS:
      return {
        ...state,
        firstShelfIsbn: action.payload.firstShelf,
        secondShelfIsbn: action.payload.secondShelf,
        thirdShelfIsbn: action.payload.thirdShelf,
      };
    default:
      return state;
  }
};

// Keep track of various state regarding the current page
const initialPageState: FullShelfPageState = {
  totalPages: 1,
  showPrevious: false,
  showNext: false,
  showPageCount: false,
};

const pageReducer = (
  state: FullShelfPageState,
  action: FullShelfActionTypes
): FullShelfPageState => {
  switch (action.type) {
    case PAGE_MOUNT:
      return {
        ...state,
        totalPages: action.payload.totalPages,
        showPrevious: action.payload.showPrevious,
        showNext: action.payload.showNext,
        showPageCount: action.payload.showPageCount,
      };
    default:
      return state;
  }
};

type RouteParams = {
  username: string;
  type: string;
};

type FullShelfProps = {} & RouteComponentProps<RouteParams>;
type Props = FullShelfProps & LinkStateProps;

const FullShelf: FunctionComponent<Props> = (props) => {
  const username = props.match.params.username;
  const shelf = `${props.match.params.type}Books`;
  const shelfTitle = shelfTypes[shelf];

  // Get page number from query string parameter
  const queryString = new URLSearchParams(props.location.search);
  const pageValues = queryString.getAll("page");
  const page = parseInt(pageValues[0]);

  const [pageSize, setPageSize] = useState(21);

  const [shelfState, isbnDispatch] = useReducer(isbnReducer, initialIsbnState);
  const [pageState, pageDispatch] = useReducer(pageReducer, initialPageState);

  // State to handle modal, will be updated if there is a shelf Update
  const [showModal, toggleModal] = useModal();
  const [shelfUpdates, setShelfUpdates] = useState(0);
  const buttonRef = useRef(null);

  // State to manage updates triggered by the book modal
  const [bookModalUpdates, triggerBookModalUpdate] = useBookModalUpdates();

  const { user } = props;

  const { loading, error, data, refetch } = useQuery(
    GET_USER_BOOKSHELF_AND_BOOK_QUERY,
    {
      variables: { username },
    }
  );

  const handleShelfUpdate = (shelf: string) => {
    setShelfUpdates((prev) => prev + 1);
  };

  useEffect(() => {
    if (data) {
      refetch({ username }); // TODO: This works, but the architecture is super inefficient
      const totalPages = data.homepage.bookshelf[`${shelf}Count`] / pageSize;
      let showNext: boolean = false;
      let showPrevious: boolean = false;
      let showPageCount: boolean = false;
      if (totalPages > 1) {
        showPageCount = true;
        if (page < totalPages) {
          showNext = true;
        }
        if (page > 1) {
          showPrevious = true;
        }
      }

      const action: FullShelfActionTypes = {
        type: PAGE_MOUNT,
        payload: {
          totalPages,
          showPrevious,
          showNext,
          showPageCount,
        },
      };

      pageDispatch(action);

      const paginatedBooks = paginate(
        data.homepage.bookshelf[shelf],
        data.homepage.bookshelf[`${shelf}Count`],
        page,
        pageSize
      );
      const firstShelfIsbn: Array<string> = paginatedBooks.slice(
        0,
        pageSize / 3
      );
      const secondShelfIsbn: Array<string> = paginatedBooks.slice(
        pageSize / 3,
        (pageSize * 2) / 3
      );
      const thirdShelfIsbn: Array<string> = paginatedBooks.slice(
        (pageSize * 2) / 3
      );
      const isbnAction: FullShelfActionTypes = {
        type: UPDATE_ISBNS,
        payload: {
          firstShelf: firstShelfIsbn,
          secondShelf: secondShelfIsbn,
          thirdShelf: thirdShelfIsbn,
        },
      };
      isbnDispatch(isbnAction);
    }
  }, [data, shelfUpdates, bookModalUpdates]);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <NotFound />;
  } else {
    if (!data.homepage) {
      return <NotFound />;
    } else {
      return (
        <>
          {!user.isLoggedIn && <NotLoggedInHeader username={username} />}
          <MainContainer>
            <PageCount
              show={pageState.showPageCount}
              page={page}
              totalPages={pageState.totalPages}
            />
            {showModal && (
              <AddBookModal
                buttonRef={buttonRef}
                handleClose={toggleModal}
                shelfUpdate={handleShelfUpdate}
                shelf={shelf}
              />
            )}
            {user.isLoggedIn ? (
              <AddBookLink buttonRef={buttonRef} toggleModal={toggleModal} />
            ) : (
              <AuthLinks />
            )}
            <CentralDiv>
              <Title>{shelfTitle}</Title>
              <Shelf
                shelfBooks={shelfState.firstShelfIsbn}
                shelf={shelf}
                handleModalUpdate={triggerBookModalUpdate}
              />
              <Space />
              <Shelf
                shelfBooks={shelfState.secondShelfIsbn}
                shelf={shelf}
                handleModalUpdate={triggerBookModalUpdate}
              />
              <Space />
              <Shelf
                shelfBooks={shelfState.thirdShelfIsbn}
                shelf={shelf}
                handleModalUpdate={triggerBookModalUpdate}
              />
              <NextPreviousNavigation
                prev={pageState.showPrevious}
                next={pageState.showNext}
                url={props.match.url}
                page={page}
              />
            </CentralDiv>
          </MainContainer>
        </>
      );
    }
  }
  // const handleShelfUpdate = (shelf: string) => {
  //   setShelfUpdates((prev) => prev + 1);
  // };

  // // This is the effect that updates various pageState such as the total page count and whether or not to show certain buttons
  // useEffect(() => {
  //   async function pageMount(): Promise<void> {
  //     let totalPages = 1;
  //     //TODO Refresh Token middelware
  //     const response = await axios.get(
  //       "http://localhost:5000/book/getTotalPages",
  //       { params: { username, shelf, pageSize }, withCredentials: true }
  //     );
  //     totalPages = response.data.totalPages;

  //     let shelfTitle: string = "";
  //     if (shelf === "currentBooks") {
  //       shelfTitle = "Currently Reading";
  //     } else if (shelf === "pastBooks") {
  //       shelfTitle = "Have Read";
  //     } else {
  //       shelfTitle = "Want to Read";
  //     }

  //     let showNext: boolean = false;
  //     let showPrevious: boolean = false;
  //     let showPageCount: boolean = false;
  //     if (totalPages > 1) {
  //       showPageCount = true;
  //       if (page < totalPages) {
  //         showNext = true;
  //       }
  //       if (page > 1) {
  //         showPrevious = true;
  //       }
  //     }

  //     const action: FullShelfActionTypes = {
  //       type: PAGE_MOUNT,
  //       payload: {
  //         totalPages,
  //         showPrevious,
  //         showNext,
  //         showPageCount,
  //         shelfTitle,
  //       },
  //     };

  //     pageDispatch(action);
  //   }
  //   pageMount();
  // }, [shelfUpdates, bookModalUpdates]);

  // // This is the effect that tracks which isbn numbers should be passed down to the shelves
  // useEffect(() => {
  //   async function getIsbns(): Promise<void> {
  //     const response = await axios.get("http://localhost:5000/book/getBooks", {
  //       params: { username, shelf, page, pageSize },
  //       withCredentials: true,
  //     });
  //     const firstShelfIsbn: Array<string> = response.data.isbn.slice(
  //       0,
  //       pageSize / 3
  //     );
  //     const secondShelfIsbn: Array<string> = response.data.isbn.slice(
  //       pageSize / 3,
  //       (pageSize * 2) / 3
  //     );
  //     const thirdShelfIsbn: Array<string> = response.data.isbn.slice(
  //       (pageSize * 2) / 3
  //     );
  //     const action: FullShelfActionTypes = {
  //       type: UPDATE_ISBNS,
  //       payload: {
  //         firstShelf: firstShelfIsbn,
  //         secondShelf: secondShelfIsbn,
  //         thirdShelf: thirdShelfIsbn,
  //       },
  //     };
  //     isbnDispatch(action);
  //   }
  //   getIsbns();
  // }, [shelfUpdates, bookModalUpdates]);

  // //TODO Make a nice Loading component
  // if (validUsername === null) {
  //   return <Loading />;
  // } else if (validUsername) {
  //   return (
  //     <>
  //       {!user.isLoggedIn && <NotLoggedInHeader username={username} />}
  //       <MainContainer>
  //         <PageCount
  //           show={pageState.showPageCount}
  //           page={page}
  //           totalPages={pageState.totalPages}
  //         />
  //         {showModal && (
  //           <AddBookModal
  //             buttonRef={buttonRef}
  //             handleClose={toggleModal}
  //             shelfUpdate={handleShelfUpdate}
  //             shelf={shelf}
  //           />
  //         )}
  //         {user.isLoggedIn ? (
  //           <AddBookLink buttonRef={buttonRef} toggleModal={toggleModal} />
  //         ) : (
  //           <AuthLinks />
  //         )}
  //         <CentralDiv>
  //           <Title>{pageState.shelfTitle}</Title>
  //           <Shelf
  //             isbns={shelfState.firstShelfIsbn}
  //             shelf={shelf}
  //             handleModalUpdate={triggerBookModalUpdate}
  //           />
  //           <Space />
  //           <Shelf
  //             isbns={shelfState.secondShelfIsbn}
  //             shelf={shelf}
  //             handleModalUpdate={triggerBookModalUpdate}
  //           />
  //           <Space />
  //           <Shelf
  //             isbns={shelfState.thirdShelfIsbn}
  //             shelf={shelf}
  //             handleModalUpdate={triggerBookModalUpdate}
  //           />
  //           <NextPreviousNavigation
  //             prev={pageState.showPrevious}
  //             next={pageState.showNext}
  //             url={props.match.url}
  //             page={page}
  //           />
  //         </CentralDiv>
  //       </MainContainer>
  //     </>
  //   );
  // } else {
  //   return <NotFound />;
  // }
};

type LinkStateProps = {
  user: User;
};

const mapStateToProps = (
  state: AppState,
  ownProps: FullShelfProps
): LinkStateProps => ({
  user: state.userState,
});

export default connect(mapStateToProps, null)(FullShelf);

const paginate = (
  array: any,
  length: number,
  pageNumber: number,
  pageSize: number
): any => {
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

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #222222;
`;

export const CentralDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  position: relative;
  margin-left: 10%;
  font-size: 14px;
  color: white;
`;

const Space = styled.div`
  flex-basis: 45px;
`;
