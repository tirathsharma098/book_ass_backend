import Book from "../../db/models/book.js";
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
        const bookFound = await Book.find({});
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
                id: Joi.string().required(),
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
                id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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
                id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
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

export { addBook, bookList, getBookDetail, updateBook, deleteBook };
