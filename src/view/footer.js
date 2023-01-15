import AbstractView from "./abstract.js";

export default class FooterView extends AbstractView {
  getTemplate() {
    return (
      `<footer class="footer">
        <div class="content-center">
            <div class="footer__logo-holder">
                <img src="./img/politech.png" alt="Мосполитех" class="footer__logo">
            </div>
            <div class="footer__logo-holder">
                <img src="./img/geosherhope.png" alt="Георгий, Шерали, Надежда" class="footer__logo">
            </div>
        </div>
    </footer>`
    );
  }
}