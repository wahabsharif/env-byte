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
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const { country_name, iso_code_2, iso_code_3 } = req.body;
    const { data, error } = await supabase
      .from("countries")
      .update({ country_name, iso_code_2, iso_code_3 })
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("countries").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
