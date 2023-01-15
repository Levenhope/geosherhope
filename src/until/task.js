export const shortTaskDueDate = (dueDate) => {
    return dueDate.toISOString().slice(0, 10);
  };