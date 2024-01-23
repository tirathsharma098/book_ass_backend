import express from "express";
import {
    addBook,
    approveBookSold,
    bookList,
    buyBook,
    deleteBook,
    getBookDetail,
    getSoldBooks,
    myBooks,
    updateBook,
} from "../controllers/book.js";
import {
    validateAdminAndSuperAdmin,
    validateCustomer,
    validateSuperAdmin,
} from "../controllers/validators.js";
import { catchAsync } from "../../utils/catchAsync.js";
const router = express.Router();

router.get("/list-book", catchAsync(bookList.controller));
router.post(
    "/add-book",
    addBook.validator,
    validateAdminAndSuperAdmin,
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
    validateAdminAndSuperAdmin,
    catchAsync(updateBook.controller)
);
router.delete(
    "/delete-book/:id",
    deleteBook.validator,
    validateSuperAdmin,
    catchAsync(deleteBook.controller)
);
router.post(
    "/buy-book/:id",
    buyBook.validator,
    validateCustomer,
    catchAsync(buyBook.controller)
);
router.get(
    "/book-sold",
    validateAdminAndSuperAdmin,
    catchAsync(getSoldBooks.controller)
);
router.put(
    "/book-approve/:id",
    approveBookSold.validator,
    validateAdminAndSuperAdmin,
    catchAsync(approveBookSold.controller)
);
router.get("/my-books", catchAsync(myBooks.controller));

export default router;
