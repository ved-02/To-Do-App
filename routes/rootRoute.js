const router = require("express").Router();

// @route: /
// @description: render index page
router.get("/", async (req, res)=>{
    res.render("index.ejs");
})

module.exports = router;