import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcrypt";

type User = {
  id: number;
  first_name: string;
  last_name: string;
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
  const { method, body, query } = req;

  if (method === "POST") {
    const { first_name, last_name, username, email, role, password } = body;

    if (!first_name || !last_name || !username || !email || !password) {
      return respondError(res, 400, "Missing required fields");
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            first_name,
            last_name,
            username,
            email,
            role,
            password: hashedPassword,
          },
        ])
        .select(
          "id, first_name, last_name, username, email, role, created_at, updated_at"
        )
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    } catch (error) {
      return respondError(
        res,
        500,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (method === "GET") {
    const userId = query.id as string | undefined;

    try {
      if (userId) {
        const { data: userData, error } = await supabase
          .from("users")
          .select(
            "id, first_name,last_name, username, email, role, created_at, updated_at"
          )
          .eq("id", userId)
          .single();

        if (error) throw error;
        return res.status(200).json({ success: true, data: userData });
      } else {
        const { data: usersData, error } = await supabase
          .from("users")
          .select(
            "id, first_name, last_name, username, email, role, created_at, updated_at"
          );

        if (error) throw error;
        return res.status(200).json({ success: true, data: usersData });
      }
    } catch (error) {
      return respondError(
        res,
        500,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (method === "PATCH") {
    const updateId = query.id as string;
    const { first_name, last_name, username, email, role, password } = body;

    if (!updateId) {
      return respondError(res, 400, "User ID is required");
    }

    try {
      const updatedData: Partial<User & { password: string }> = {};

      if (first_name) updatedData.first_name = first_name;
      if (last_name) updatedData.last_name = last_name;
      if (username) updatedData.username = username;
      if (email) updatedData.email = email;
      if (role) updatedData.role = role;
      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }

      const { data: updatedDataResult, error } = await supabase
        .from("users")
        .update(updatedData)
        .eq("id", updateId)
        .select(
          "id, first_name, last_name, username, email, role, created_at, updated_at"
        )
        .single();

      if (error) throw error;
      return res.status(200).json({ success: true, data: updatedDataResult });
    } catch (error) {
      return respondError(
        res,
        500,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  if (method === "DELETE") {
    const deleteId = query.id as string;

    if (!deleteId) {
      return respondError(res, 400, "User ID is required");
    }

    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;
      return res.status(200).json({ success: true, data: null });
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
