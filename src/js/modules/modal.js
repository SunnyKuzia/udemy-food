function modalOpen(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.classList.add('noscroll');
    if (modalTimerId) {
        clearTimeout(modalTimerId);
    }
}

function modalClose(modalSelector) {
    const modal = document.querySelector(modalSelector);

    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.classList.remove('noscroll');
}

function modal(triggerSelector, modalSelector, modalTimerId) {

    const modalTrigger = document.querySelectorAll(triggerSelector), // кнопки 'Связаться с нами'
        modal = document.querySelector(modalSelector); // затемненная зона и самый верхний div

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => modalOpen(modalSelector, modalTimerId));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.hasAttribute('data-close')) modalClose(modalSelector);
        // клик вне контента модального окна (затемненная зона)
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) modalClose(modalSelector);
    }); //закрытие модального окна по нажатию кнопки escape
    // Внимательно: навешиваем на document а не на конкретный элемент!!!

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            modalOpen(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
    //Внимательно: навешиваем на window а не на конкретный элемент!!! 
}

// module.exports = modal; синтаксис Common JS

//синтаксис ES6:
export default modal;
export { modalOpen };
export { modalClose };