import AbstractView from "./abstract.js";

export default class EmptyListView extends AbstractView {
  getTemplate() {
    return (
      `<div class="board__no-tasks">
        Добавьте первую задачу, кликнув "+Добавить задачу"
      </div>`
    );
  }
}
