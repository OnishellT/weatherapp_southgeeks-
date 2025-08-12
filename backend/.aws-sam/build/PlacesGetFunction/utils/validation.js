const validateUser = (user) => {
  const errors = [];

  const nameStr = user?.name !== undefined && user?.name !== null
    ? String(user.name).trim()
    : "";
  if (!nameStr) {
    errors.push("Name is required and must be a non-empty string.");
  }

  const zipStr = user?.zip !== undefined && user?.zip !== null
    ? String(user.zip).trim()
    : "";
  if (!zipStr) {
    errors.push("Zip code is required and must be a non-empty string.");
  } else if (!/^\d{5}(-\d{4})?$/.test(zipStr)) {
    errors.push("Zip code must be 5 digits or ZIP+4 format (12345 or 12345-6789).");
  }

  return errors;
};

module.exports = {
  validateUser,
};