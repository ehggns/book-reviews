import express, { json } from 'express';
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import session from 'express-session';
import { authenticated as customer_routes } from './router/auth_users.js';
import { public_routes as public_routes } from './router/general.js';

const app = express();

app.use(json());

app.use("/customer", session({secret:"secret-key",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", (request, response, next) => {
  debugger
  if (request.session && request.session.user) {
    verify(request.session.user.token, "secret-key", (err, decoded) => {
      if (err) {
        return response.status(401).send("Unauthorized access");
      }
      request.user = decoded;
      next();
    });
  } else {
    return response.status(401).send("Unauthorized access");
  }
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", public_routes);

app.listen(PORT,()=>console.log("Server is running"));
