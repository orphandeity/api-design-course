import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

/**
 *  Sign-up handler
 *
 *  1. get user data from client
 *  2. create new user in database with username & encrypted password
 *  3. create jwt token and send back to client
 */
export const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (err) {
    err.type = "input";
    next(err);
  }
};

/**
 *  Sign in handler
 *
 *  1. search database for a matching username
 *  2. compare plain-text password with encrypted password
 *  3. create jwt token and send back to client
 *
 */
export const signin = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  const isValid = await comparePasswords(req.body.password, user.password);

  if (!isValid) {
    res.status(401);
    res.json({ message: "denied: invalid credentials" });
  }

  const token = createJWT(user);
  res.json({ token });
};
