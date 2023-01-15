import AbstractView from "./abstract.js";
import {shortTaskDueDate} from "../utils/card.js";

export default class CardView extends AbstractView {
  constructor(card) {
    super();
    this._card = card;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._archiveClickHandler = this._archiveClickHandler.bind(this);
    this._removeClickHandler = this._removeClickHandler.bind(this);
  }

  getTemplate() {
    const {id, color, title, description, dueDate, isArchive} = this._card;

    return (
      `<article class="card card--${color} card--${isArchive?'archive':'current'}" id="${id}">
        <div class="card__title">${title}</div>
          <div class="card__date-holder">Выполнить до: <span class="card__date-text">${shortTaskDueDate(dueDate)}</span></div>
          <div class="card__desc">${description}</div>
          <div class="card__controls">
              <button class="card__btn card__delete" type="button">Удалить</button>
              <button class="card__btn card__edit" type="button">Изменить</button>
              <button class="card__btn card__finish" type="button">${isArchive ? `Вернуть` : `Завершить`}</button>

          </div>
        </article>`
    );
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.card__edit`).addEventListener(`click`, this._editClickHandler);
  }

  _archiveClickHandler(evt) {
    evt.preventDefault();
    this._callback.archiveClick();
  }

  setArchiveClickHandler(callback) {
    this._callback.archiveClick = callback;
    this.getElement().querySelector(`.card__finish`).addEventListener(`click`, this._archiveClickHandler);
  }

  _removeClickHandler(evt) {
    evt.preventDefault();
    this._callback.removeClick();
  }

  setRemoveClickHandler(callback) {
    this._callback.removeClick = callback;
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, this._removeClickHandler);
  }
}
