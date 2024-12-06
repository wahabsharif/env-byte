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
  const { id } = req.query;

  if (req.method === "GET") {
    // Fetch a single project by ID
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Project not found" });
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
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

    const { data, error } = await supabase
      .from("projects")
      .update({
        client_id,
        project_name,
        project_type,
        currency_id,
        quoted_amount,
        deal_amount,
        paid_amount,
        description,
        project_note,
        updated_at: new Date().toISOString(), // Manually set updated_at
      })
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
