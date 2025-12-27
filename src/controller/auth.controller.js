import jwt from "jsonwebtoken";
import { verifyFirebaseToken } from "../config/firebase.js";

export const login = async (req, res) => {
  const { token } = req.body;

  const decoded = await verifyFirebaseToken(token);
  const mobile = decoded.phone_number;

  const jwtToken = jwt.sign(
    { mobile },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token: jwtToken });
};
