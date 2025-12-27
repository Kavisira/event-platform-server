import { db } from "../config/firebase.js";

export const exportCsv = async (req, res) => {
  const snapshot = await db
    .collection("submissions")
    .where("eventId", "==", req.params.eventId)
    .get();

  if (snapshot.empty) {
    return res.send("No data");
  }

  const rows = snapshot.docs.map(d => d.data().data);
  const headers = Object.keys(rows[0]);

  let csv = headers.join(",") + "\n";
  rows.forEach(r => {
    csv += headers.map(h => `"${r[h] || ""}"`).join(",") + "\n";
  });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=data.csv");
  res.send(csv);
};
