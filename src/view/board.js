import AbstractView from "./abstract.js";

export default class BoardView extends AbstractView {
  getTemplate() {
    return (
      `<section class="board"></section>`
    );
  }
}