const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

// router.post('/register', catchAsync(async (req, res) => {
//     // res.send(req.body);
//     const { email, username, password } = req.body;
//     const user = new User({ email, username });
//     const registeredUser = await User.register(user, password);
//     console.log(registeredUser);
//     req.flash('success', 'Bienvenidos!');
//     res.redirect('/campgrounds');
// }));

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', '¡Bienvenido a Productos Total!');
        res.redirect('/productos');
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}));

module.exports = router;