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

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

    function modalOpen() {
        modal.classList.add('show');
        document.body.classList.add('noscroll');
        clearTimeout(modalTimerId);
    }

    function modalClose() {
        modal.classList.remove('show');
        document.body.classList.remove('noscroll');
    }


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', modalOpen);
    })

    modalCloseBtn.addEventListener('click', modalClose);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modalClose();
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) modalClose();
    }); //закрытие модального окна по нажатию кнопки escape
    // Внимательно: навешиваем на document а не на конкретный элемент!!!

    const modalTimerId = setTimeout(modalOpen, 3000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            modalOpen();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
    //Внимательно: навешиваем на window а не на конкретный элемент!!! 
});