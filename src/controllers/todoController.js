const userModel = require("../models/userModel")
const todoModel = require('../models/todoModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')



const isValidTitle = (title) => {
    return /^[A-Za-z0-9\s\-_,\.;@!:()]+$/.test(title.trim())

};


let createTodo = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter Some Details" });
        }
        let { userId, title, date, isDeleted } = data

        if (!userId) {
            res.status(400).send({ status: false, message: "UserId is required" })
        }
        let isValiduserId = mongoose.Types.ObjectId.isValid(userId);  //return true or false


        if (!isValiduserId) {
            return res.status(400).send({ status: false, message: "userId is Not Valid" });
        }

        const finduserId = await userModel.findById(userId) //give whole data

        if (!finduserId) {
            return res.status(404).send({ status: false, message: "userId not found" })
        }

        if (!title) {
            return res.status(400).send({ status: false, message: "Title is required" });
        }



        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Invalid format of Title", });
        }

        if (isDeleted) {
            if (typeof (isDeleted) != "boolean") {
                return res.status(400).send({ status: false, message: "Invalid Input of isDeleted.It must be true or false " });
            }
            if (isDeleted == true) {
                return res.status(400).send({ status: false, message: "isDeleted must be false while creating todo" });
            }
        }

        const todo = {
            userId: userId,
            title: title,
            date: date

        }
        let token = req.headers["x-api-key"] || req.headers["x-Api-Key"];
        let decodedtoken = jwt.verify(token, "todo");

        if (decodedtoken.UserId != todo.userId) {
            return res.status(401).send({ status: false, message: "You are Not Authorized To create todo With This userId" });
        }

        let newTodo = await todoModel.create(todo)
        return res.status(201).send({ status: true, message: "Todo created successfully", data: newTodo });
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })

    }
}
//update-todo-/:id
const updateTodo = async (req, res) => {
    try {

        const id = req.params.id
        if (id) {
            let isValidTodoId = mongoose.Types.ObjectId.isValid(id);

            if (!isValidTodoId) {
                return res.status(400).send({ status: false, message: "todoId is Not Valid" });
            }
        }

        const todoDetails = await todoModel.findOne({ _id: id })
        if (!todoDetails) {
            return res.status(404).send({ status: false, message: "No todo found this todoId" })
        }

        if (!req.body.title) {
            return res.status(400).send({ status: false, message: "Please provide data to update" })
        }

        if (req.body.title) {
            todoDetails.title = req.body.title
        }

        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Invalid format of Title", });
        }

        todoDetails.save()
        return res.status(200).send({ status: true, message: "Success", data: todoDetails })


    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })

    }
}






//get/todo 
// pagination page ,pagesize
const getTodos = async (req, res) => {


    try {

        const page = req.query.page ? parseInt(req.query.page) : 0
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const todos = await todoModel.find({}).limit(pageSize).skip(pageSize * page);
        res.status(200).send({ status: true, data: todos });
        return todos;

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })

    }


}

//delete/todo/:id


const deleteTodo = async (req, res) => {
    try {
        const id = req.params.id
        if (id) {
            let isValidTodoId = mongoose.Types.ObjectId.isValid(id);

            if (!isValidTodoId) {
                return res.status(400).send({ status: false, message: "todoId is Not Valid" });
            }
        }

        const todoDetails = await todoModel.findOne({ _id: id })
        if (!todoDetails) {
            return res.status(404).send({ status: false, message: "No todo found this todoId" })
        }

        if (todoDetails.isDeleted == true) {
            return res.status(404).send({ status: false, message: "This todo is already Deleted" })
        }

        await todoModel.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, message: "Successfully Deleted" })

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })

    }
}

module.exports = { createTodo, updateTodo, getTodos, deleteTodo }