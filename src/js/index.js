window.addEventListener('DOMContentLoaded', () => {

    //Tabs

    const tabheader = document.querySelector('.tabheader'),
        items = tabheader.querySelectorAll('.tabheader__item'),
        contents = document.querySelectorAll('.tabcontent');



    function setActiveItem(target = items[0]) {
        items.forEach((item, i) => {
            item.classList.add('fade');
            item.classList.remove('tabheader__item_active');
            if (target === item) {
                target.classList.add('tabheader__item_active');
                displayContent(i);
            }
        })

    }
    setActiveItem();

    function displayContent(i) {
        contents.forEach(content => {
            content.classList.add('tabcontent_hidden', 'fade');
        })
        contents[i].classList.remove('tabcontent_hidden');
    }

    tabheader.addEventListener('click', (e) => {
        let target = e.target;
        if (target && target.matches('.tabheader__item')) {
            setActiveItem(target);
        }
    });


    //Timer


    const deadline = '2024-06-25';

    function getTimeRemaining(endtime) {
        let milliseconds = Date.parse(endtime) - Date.now(); // вычислили общее кол-во миллисекунд между deadline и сейчас
        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)); // деление на количество миллисекунд в 1 дне, узнаем количество оставшихся дней
        const hours = Math.floor(milliseconds / (1000 * 60 * 60) % 24); // деление на количество миллисекунд в 1 часе, узнаем все кол-во оставшихся часов до deadline (т.е. тут все часы, включая часы из целых дней полученных в const days, потом мы их откинем с помощью %24)
        const minutes = Math.floor(milliseconds / (1000 * 60) % 60); // через %60 мы от всего общего кол-ва минут откидываем часы и получаем оставшийся хвост минут в виде остатка от деления 
        const seconds = Math.floor(milliseconds / 1000 % 60); // деля общее кол-во секунд на 60 мы получим целые минуты, а оставшийся хвост секунд идет в переменную

        return {
            milliseconds,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function addZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setTimer(endtime, selector) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days span'),
            hours = timer.querySelector('#hours span'),
            minutes = timer.querySelector('#minutes span'),
            seconds = timer.querySelector('#seconds span'),
            counting = setInterval(updateTimer, 1000);

        updateTimer();

        function updateTimer() {
            const timerObj = getTimeRemaining(endtime);
            days.innerHTML = addZero(timerObj.days);
            hours.innerHTML = addZero(timerObj.hours);
            minutes.innerHTML = addZero(timerObj.minutes);
            seconds.innerHTML = addZero(timerObj.seconds);
            if (timerObj.milliseconds <= 0) clearInterval(counting);
        }
    }

    setTimer(deadline, '.timer');


    //Modal


    const modalTrigger = document.querySelectorAll('[data-modal]'), // кнопки 'Связаться с нами'
        modal = document.querySelector('.modal'); // затемненная зона и самый верхний div

    function modalOpen() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.classList.add('noscroll');
        clearTimeout(modalTimerId);
    }

    function modalClose() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.classList.remove('noscroll');
    }


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', modalOpen);
    })

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.hasAttribute('data-close')) modalClose();
        // клик вне контента модального окна (затемненная зона)
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) modalClose();
    }); //закрытие модального окна по нажатию кнопки escape
    // Внимательно: навешиваем на document а не на конкретный элемент!!!

    const modalTimerId = setTimeout(modalOpen, 300000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            modalOpen();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
    //Внимательно: навешиваем на window а не на конкретный элемент!!! 


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

    const getResource = async (url) => {
        const res = await fetch(url);
        // проверяем что мы получили информацию и все нормально сработало
        if (!res.ok) throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        // ошибку далее словит catch и обработает
        return await res.json();
    }

    getResource('http://localhost:3000/menu')
        .then((data) => {
            data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        }); //({ img, altimg, title, descr, price }) это деструктуризация объекта полученного при переборе массива (т.о. мы получили каждое св-во объекта как отдельную переменную (примерно это выглядит: const altimg = "vegy",) и далее передаем соответствующее значение в класс new MenuCard) и через метод .render() создаем и помещаем карточку на страницу


    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/modal/spinner.svg',
        success: 'Спасибо! Мы скоро свяжемся с Вами',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => bindPostData(item));

    // постим данные:
    const postData = async (url, data) => {
        /* async и await всегда идут в паре, async ставится перед функцией внутри которой будет выполняться ассинхронный код */
        const res = await fetch(url, {
            /* await ждет когда вернется результат и только потом код продолжит свое выполнение */
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json(); // await ждет результат
    };


    function bindPostData(form) { //привязываем постинг данных для дальнейшей работы
        form.addEventListener('submit', (e) => {
            /* submit срабатывает при нажатии button внутри form */

            e.preventDefault();
            /* без данной строки отправка формы будет сопровождаться перезагрузкой страницы (ее дефолтное поведение) а нам это не нужно 
            !!! пишем в самом начале*/

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.classList.add('spinner');
            form.insertAdjacentElement('afterend', statusMessage);
            //console.log(form.childNodes);

            const formData = new FormData(form);

            /*  из данных formData формируем объект 
             const object = {};
              formData.forEach(function (value, key) {
                  object[key] = value;
              });
 
              и далее преобразуем его в формат JSON если будем отправлять в формате JSON
              const json = JSON.stringify(object); */

            // или так (более современный и короткий вариант)
            // из formData получаем массив массивов данных, потом формируем из них объект
            // в конце преобразуем его в JSON
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            console.log(json);

            // Fetch

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                    statusMessage.remove();
                })
                .finally(() => form.reset());

            /* fetch('server.php', {
                method: 'POST',
                // когда используем fetch и отправляются данные FormData, то в headers не надо ничего указывать
                // а для JSON указываем как и с XMLHttpRequest
                headers: {
                    'Content-type': 'application/json'
                },
                body: json
                // или 
                //body: formData

            })
                //сначала получаем ответ(data) и расшифровываем его, автоматически 
                //возвращается Promise c расшифровкой
                .then((data) => data.text()) // для FormData
                // а потом уже расшифровку console.log
                .then((data) => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                    statusMessage.remove();
                })
                .finally(() => form.reset()); */


            // XMLHttpRequest

            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');
            // // request.setRequestHeader('Content-type', 'multipart/form-data');
            // /* ('Content-type', 'multipart/form-data') прописывается если мы используем объект FormData */
            // request.setRequestHeader('Content-type', 'application/json');
            // // вводим если отправляем данные не через FormData, а через JSON

            // const formData = new FormData(form);
            // // собрали все введенные и отправленные данные из формы
            // //request.send(formData); //отправляем данные FormData

            // const object = {};
            // formData.forEach(function (value, key) {
            //     object[key] = value;
            // });

            // const json = JSON.stringify(object);
            // request.send(json);// отправляем данные как JSON через XMLHttpRequest


            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         statusMessage.remove();
            //         form.reset();//очищает введенные в форму данные
            //     } else {
            //         showThanksModal(message.failure);
            //         statusMessage.remove();
            //     }
            // });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.remove('show');
        prevModalDialog.classList.add('hide');
        modalOpen();

        /* первая кнопка button на сайте выведет модалку с заполненным нижеуказанным контентом
        НО в разделе order модалка не покажется, поэтому мы ее открываем modalOpen() и заполняем кодом ниже */

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            modalClose();
        }, 4000);
    }

    // Просто пример отправки данных на fake сервер https://jsonplaceholder.typicode.com/

    // fetch('https://jsonplaceholder.typicode.com/posts', {
    //     method: 'POST',
    //     headers: {
    //         'Content-type': 'application/json'
    //     },
    //     body: JSON.stringify({ name: 'Alex' })
    //     //можем передать строку или объект
    // })
    //     .then((response) => response.json())
    //     .then((json) => console.log(json));



    fetch('http://localhost:3000/menu')
        .then((data) => data.json())
        .then((res) => console.log(res));
    // доступ к db.json через Терминал и команду json-server src/db.json 


    // Slider

    const arrowPrev = document.querySelector('.arrow_previous'),
        arrowNext = document.querySelector('.arrow_next'),
        currentNum = document.querySelector('#current'),
        totalNum = document.querySelector('#total'),
        slides = document.querySelectorAll('.offer__slide'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        slider = document.querySelector('.offer__slider'),
        width = window.getComputedStyle(slidesWrapper).width; // получили уже установленную в браузере ширину для slidesWrapper ('.offer__slider-wrapper') (!!! всегда на window)

    // window.getComputedStyle(slidesWrapper) - вернет объект с уже примененными стилями, расположенными в св-вах (например width)

    let slideIndex = 1; // 1 так как нумерация слайдов с 01 а не 00



    // Third variant of slider (carousel)



    let offset = 1950; // задали отступ для двигания слайдера вправо влево

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesField.style.transform = 'translateX(1950px)';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width; // чтобы все слайды были одинаковой ширины
    });



    // Dots (динамическое создание)



    slider.style.position = 'relative';

    const indicators = document.createElement('ol'), // точки и навигацию создаем через список
        dots = []; //решили создать истинный массив (а не псевдоколлекцию по типу querySelectorAll хотя можем)
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 45%;
        list-style: none;
    `; // тоже вариант добавления стилей кроме классов
    slider.append(indicators);

    //создаем точки в соответствием с кол-вом слайдов
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        //задали аттрибут содержащий номер слайда соответствующий каждой перечисленной точке
        dot.classList.add('dot');

        indicators.append(dot);

        dots.push(dot); // точки помещаем в массив
    }

    function setCurrentNum(slideIndex = 1) {
        if (slides.length < 10) {
            currentNum.textContent = `0${slideIndex}`;
        } else {
            currentNum.textContent = slideIndex;
        }
        setActiveDot(slideIndex);
    }

    //задаем активность точкам в зависимости от вычисленного индекса слайда
    function setActiveDot(slideIndex) {
        dots.forEach(dot => dot.style.opacity = '.5'); // отменяем активность к всех точек
        dots[slideIndex - 1].style.opacity = 1; // добавляем в нужную
    }

    //задаем начальные значения для счетчика в totalNum
    if (slides.length < 10) {
        totalNum.textContent = `0${slides.length}`;
    } else {
        totalNum.textContent = slides.length;
    }

    //задаем начальные значения для счетчика в currentNum и внутри ее вызовется setActiveDot()
    setCurrentNum();


    arrowPrev.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
            /* лента со слайдами ушла на три ширины слайдов (три слайда) вправо = 1950 из 2600 (разница в 650 = 1 слайд), соответственно нам виден первый слайд начало ленты */
            offset = 0; //возвращаемся на начало ленты (но видно последний слайд конец ленты)
        } else {
            offset += +width.slice(0, width.length - 2); // иначе просто на 650 вправо
        }

        slidesField.style.transform = `translateX(${offset}px)`;

        //согласно кнопке prev мы вычисляем значение счетчика
        if (slideIndex === 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        // и присваиваем в currentNum одновременно меняя активность у точек в зависимости от вычисленного индекса
        setCurrentNum(slideIndex);
    });


    arrowNext.addEventListener('click', () => {
        if (offset == 0) { //мы вначале ленты со слайдами нам виден последний слайд конец ленты
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(${offset}px)`;

        if (slideIndex === slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        //задаем currentNum и активность точкам по кликам на стрелку next
        setCurrentNum(slideIndex);
    });

    //задаем активность точкам по кликам на них же
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = 1950 - (+width.slice(0, width.length - 2) * (slideTo - 1));

            slidesField.style.transform = `translateX(${offset}px)`;

            setCurrentNum(slideIndex);
        });
    })

    //!!! концентрируемся на двигании ленты а не на слайдах так проще




    // Teacher's variant of slider



    // showSlides(slideIndex);

    // //задаем общее кол-во слайдов в счетчике на странице

    // if (slides.length < 10) {
    //     totalNum.textContent = `0${slides.length}`;
    // } else {
    //     totalNum.textContent = slides.length;
    // }

    // function showSlides(index) { // устанавливаем границы нашего слайдера
    //     if (index > slides.length) { // 
    //         /* когда индекс пересекает границу общего кол-ва слайдов, мы возвращаем индекс в самое начальное значение */
    //         slideIndex = 1;
    //     } else if (index < 1) {
    //         /* когда индекс пересекает  минимальное значение границы и становится перед последним слайдом, мы возвращаем индекс на самое большое значение (общее кол-во слайдов) */
    //         slideIndex = slides.length;
    //     }

    //     slides.forEach((slide) => slide.classList.add('offer__slide_hidden', 'fade'));

    //     slides[slideIndex - 1].classList.remove('offer__slide_hidden');

    //     // задаем текущее значение слайда в счетчике на странице

    //     if (slides.length < 10) {
    //         currentNum.textContent = `0${slideIndex}`;
    //     } else {
    //         currentNum.textContent = slideIndex;
    //     }

    // }

    // function plusSlides(n) { //приходит 1 или -1
    //     showSlides(slideIndex += n)
    // }

    // arrowNext.addEventListener('click', () => plusSlides(1));
    // arrowPrev.addEventListener('click', () => plusSlides(-1));



    // My variant of slider



    /* arrowNext.addEventListener('click', nextSlide);
    arrowPrev.addEventListener('click', prevSlide);


    showSlide();

    function nextSlide() {
        if (currentNum.textContent < totalNum.textContent) {
            if (currentNum.textContent <= '08') {
                currentNum.textContent = '0' + (+currentNum.textContent + 1);
            } else {
                currentNum.textContent = '' + (+currentNum.textContent + 1);
            }
        } else {
            currentNum.textContent = '01';
        }
        showSlide(+currentNum.textContent);
    }

    function prevSlide() {
        if (currentNum.textContent > '01') {
            if (currentNum.textContent <= '10') {
                currentNum.textContent = '0' + (+currentNum.textContent - 1);
            } else {
                currentNum.textContent = '' + (+currentNum.textContent - 1);
            }
        } else {
            currentNum.textContent = totalNum.textContent;
        }
        showSlide(+currentNum.textContent);
    }

    function showSlide(num = 1) {
        currentNum.textContent = '0' + num;
        currentNum.classList.add('fade');
        slides.forEach((slide, i) => {
            if ((i + 1) === num) {
                slide.classList.remove('offer__slide_hidden');
            } else {
                slide.classList.add('offer__slide_hidden', 'fade');
            }
        });
    } */

    const obj1 = { foo: "bar", x: 42 };
    const obj2 = { foo: "baz", y: 13 };
    // const merge = (...objects) =>
    //     objects.reduce((acc, cur) => ({ ...acc, ...cur }));

    // const mergedObj1 = merge(obj1, obj2);
    // { foo: 'baz', x: 42, y: 13 }


    // const merge = (...objects) => ({ ...objects });

    // const mergedObj1 = merge(obj1, obj2);
    //{ 0: { foo: 'bar', x: 42 }, 1: { foo: 'baz', y: 13 } }

    const mergedObj1 = { ...obj1 };

    console.log(mergedObj1);



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

});





