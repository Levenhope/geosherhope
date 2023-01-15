import AbstractView from "./abstract.js";

export default class CardsListView extends AbstractView {
  getTemplate() {
    return (
      `<div class="board__tasks"></div>`
    );
  }
}
