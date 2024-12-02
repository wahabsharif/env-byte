import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Fetch all projects
    const { data, error } = await supabase.from("projects").select("*");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const {
      client_id,
      project_name,
      project_type,
      currency_id,
      quoted_amount,
      deal_amount,
      paid_amount,
      description,
      project_note,
    } = req.body;

    const { data, error } = await supabase.from("projects").insert([
      {
        client_id,
        project_name,
        project_type,
        currency_id,
        quoted_amount,
        deal_amount,
        paid_amount,
        description,
        project_note,
      },
    ]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
