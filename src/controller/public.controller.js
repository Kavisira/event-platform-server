import { db } from "../config/firebase.js";

/**
 * GET PUBLIC EVENT (for Landing Page)
 * URL: /public/event/:id
 */
export const getPublicEvent = async (req, res) => {
  try {

    const { id } = req.params;

    const docRef = db.collection("events").doc(id);
    const doc = await docRef.get();

    // 1️⃣ Event not found
    if (!doc.exists) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const event = doc.data();
    const now = new Date();

    // 2️⃣ Event manually disabled
    if (event.status === "DISABLED") {
      return res.status(403).json({
        message: "Event is closed",
      });
    }

    console.log("Event expiry date:", event.expiryDate, "Now:", now);   

    // 3️⃣ Event expired by date - check if expiry date is less than or equal to current time
    if (event.expiryDate && new Date(event.expiryDate) <= now) {
      // Auto-mark expired
      await docRef.update({ 
        status: "EXPIRED",
        updatedAt: new Date(),
      });

      return res.status(410).json({
        message: "Event expired",
      });
    }

    // 4️⃣ Event status is EXPIRED
    if (event.status === "EXPIRED") {
      return res.status(410).json({
        message: "Event expired",
      });
    }

    // 5️⃣ Send only safe public data (only if expiry date is greater than now)
    return res.json({
      id: doc.id,
      name: event.name,
      description: event.description || "",
      fields: event.fields || [],
    });
  } catch (error) {
    console.error("Public Event Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const submitResponse = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const formData = req.body;
    const now = new Date();

    // 1️⃣ Fetch event
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventDoc.data();

    // 2️⃣ Check if event is manually disabled
    if (event.status === "DISABLED") {
      return res.status(403).json({ message: "Event closed" });
    }

    // 3️⃣ Check if event has expired by date
    if (event.expiryDate && new Date(event.expiryDate) <= now) {
      // Auto-mark as expired
      await eventRef.update({ 
        status: "EXPIRED",
        updatedAt: new Date(),
      });
      return res.status(410).json({ message: "Event expired" });
    }

    // 4️⃣ Check if event status is EXPIRED
    if (event.status === "EXPIRED") {
      return res.status(410).json({ message: "Event expired" });
    }

    // 5️⃣ Find primary field (mobile)
    const primaryField = (event.fields || []).find(
      f => f.isPrimary === true
    );

    if (!primaryField) {
      return res.status(500).json({
        message: "Primary field not configured",
      });
    }

    const primaryValue = formData[primaryField.id];

    if (!primaryValue) {
      return res.status(400).json({
        message: `${primaryField.label} is required`,
      });
    }

    // 6️⃣ Check duplicate submission
    const duplicateSnap = await db
      .collection("submissions")
      .where("eventId", "==", eventId)
      .where("primaryValue", "==", primaryValue)
      .limit(1)
      .get();

    if (!duplicateSnap.empty) {
      return res.status(409).json({
        message: "You have already submitted this form",
      });
    }

    // 7️⃣ Required field validation
    for (const field of event.fields) {
      if (field.required && !formData[field.id]) {
        return res.status(400).json({
          message: `${field.label} is required`,
        });
      }
    }

    // 8️⃣ Save submission
    await db.collection("submissions").add({
      eventId,
      primaryField: primaryField.id,
      primaryValue,
      data: formData,
      submittedAt: new Date(),
    });

    return res.json({
      success: true,
      message: "Submission successful",
    });
  } catch (error) {
    console.error("Duplicate Check Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

