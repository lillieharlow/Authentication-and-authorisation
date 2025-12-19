const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// cors: frontend is allowed to communicate with this backend.
const cors = require("cors");

app.use(cors());

// generateJWT function: A function used to create jwt tokens using user object.
function generateJWT(userDetailsObj) {
  return jwt.sign(userDetailsObj, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/* validateBasicAuth function: middleware to decode the user's username
and password from the authorization header of the request.*/
const validateBasicAuth = (request, response, next) => {
  // Assign the header to something easier to work with, if it exists.
  let authHeader = request.headers["authorization"] ?? null;

  // If no auth header provided, stop the request.
  if (authHeader == null) {
    throw new Error("No auth data detected on a request to a protected route!");
  }

  // Confirm it's a Basic auth string,
  // and store only the encoded string.
  if (authHeader.startsWith("Basic ")) {
    authHeader = authHeader.substring(5).trim();
  }

  // Decode the string.
  let decodedAuth = Buffer.from(authHeader, "base64").toString("ascii");

  // Convert it into a usable object.
  let objDecodedAuth = { username: "", password: "" };
  objDecodedAuth.username = decodedAuth.substring(0, decodedAuth.indexOf(":"));
  objDecodedAuth.password = decodedAuth.substring(decodedAuth.indexOf(":") + 1);

  // Attach the object to the request
  request.userAuthDetails = objDecodedAuth;

  // Call the next step in the server's middleware chain or go to the route's callback.
  next();
};

/* '/' route: uses the validateBasicAuth middleware function to extract username
and password from the authorization header, then uses that to generate jwt token
using the generateJWT function. Finally, it sends the newly created token back as
its response.*/
app.get("/", validateBasicAuth, (request, response) => {
  console.log(request.headers);

  // Pass the header auth data along to the JWT generator
  const userJWT = generateJWT(request.userAuthDetails);

  // Return the JWT to the client
  response.json({
    freshJWT: userJWT,
  });
});

// validateJWT function: middleware to verify the jwt token is using the secret key.
const validateJWT = (request, response, next) => {
  let suppliedToken = request.headers.jwt;
  console.log(suppliedToken);

  // jwt.verify(token, secret, callback function);
  jwt.verify(suppliedToken, process.env.JWT_SECRET, (error, decodedJWT) => {
    if (error) {
      console.log(error);
      throw new Error("User not authenticated.");
    }

    request.decodedJWT = decodedJWT;
  });

  next();
};

/* '/someProtectedRoute' route: uses validateJWT to validate the jwt token and
then sends the decoded jwt which is the same payload provided while creating
the jwt token, userDetailsObj .*/
app.get("/someProtectedRoute", validateJWT, (request, response) => {
  response.json({
    decodedJWT: request.decodedJWT,
  });
});

// Server runs on port 3001. Frontend will run on 3000.
app.listen(3001, () => {
  console.log("Server activated!");
});
