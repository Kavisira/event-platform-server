import { db } from "../config/firebase.js";

/**
 * Create Event
 */
export const createEvent = async (req, res) => {
  try {
    const event = {
      ...req.body,
      status: "ACTIVE",
      createdBy: req.user.uid, // 🔥 FIXED
      createdAt: new Date(),
    };

    const ref = await db.collection("events").add(event);
    res.json({ id: ref.id, ...event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

/**
 * Get Events (only current user's events)
 */
export const getEvents = async (req, res) => {
  try {
    const userId = req.user.uid;
    const now = new Date();

    const snapshot = await db
      .collection("events")
      .where("createdBy", "==", userId) // 🔥 FIXED
      .get();

    const events = await Promise.all(
      snapshot.docs.map(async (d) => {
        const eventData = d.data();
        const expiryDate = new Date(eventData.expiryDate);
        
        // Check if event has expired
        if (expiryDate < now && eventData.status !== "EXPIRED") {
          // Update status to EXPIRED in database
          await db.collection("events").doc(d.id).update({
            status: "EXPIRED",
            updatedAt: new Date(),
          });
          eventData.status = "EXPIRED";
        }
        
        return {
          id: d.id,
          ...eventData,
        };
      })
    );

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

/**
 * Delete Event
 */
export const deleteEvent = async (req, res) => {
  try {
    await db.collection("events").doc(req.params.id).delete();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event" });
  }
};

/**
 * Update Event
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const now = new Date();

    // Validate expiry date if being updated
    if (updates.expiryDate) {
      const expiryDate = new Date(updates.expiryDate);
      
      // Check if expiry date is in the past
      if (expiryDate < now) {
        return res.status(400).json({
          message: "Expiry date and time must be greater than current date",
          error: "INVALID_EXPIRY_DATE",
        });
      }
      
      // Set status to ACTIVE if expiry date is in the future
      updates.status = "ACTIVE";
    }

    await db.collection("events").doc(id).update({
      ...updates,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: "Event updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update event" });
  }
};
