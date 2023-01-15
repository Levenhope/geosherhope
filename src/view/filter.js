import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, isChecked) => {
  const {title, text} = filter;

  return (
    `<input
      type="radio"
      id="filter__${title}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
    />
    <label for="filter__${title}" class="filter__label">
      ${text}
    </label>`
  );
};

export default class FilterView extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return (
      `<section class="main__filter filter container">
        ${this._filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join(``)}
      </section>`
    );
  }

    setFilterChangeHandler() {
        document.querySelectorAll(`.filter__input`).forEach(filterInput => {
            filterInput.addEventListener(`change`, function() {
                document.querySelector('.main').classList.toggle('is-archive');
            });
        });
    }
}