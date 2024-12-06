import { getResource } from "../services/services";

function cards() {
    // Classes for menu cards
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();//можем сразу в конструкторе вызвать его метод
        }
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена</div>
                        <div class="menu__item-total">
                            <span>${this.price}</span>
                            грн/день
                        </div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    // Getting information about cards from db.json
    getResource('http://localhost:3000/menu')
        .then((data) => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        }); //({ img, altimg, title, descr, price }) это деструктуризация объекта полученного при переборе массива (т.о. мы получили каждое св-во объекта как отдельную переменную (примерно это выглядит: const altimg = "vegy",) и далее передаем соответствующее значение в класс new MenuCard) и через метод .render() создаем и помещаем карточку на страницу
}


// module.exports = cards; синтаксис Common JS

export default cards; //синтаксис ES6
