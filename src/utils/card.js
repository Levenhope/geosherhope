export const shortTaskDueDate = (dueDate) => {
  return dueDate.toISOString().slice(0, 10);
};
export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);
