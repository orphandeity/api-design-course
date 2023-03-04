import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// function for comparing plain text password with encrypted password
export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

// function that encrypts user password
export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

// creates a jwt token that represents a user
export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );
  return token;
};

/**
 *  Custom middleware - determine login status
 *
 *  check request header for jwt token and if found,
 *  verify using a function from jwtwebtoken package library
 */

export const protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "denied: not authorized" });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "denied: not a valid token" });
    return;
  }

  try {
    // is this a real token?
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    // yes, it passed the test...
    next();
  } catch (e) {
    // no, token could not be verified...
    console.error(e);
    res.status(401);
    res.json({ message: "denied: not a valid token" });
    return;
  }
};
