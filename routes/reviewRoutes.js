const express=require("express")
const auth = require("../middleware/auth")
const { createReview, updateReview, deleteReview } = require("../controllers/reviewController")
const { reviewValidation } = require("../utils/validates")
const router= express.Router()

router.post("/create/:id",auth,reviewValidation.create,createReview)
router.put("/edit/:id",auth,reviewValidation.update,updateReview)
router.delete("/delete/:id",auth,deleteReview)

module.exports=router