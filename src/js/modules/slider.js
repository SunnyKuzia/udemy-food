function slider({ prev, next, currentCounter, totalCounter, slide, wrapper, field, sliderContainer }) {
    // Slider

    const arrowPrev = document.querySelector(prev),
        arrowNext = document.querySelector(next),
        currentNum = document.querySelector(currentCounter),
        totalNum = document.querySelector(totalCounter),
        slides = document.querySelectorAll(slide),
        slidesWrapper = document.querySelector(wrapper),
        slidesField = document.querySelector(field),
        slider = document.querySelector(sliderContainer),
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



    // Merging of objects


    // const obj1 = { foo: "bar", x: 42 };
    // const obj2 = { foo: "baz", y: 13 };
    // const merge1 = (...objects) =>
    //     objects.reduce((acc, cur) => ({ ...acc, ...cur }));

    // const mergedObj1 = merge1(obj1, obj2);
    // { foo: 'baz', x: 42, y: 13 }


    // const merge2 = (...objects) => ({ ...objects });

    // const mergedObj1 = merge2(obj1, obj2);
    // { 0: { foo: 'bar', x: 42 }, 1: { foo: 'baz', y: 13 } }

    // const mergedObj2 = { ...obj1 };

    // console.log(mergedObj1);
}

// module.exports = slider; синтаксис Common JS

export default slider; //синтаксис ES6