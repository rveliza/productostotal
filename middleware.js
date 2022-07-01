module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ USER...", req.user);
    // REQ USER... {
    //     _id: new ObjectId("629e21386f488344b393eb8c"),
    //     email: 'reynerv@yahoo.com',
    //     username: 'rveliz',
    //     __v: 0
    //   }
    if (!req.isAuthenticated()) {
        req.flash('error', '¡Debes ingresar primero!');
        return res.redirect('/login');
    }
    next();
}