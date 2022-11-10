const express =require('express')
const router = express.Router()
const {createuser,login} = require("../controllers/usercontroller");
const {createTodo,updateTodo,getTodos,deleteTodo}=require('../controllers/todoController')
const {authentication,authorization} =require('../middleware/middleware')
router.post("/register",createuser)

router.post('/signin',login)

router.post('/create-todo',authentication,createTodo)

router.patch('/update-todo/:id',authentication,authorization,updateTodo)

router.get('/todo',authentication,getTodos)

router.delete('/todo/:id',authentication,authorization,deleteTodo)

/* router.all('*') */


module.exports=router