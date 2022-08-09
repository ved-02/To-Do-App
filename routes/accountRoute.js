const router = require("express").Router();
const accountController = require("../controllers/account.controller");
// @route: /account/login
router.post("/login", accountController.login)
// @route: /account/logout
router.get("/logout", (req, res) => {
    console.log("logout");
    res.clearCookie("session-token");
    res.redirect("/");
})
// @route: /account/dashboard
router.get("/dashboard", accountController.checkAuthenticated, (req, res) => {
    res.render("dashboard.ejs", { picture: req.user.picture, name: req.user.name, remaining_task: req.user.remaining_task, completed_task: req.user.completed_task });
})
// @route: /account/add-task
router.post("/add-task", accountController.checkAuthenticated, accountController.addTask);
// @route: /account/complete-task
router.post("/complete-task", accountController.checkAuthenticated, accountController.completeTask);

module.exports = router;

