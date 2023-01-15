import AbstractView from "./abstract.js";

export default class MainMenuView extends AbstractView {
  constructor() {
    super();
    this._addBtnHandler = this._addBtnHandler.bind(this);
    this._getCurrentTime = this._getCurrentTime.bind(this);
  }
  getTemplate() {
    return (
      `<header class="header">
        <div class="header__logo-holder">
            TO DO
        </div>
          <div class="header__controls">
            <button class="header__new-card" type="button">+ Добавить задачу</button>
          </div>
        <div class="header__date">
            <div class="header__today"></div>
            <div class="header__time"></div>
        </div>
        </header>`
    );
  }

  _getCurrentTime() {
    const dateContainer = document.querySelector('.header__today');
    const timeContainer = document.querySelector('.header__time');
    const today = new Date();
    dateContainer.textContent = today.toLocaleString('ru-RU', {day: 'numeric', month: 'long'});
    timeContainer.textContent = today.toLocaleString('ru-RU', {hour: '2-digit', minute: '2-digit'});
  }

  _addBtnHandler(evt) {
    evt.preventDefault();
    this._callback.addCard();
  }

  initDate() {
    this._getCurrentTime();
    setInterval(this._getCurrentTime, 1000);
  }

  setAddBtnHandler(callback) {
    this._callback.addCard = callback;
    this.getElement().querySelector(`.header__new-card`).addEventListener(`click`, this._addBtnHandler);
  }
}
