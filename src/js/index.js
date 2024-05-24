window.addEventListener('DOMContentLoaded', () => {
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
});