"use strict";

import FooterView from "./view/footer.js";
import {generateFilter} from "./utils/filter.js";
import {render} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";
import DataBase from "./model/card.js";

const db = new DataBase();
db.getTasks().then(function (cards){
    const filters = generateFilter(cards);

    const siteMainElement = document.querySelector(`.main`);
    const siteHeaderElement = document.querySelector(`.header-wrap`);
    const siteFooterElement = document.querySelector(`.footer-wrap`);

    const boardPresenter = new BoardPresenter(siteMainElement, filters, siteHeaderElement, db);
    render(siteFooterElement, new FooterView());

    boardPresenter.init(cards);
});
