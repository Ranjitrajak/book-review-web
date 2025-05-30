const express=require("express")
const { createBook, getAllBooks, getBookById } = require("../controllers/bookcontroller")
const auth = require("../middleware/auth")
const { bookValidation, paginationValidation } = require("../utils/validates")
const router=express.Router()

router.post("/create",auth,bookValidation.create,createBook)
router.get("/allbooks",auth,paginationValidation,getAllBooks)
router.get("/:id",getBookById)

module.exports=router