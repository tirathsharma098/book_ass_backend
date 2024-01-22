import express from "express";
import {
    addBook,
    bookList,
    deleteBook,
    getBookDetail,
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
)

export default router;
