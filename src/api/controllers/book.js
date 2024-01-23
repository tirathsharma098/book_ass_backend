import Book from "../../db/models/book.js";
import BookBought from "../../db/models/bookBought.js";
import { CONTROLLER, VALIDATOR } from "../../utils/constants.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { celebrate, Joi } from "celebrate";
import httpStatus from "http-status";

const addBook = {
    [VALIDATOR]: celebrate({
        body: Joi.object()
            .keys({
                title: Joi.string().required(),
                author: Joi.string(),
                summary: Joi.string(),
                price: Joi.number().required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { title, author, summary, price } = req.body;
        const newBook = new Book({ title, author, summary, price });
        await newBook.save();
        return sendResponse(
            res,
            newBook,
            "New book added successfully",
            true,
            httpStatus.OK
        );
    },
};

const bookList = {
    // [VALIDATOR]: celebrate({
    //     body: Joi.object()
    //         .keys({
    //             title: Joi.string().required(),
    //             author: Joi.string(),
    //             summary: Joi.string(),
    //             price: Joi.string().required(),
    //         })
    //         .required(),
    // }),
    [CONTROLLER]: async (req, res) => {
        const bookFound = await Book.aggregate([
            { $sort: { created_at: -1 } },
        ]).exec();
        return sendResponse(
            res,
            bookFound,
            "Book list got successfully",
            true,
            httpStatus.OK
        );
    },
};

const getBookDetail = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                id: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { id } = req.params;
        const foundBook = await Book.findById(id);
        return sendResponse(
            res,
            foundBook,
            "Book found successfully",
            true,
            httpStatus.OK
        );
    },
};

const updateBook = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                id: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
            })
            .required()
            .messages({
                "*": "Please enter valid book id",
            }),
        body: Joi.object()
            .keys({
                title: Joi.string().required(),
                author: Joi.string(),
                summary: Joi.string(),
                price: Joi.number().required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { id } = req.params;
        const { title, author, summary, price } = req.body;
        const bookUpdated = await Book.findByIdAndUpdate(id, {
            title,
            author,
            summary,
            price,
        });
        return sendResponse(
            res,
            bookUpdated,
            "Book updated successfully",
            true,
            httpStatus.OK
        );
    },
};

const deleteBook = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                id: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
            })
            .required()
            .messages({
                "*": "Please enter valid book id",
            }),
    }),
    [CONTROLLER]: async (req, res) => {
        const { id } = req.params;
        const bookDeleted = await Book.findByIdAndDelete(id);
        return sendResponse(
            res,
            bookDeleted,
            "Book deleted successfully",
            true,
            httpStatus.OK
        );
    },
};

const buyBook = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                id: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
            })
            .required()
            .messages({
                "*": "Please enter valid book id",
            }),
    }),
    [CONTROLLER]: async (req, res) => {
        const { id } = req.params;
        const bookBought = await BookBought.findOne({
            book: { _id: id },
            user: { _id: req.currentUser._id },
        });
        if (bookBought) {
            if (bookBought.approved)
                return sendResponse(
                    res,
                    {},
                    "Book already bought successfully",
                    true,
                    httpStatus.OK
                );
            return sendResponse(
                res,
                bookBought,
                "Book already in cart",
                true,
                httpStatus.OK
            );
        }
        const bookFound = await Book.findById(id);
        if (!bookFound)
            return sendResponse(res, {}, "Book not found", true, httpStatus.OK);
        const newBookBought = new BookBought({
            book: bookFound,
            user: req.currentUser,
        });
        await newBookBought.save();
        return sendResponse(
            res,
            bookBought,
            "Book bought successfully",
            true,
            httpStatus.OK
        );
    },
};

const getSoldBooks = {
    [CONTROLLER]: async (req, res) => {
        const foundBook = await BookBought.find({}, [], {
            sort: { created_at: -1 },
        })
            .populate("user")
            .populate("book");
        return sendResponse(
            res,
            foundBook,
            "Book found successfully",
            true,
            httpStatus.OK
        );
    },
};

const approveBookSold = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                id: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { id } = req.params;
        const approvedBook = await BookBought.findByIdAndUpdate(id, {
            approved: true,
        });
        return sendResponse(
            res,
            approvedBook,
            "Book approved successfully",
            true,
            httpStatus.OK
        );
    },
};

const myBooks = {
    [CONTROLLER]: async (req, res) => {
        const myBooks = await BookBought.find({ user: req.currentUser }, [], {
            sort: { created_at: -1 },
        }).populate("book");
        return sendResponse(
            res,
            myBooks,
            "Books got successfully",
            true,
            httpStatus.OK
        );
    },
};

export {
    addBook,
    bookList,
    getBookDetail,
    updateBook,
    deleteBook,
    buyBook,
    getSoldBooks,
    approveBookSold,
    myBooks,
};
