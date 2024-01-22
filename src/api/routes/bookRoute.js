import express from "express";
import {
    addBook,
    approveBookSold,
    bookList,
    buyBook,
    deleteBook,
    getBookDetail,
    getSoldBooks,
    updateBook,
} from "../controllers/book.js";
import { validateSuperAdmin } from "../controllers/validators.js";
import { catchAsync } from "../../utils/catchAsync.js";
const router = express.Router();

router.get("/list-book", catchAsync(bookList.controller));
router.post(
    "/add-book",
    addBook.validator,
    validateSuperAdmin,
    catchAsync(addBook.controller)
);
router.get(
    "/view-book/:id",
    getBookDetail.validator,
    catchAsync(getBookDetail.controller)
);
router.put(
    "/update-book/:id",
    updateBook.validator,
    catchAsync(updateBook.controller)
);
router.delete(
    "/delete-book/:id",
    deleteBook.validator,
    catchAsync(deleteBook.controller)
);
router.post("/buy-book/:id", buyBook.validator, catchAsync(buyBook.controller));
router.get("/book-sold", catchAsync(getSoldBooks.controller));
router.put("/book-approve/:id", approveBookSold.validator, catchAsync(approveBookSold.controller))

export default router;
