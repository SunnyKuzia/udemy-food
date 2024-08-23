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
            content.classList.add('tabcontent__hidden', 'fade');
        })
        contents[i].classList.remove('tabcontent__hidden');
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
        modal = document.querySelector('.modal'); // затемненная зона

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

    new MenuCard(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container').render();

    new MenuCard(
        'img/tabs/elite.jpg',
        'elite',
        'Меню "Премиум"',
        'В меню "Премиум" мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        '.menu .container').render();

    new MenuCard(
        'img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        21,
        '.menu .container').render();


    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/modal/spinner.svg',
        success: 'Спасибо! Мы скоро свяжемся с Вами',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => postData(item));

    function postData(form) {
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

            // из данных formData формируем объект 
            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });

            // а далее преобразуем в формат JSON
            const json = JSON.stringify(object);

            // Fetch

            fetch('server.php', {
                method: 'POST',
                // когда fetch и отправляются данные FormData, то в headers не надо ничего указывать
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
                .finally(() => form.reset());


            // XMLHttpRequest

            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');
            // // request.setRequestHeader('Content-type', 'multipart/form-data');
            // /* ('Content-type', 'multipart/form-data') прописывается если мы используем объект FormData */
            // request.setRequestHeader('Content-type', 'application/json');
            // // вводим если отправляем данные не через FormData, а через JSON

            // const formData = new FormData(form);
            // // собрали все введенные и отправленные данные из формы
            // //request.send(formData);

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

        /* первая кнопка выведет модалку с заполненным нижеуказанным контентом
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
});





