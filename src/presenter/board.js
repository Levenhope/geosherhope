import BoardView from "../view/board.js";
import MainMenuView from "../view/main-menu.js";
import CardsListView from "../view/cards-list.js";
import EmptyListView from "../view/empty-list.js";
import {updateItem} from "../utils/common.js";
import CardPresenter from "../presenter/card.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import FilterView from "../view/filter.js";
import {generateId} from "../utils/card.js";

export default class BoardPresenter {
  constructor(boardContainer, filters, siteHeaderElement, db) {
    this.db = db;
    this._boardContainer = boardContainer;
    this._boardComponent = new BoardView();
    this._siteHeaderElement = siteHeaderElement;
    this._siteHeaderComponent = new MainMenuView();
    this._filterComponent = new FilterView(filters);
    this._cardsListComponent = new CardsListView();
    this._emptyListComponent = new EmptyListView();
    this._cardPresenter = {};

    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._addEditCard = this._addEditCard.bind(this);
    this._removeEmptyList = this._removeEmptyList.bind(this);
  }
  init(boardCards) {
    this._boardCards = boardCards.slice();

    render(this._siteHeaderElement, this._siteHeaderComponent);
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._cardsListComponent);

    this._siteHeaderComponent.setAddBtnHandler(this._addEditCard);
    this._siteHeaderComponent.initDate();

    this._renderBoard();
  }

  _renderFilter() {
    render(this._boardComponent, this._filterComponent, RenderPosition.afterBegin);
    this._filterComponent.setFilterChangeHandler();
  }

  _renderCard(card) {
    const cardPresenter = new CardPresenter(this._cardsListComponent, this._handleCardChange, this._handleModeChange, this.db);
    cardPresenter.init(card);
    this._cardPresenter[card.id] = cardPresenter;
  }

  _renderCards() {
    this._boardCards.forEach(
      (boardCard) => {
        this._renderCard(boardCard)
      }
    );
  }

  _renderEmptyList() {
    render(this._boardComponent, this._emptyListComponent);
  }

  _removeEmptyList() {
    remove(this._emptyListComponent);
  }

  _renderBoard() {
    this._renderFilter();
    if (this._boardCards.length < 1) {
      this._renderEmptyList();
    } else {
      this._removeEmptyList();
      this._renderCards();
    }
  }

  _handleCardChange(updatedCard) {
    this._boardCards = updateItem(this._boardCards, updatedCard);
    this.db.addTask(updatedCard);
    this._cardPresenter[updatedCard.id].init(updatedCard);
  }

  _handleModeChange() {
    Object.values(this._cardPresenter).forEach((presenter) => presenter.resetView());
  }

  _addEditCard() {
    if(document.querySelector('.card--edit')) return;
    const cardPresenter = new CardPresenter(this._cardsListComponent, this._handleCardChange, this._handleModeChange);
    const newCardData = {
      id: generateId(),
      title: "Новая карточка",
      description: "",
      dueDate: new Date(),
      color: "black",
      isArchive: false
    };
    const newCardMode = true;
    this._removeEmptyList();
    cardPresenter.init(newCardData, newCardMode);
    this._cardPresenter[newCardData.id] = cardPresenter;
  }
}
