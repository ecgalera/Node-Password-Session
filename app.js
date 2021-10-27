const express = require("express");
const hbs = require("hbs");
const passport = require("passport")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const PassportLocal = require("passport-local").Strategy;


const app = express();
const port = 3000;
// configuramos expreess para que pueda leer los datos del formulario
app.use(express.urlencoded({extended:true}))
// a cookieParser le enviamos un secreto
app.use(cookieParser("mi ultra hiper secreto"))
app.use(session({
    secret: "mi ultra hiper secreto",
    //definir el comportamiento de la session
    resave : true,
    saveUninitialized:true
}))

// Inicio de session con passport:
app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username, password, done){
    //done me envia el resultado la autentificación
    if(username === "codigofacilito" && password === "12345678")
        //pasaron las credenciales
        return done(null, {id:1, name:"Uriel"});
        // en caso de que no se haya cumplido la condicion
        done(null, false);
    }));

//{id: 1, name: "Uriel"}
// 1 => Serialización
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// Deserialización
passport.deserializeUser(function(id, done){
    done(null, {id:1, name:"Uriel"} )
})

// ahora tengo que integrar passport a mi apllicación



app.set("view engine", "hbs");



app.get("/",(req, res, next)=>{
    //isAuthenticated es un metodo de seguridad 
if(req.isAuthenticated()) return next();
res.redirect("/login");
}, (req, res)=>{
    // Si ya iniciamos session mostrar bienvenida
    res.send("Hola")


    // Si no hemos iniciado session redireccionar a /login
})

app.get("/login", (req, res)=>{
    //Mostrar el formulairo de login
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

    //Recibir credenciales e iniciar sesion

    


app.listen(3000, ()=>console.log(`Server started in port: ${port}`))