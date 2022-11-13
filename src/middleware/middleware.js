const jwt = require("jsonwebtoken");
const todoModel = require("../models/todoModel");
const mongoose = require("mongoose");


//............................................MIDDLEWARE-FOR AUTHENTICATION..........................................................

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["x-Api-Key"];

    if (!token) {
      return res.status(403).send({ status: false, msg: "Token must be Present" });
    }

    let decodedtoken = jwt.verify(token, "todo",function(err){
      if(err){
        return res.status(403).send({status:false,message:"Invalid Token",Error:err})
      }else{
next()
      }
    }); 
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};




//............................................MIDDLEWARE-FOR AUTHORIZATION..........................................................


const authorization = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["x-Api-Key"]; //token has jwt token

    const id = req.params.id;

    if (id) {
      let isValidTodoId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidTodoId) {
        return res.status(400).send({ status: false, msg: "todoId is Not Valid type of ObjectId" });
      }
    }

    const findTodo = await todoModel.findById(id)
  
    if (!findTodo) {
      return res.status(400).send({ status: false, msg: "Incorrect todoId" });
    }

    let decodedtoken = jwt.verify(token, "todo",function(err){
      if(err){
        return res.status(403).send({status:false,message:"Invalid Token",Error:err})
      }else{
next()
      }
    }) //if match then move the execution to next
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};


module.exports={authentication ,authorization}

