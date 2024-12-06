function calculator() {
    //Calculator



    const result = document.querySelector('.calculating__result span');


    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }


    //задаем класс активности в зависимости от значений сохраненных в localStorage
    //потому что когда мы задавали наши параметры в таблице и потом обновили страницу, то в localStorage данные сохранились а в таблице класс активности встал на первоначально заданные места

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active')


    //функция расчета калорий по формуле

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return; // чтобы сразу прервать функцию
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }
        if (sex === 'male') {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    //получаем статическую информацию (которая уже дана для выбора на странице)
    function getStaticInformation(parentSelector, activeClass) {
        //выборка div по их родительскому элементу и только им мы навесим класс активности не трогая div другого подраздела таблицы (например только для гендера или только для физ.активности)
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target && e.target.hasAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                if (e.target && e.target.matches('.calculating__choose-item')) {
                    e.target.classList.add(activeClass);
                }

                calcTotal(); // вызываем при любом изменении (новом введенном значении) в нашу таблицу 
                // и именно внутри addEventListener (те произошло событие -> вызвали функцию пересчета)
            })
        });

    }

    // вызываем функцию для каждого раздела отдельно для навешивания обработчиков событий
    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    // получаем данные введенные пользователем самостоятельно
    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red'
            } else {
                input.style.border = 'none'
            }
            switch (input.getAttribute('id')) {
                case 'height':
                    // нам ввели данные на сайте и нам надо их записать в переменные для дальнейших вычислений
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal(); // вызываем при любом изменении (новом введенном значении) в нашей таблице
        });

    }

    // вызываем функцию для каждого селектора отдельно для навешивания обработчиков событий
    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

// module.exports = calculator; синтаксис Common JS

export default calculator; //синтаксис ES6