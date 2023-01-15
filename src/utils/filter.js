const taskToFilterMap = {
  all: (cards) => cards.filter((card) => !card.isArchive).length,
  archive: (cards) => cards.filter((card) => card.isArchive).length,
};

export const generateFilter = () => {
  return Object.entries(taskToFilterMap).map(([filterTitle, countTasks]) => {
    return {
      title: filterTitle,
      text: filterTitle === "all" ? "Текущие":"Выполненные"
    };
  });
};
