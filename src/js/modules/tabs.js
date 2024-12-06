function tabs(parentSelector, tabsSelector, tabsContentSelector, activeClass, hiddenSelector) {
    //Tabs

    const tabheader = document.querySelector(parentSelector),
        items = tabheader.querySelectorAll(tabsSelector),
        contents = document.querySelectorAll(tabsContentSelector);



    function setActiveItem(target = items[0]) {
        items.forEach((item, i) => {
            item.classList.add('fade');
            item.classList.remove(activeClass);
            if (target === item) {
                target.classList.add(activeClass);
                displayContent(i);
            }
        })

    }
    setActiveItem();

    function displayContent(i) {
        contents.forEach(content => {
            content.classList.add(hiddenSelector, 'fade');
        })
        contents[i].classList.remove(hiddenSelector);
    }

    tabheader.addEventListener('click', (e) => {
        let target = e.target;
        if (target && target.matches(tabsSelector)) {
            setActiveItem(target);
        }
    });
}

// module.exports = tabs; синтаксис Common JS

export default tabs; //синтаксис ES6