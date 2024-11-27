import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type Data = {
  success: boolean;
  token?: string;
  error?: string;
};

// JWT Secret - Keep this in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || "ABCDE";

// Error response function
const respondError = (
  res: NextApiResponse<Data>,
  status: number,
  message: string
) => {
  return res.status(status).json({ success: false, error: message });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, body } = req;

  // Handle only POST requests
  if (method === "POST") {
    const { username, password } = body;

    if (!username || !password) {
      return respondError(res, 400, "Username and Password are required");
    }

    try {
      // Fetch the user from the database using the username
      const { data: userData, error } = await supabase
        .from("users")
        .select("id, username, role, password")
        .eq("username", username)
        .single();

      if (error || !userData) {
        return respondError(res, 401, "Invalid username or password");
      }

      // Compare the entered password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        return respondError(res, 401, "Invalid username or password");
      }

      // Generate a JWT token for the user
      const token = jwt.sign(
        { id: userData.id, username: userData.username, role: userData.role },
        JWT_SECRET,
        { expiresIn: "1d" } // Token expiry (1 day)
      );

      // Return the token to the client
      return res.status(200).json({ success: true, token });
    } catch (error) {
      return respondError(
        res,
        500,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return respondError(res, 405, "Method Not Allowed");
}
