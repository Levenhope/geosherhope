import CardView from "../view/card.js";
import EditCardView from "../view/edit-card.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {CARD_MODE} from "../const.js";

export default class CardPresenter {
  constructor(cardsListContainer, changeData, changeMode, db) {
    this.db = db;
    this._cardsListContainer = cardsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._editCardComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleArchiveClick = this._handleArchiveClick.bind(this);
    this._handleRemoveClick = this._handleRemoveClick.bind(this);
    this.destroy = this.destroy.bind(this);
    this._resetHandler = this._resetHandler.bind(this);
  }

  init(card, newCardMode = false) {
    this._card = card;
    const prevCardComponent = this._cardComponent;
    const prevEditCardComponent = this._editCardComponent;

    this._cardComponent = new CardView(this._card);
    this._editCardComponent = new EditCardView(this._card);

    this._cardComponent.setEditClickHandler(this._handleEditClick);
    this._editCardComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._cardComponent.setArchiveClickHandler(this._handleArchiveClick);
    this._cardComponent.setRemoveClickHandler(this._handleRemoveClick);

    if (newCardMode) {
      this._mode = CARD_MODE.EDIT;
      render(this._cardsListContainer, this._editCardComponent, RenderPosition.afterBegin);
      return;
    } else if (prevCardComponent === null || prevEditCardComponent === null) {
      this._mode = CARD_MODE.DEFAULT;
      render(this._cardsListContainer, this._cardComponent);
      return;
    }

    if (this._mode === CARD_MODE.DEFAULT) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === CARD_MODE.EDIT) {
      replace(this._editCardComponent, prevEditCardComponent);
    }

    remove(prevCardComponent);
    remove(prevEditCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._editCardComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editCardComponent.reset(this._card);
      this._replaceFormToCard();
    }
  }

  _replaceFormToCard() {
    replace(this._cardComponent, this._editCardComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = CARD_MODE.DEFAULT;
  }

  _resetHandler() {
    this._editCardComponent.reset(this._card);
    this._replaceFormToCard();
  }

  _replaceCardToForm() {
    replace(this._editCardComponent, this._cardComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._editCardComponent.setFormResetHandler(this._resetHandler);
    this._changeMode();
    this._mode = CARD_MODE.EDIT;
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleRemoveClick() {
    this.db.deleteTask(this._card);
    this.destroy();
  }

  _handleFormSubmit(card) {
    this._changeData(card);
    this._replaceFormToCard();
  }

  _handleArchiveClick() {
    this._changeData(Object.assign({}, this._card, {isArchive: !this._card.isArchive}));
    this.db.changeTaskStatus(this._card);
  }

  resetView() {
    if (this._mode !== CARD_MODE.DEFAULT) {
      this._replaceFormToCard();
    }
  }
}
