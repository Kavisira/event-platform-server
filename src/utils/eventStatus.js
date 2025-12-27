export const isEventActive = (event) => {
  if (event.status !== "ACTIVE") return false;
  if (event.expiryDate && new Date(event.expiryDate) < new Date())
    return false;
  return true;
};