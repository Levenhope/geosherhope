import SmartView from "./smart.js";
import {BLANK_CARD, COLORS} from "../const.js";
import {shortTaskDueDate} from "../utils/task";

export default class EditCardView extends SmartView {
  constructor(card = BLANK_CARD) {
    super();
    this._data = EditCardView.parseCardToData(card);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._titleInputHandler = this._titleInputHandler.bind(this);
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._colorChangeHandler = this._colorChangeHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._setElementHandler = this._setElementHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    const {id, color, title, description, dueDate} = this._data;
    const isSubmitDisabled = (title.length < 1) && (description.length < 1);

    return (
      `<article class="card card--edit card--${color}" id="${id}">
        <form class="card__form">
          <div class="card__textarea-wrap">
            <label>
                <input
                        class="card__text-input"
                        placeholder="Название задачи"
                        name="text"
                        value="${title}"/>
            </label>
          </div>
          <div class="card__textarea-wrap">
              <label>
                  <textarea
                          class="card__textarea"
                          placeholder="Описание задачи"
                          name="text"
                  >${description}</textarea>
              </label>
          </div>
          <div class="card__settings">
            <div class="card__dates">
                <label class="card__date-deadline">Выполнить до:
                <input class="card__date" type="date" id="deadline" name="deadline"
                       value="${shortTaskDueDate(dueDate)}"></label>
            </div>
            <div class="card__colors-inner">
              <div class="card__colors-title">Цветовой маркер</div>
              <div class="card__colors-wrap">
                ${COLORS.map((colorItem) => `
                  <input
                    type="radio"
                    id="color-${colorItem}"
                    class="card__color-input card__color-input--${colorItem} visually-hidden"
                    name="color"
                    value="${colorItem}"
                    ${color === colorItem ? `checked` : ``}
                  />
                  <label for="color-${colorItem}" class="card__color card__color--${colorItem}">${colorItem}</label>
                `).join(``)}
              </div>
            </div>

          <div class="card__controls">
              <button class="card__btn card__reset" type="button">Отмена</button>
              <button class="card__btn card__save" type="submit" ${isSubmitDisabled ? `disabled` : ``}>Сохранить</button>
          </div>
        </form>
      </article>`
    );
  }

  _formResetHandler(evt) {
    evt.preventDefault();
    this._callback.formReset();
  }

  setFormResetHandler(callback) {
    this._callback.formReset = callback;
    this.getElement().querySelector(`.card__reset`).addEventListener(`click`, this._formResetHandler);
  }


  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditCardView.parseDataToCard(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseCardToData(card) {
    return Object.assign(
        {},
        card
    );
  }

  static parseDataToCard(data) {
    data = Object.assign({}, data);
    return data;
  }

  _titleInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      title: evt.target.value
    }, true);
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      description: evt.target.value
    }, true);
  }

  _colorChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      color: evt.target.value
    });
  }

  _dateChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      dueDate: new Date(evt.target.value)
    });
  }

  _setElementHandler(selector, eventType, handler) {
    this.getElement().querySelector(selector).addEventListener(eventType, handler);
  }

  _setInnerHandlers() {
    this._setElementHandler(`.card__text-input`, `input`, this._titleInputHandler);
    this._setElementHandler(`.card__textarea`, `input`, this._descriptionInputHandler);
    this._setElementHandler(`.card__colors-wrap`, `change`, this._colorChangeHandler);
    this._setElementHandler(`.card__date`, `change`, this._dateChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  reset(card) {
    this.updateData(
        EditCardView.parseCardToData(card)
    );
  }
}
