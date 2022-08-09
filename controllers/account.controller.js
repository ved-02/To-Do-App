const { OAuth2Client } = require('google-auth-library');
const userDB = require("../models/User")

const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const login = async (req, res) => {
    const token = req.body.token;
    // console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        // console.log(payload);
        const email = payload["email"];
        const name = payload["name"];
        const picture = payload["picture"];
        const user = await userDB.findOne({ email: email });
        if (!user) {
            const newuser = await userDB.create({
                email,
                name,
                picture
            });
            // console.log(newuser);
        }
    }
    await verify()
        .then(() => {
            res.cookie('session-token', token);
            res.send("success");
        })
        .catch(console.error);
}

const checkAuthenticated = async (req, res, next) => {
    const token = req.cookies["session-token"];
    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        user = await userDB.findOne({ email: email });
        if(!user)
            res.redirect("/");
    }
    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect("/");
        })
}
const addTask = async (req, res) => {
    try {
        const { email } = req.user;
        const { task } = req.body;
        const user = await userDB.findOne({ email: email });
        user.remaining_task.unshift(task);
        await user.save();
        res.redirect("/account/dashboard");
    } catch (error) {
        res.json({ error });
    }
}
const completeTask = async (req, res) => {
    try {
        // console.log(req.body);
        const taskCompleted = req.body["complete-task"];
        const { email } = req.user;
        const user = await userDB.findOne({ email: email });
        if (Array.isArray(taskCompleted)) {
            for (let j = 0; j < taskCompleted.length; j++) {
                let task = taskCompleted[j];
                for (let i = 0; i < user.remaining_task.length; i++) {
                    if (user.remaining_task[i] === task) {
                        user.completed_task.unshift(task);
                        user.remaining_task.splice(i, 1);
                        break;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < user.remaining_task.length; i++) {
                if (user.remaining_task[i] === taskCompleted) {
                    user.completed_task.unshift(taskCompleted);
                    user.remaining_task.splice(i, 1);
                    break;
                }
            }
        }
        await user.save();
        res.redirect("/account/dashboard");
    } catch (error) {
        res.json({ error });
    }
}
module.exports = {
    login,
    checkAuthenticated,
    addTask,
    completeTask
}