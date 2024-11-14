import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcrypt";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

type Data = {
  success: boolean;
  data?: User | User[] | null;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    // CREATE: Add a new user
    case "POST":
      const { name, username, email, role, password } = req.body;

      if (!name || !username || !email || !password) {
        return res
          .status(400)
          .json({ success: false, error: "Missing required fields" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the 'users' table
      const { data, error } = await supabase
        .from("users")
        .insert([{ name, username, email, role, password: hashedPassword }])
        .single();

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(201).json({ success: true, data });

    // READ: Fetch a specific user by id or fetch all users if no id is provided
    case "GET":
      const userId = req.query.id as string | undefined;

      if (userId) {
        // Fetch a single user by id
        const { data: userData, error: getError } = await supabase
          .from("users")
          .select("*")
          .limit(10)
          .eq("id", userId)
          .single();

        if (getError) {
          return res
            .status(500)
            .json({ success: false, error: getError.message });
        }

        return res.status(200).json({ success: true, data: userData });
      } else {
        // Fetch all users
        const { data: usersData, error: getAllError } = await supabase
          .from("users")
          .select("*");

        if (getAllError) {
          return res
            .status(500)
            .json({ success: false, error: getAllError.message });
        }

        return res.status(200).json({ success: true, data: usersData });
      }

    // UPDATE: Update user data by id
    case "PUT":
      const updateId = req.query.id as string;
      const {
        name: updatedName,
        username: updatedUsername,
        email: updatedEmail,
        role: updatedRole,
        password: updatedPassword,
      } = req.body;

      if (!updateId) {
        return res
          .status(400)
          .json({ success: false, error: "User ID is required" });
      }

      // Hash the updated password if provided
      const updatedDataFields: Partial<User & { password: string }> = {
        name: updatedName,
        username: updatedUsername,
        email: updatedEmail,
        role: updatedRole,
      };

      if (updatedPassword) {
        updatedDataFields.password = await bcrypt.hash(updatedPassword, 10);
      }

      // Update the user data
      const { data: updatedData, error: updateError } = await supabase
        .from("users")
        .update(updatedDataFields)
        .eq("id", updateId)
        .single();

      if (updateError) {
        return res
          .status(500)
          .json({ success: false, error: updateError.message });
      }

      return res.status(200).json({ success: true, data: updatedData });

    // DELETE: Delete a user by id
    case "DELETE":
      const deleteId = req.query.id as string;

      if (!deleteId) {
        return res
          .status(400)
          .json({ success: false, error: "User ID is required" });
      }

      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", deleteId);

      if (deleteError) {
        return res
          .status(500)
          .json({ success: false, error: deleteError.message });
      }

      return res.status(200).json({ success: true, data: null });

    default:
      return res
        .status(405)
        .json({ success: false, error: "Method Not Allowed" });
  }
}
