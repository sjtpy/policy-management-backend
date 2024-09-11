const express = require("express");
const port = 3005;
const mongoose = require("mongoose");
const employeeRoutes = require("./src/routes/employee")
const loginRoutes = require("./src/routes/login")
const companyRoutes = require("./src/routes/company")
const policyTemplateRoutes = require("./src/routes/policyTemplate")
const policyRoutes = require('./src/routes/policy')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true,                
}));
app.use(cookieParser())


app.use("/api/employee", employeeRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/company", companyRoutes)
app.use("/api/policytemplate", policyTemplateRoutes)
app.use("/api/policy", policyRoutes)


app.get("/", (req, res) => {
  res.send("Hello World!");
});



mongoose.connect('mongodb://localhost:27017/').then(()=> {
    console.log("connected to mongodb");
    app.listen(port, () => {
        console.log(`listening on port ${port}!`);
      });
})
