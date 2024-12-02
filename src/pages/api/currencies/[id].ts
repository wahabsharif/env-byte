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
    // Fetch a single currency by ID
    const { data, error } = await supabase
      .from("currencies")
      .select("*")
      .eq("id", id)
      .single(); // .single() ensures only one result is returned
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Currency not found" });
    return res.status(200).json(data);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
