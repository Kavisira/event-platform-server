import { db } from "../config/firebase.js";

export const getSubmissions = async (req, res) => {
  const snapshot = await db
    .collection("submissions")
    .where("eventId", "==", req.params.eventId)
    .orderBy("submittedAt", "desc")
    .get();

  const data = snapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  res.json(data);
};
