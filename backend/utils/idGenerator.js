/**
 * Simple ID generator for in-memory storage
 * Generates unique IDs similar to MongoDB ObjectIds
 */

let counter = 0;

const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  const counterPart = (counter++).toString(36);
  return `${timestamp}${randomPart}${counterPart}`;
};

module.exports = { generateId };
