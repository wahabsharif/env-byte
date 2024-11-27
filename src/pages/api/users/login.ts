import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type Data = {
  success: boolean;
  token?: string;
  user?: {
    first_name: string;
    last_name: string;
    role: string;
  };
  error?: string;
};

// JWT Secret - Keep this in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || "";

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

  if (method === "POST") {
    const { username, password } = body;

    if (!username || !password) {
      return respondError(res, 400, "Username and Password are required");
    }

    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("id, username, first_name, last_name, role, password")
        .eq("username", username)
        .single();

      if (error || !userData) {
        return respondError(res, 401, "Invalid username or password");
      }

      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        return respondError(res, 401, "Invalid username or password");
      }

      const token = jwt.sign(
        { id: userData.id, username: userData.username, role: userData.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
        },
      });
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
