require('es6-promise').polyfill(); // синтаксис Common JS и ES6 можно совмещать
import 'nodelist-foreach-polyfill'; // просто import и название файла, когда мы импортируем npm-пакет из node_modules (где хранятся все npm пакеты npm проекта) 

import tabs from './modules/tabs'; //.js мы не прописываем (webpack сам поймет какие файлы брать)
import timer from './modules/timer';
import cards from './modules/cards';
import forms from './modules/forms';
import modal from './modules/modal';
import slider from './modules/slider';
import calc from './modules/calc'; // порядок подключения не важен
import { modalOpen } from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => modalOpen('.modal', modalTimerId), 300000);

    //вызываем наши функции

    tabs('.tabheader', '.tabheader__item', '.tabcontent', 'tabheader__item_active', 'tabcontent_hidden');
    timer('2024-12-25', '.timer');
    cards();
    forms('form', modalTimerId);
    modal('[data-modal]', '.modal', modalTimerId);
    slider({
        prev: '.arrow_previous',
        next: '.arrow_next',
        currentCounter: '#current',
        totalCounter: '#total',
        slide: '.offer__slide',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner',
        sliderContainer: '.offer__slider'
    });
    calc();



    //Common JS (импорт и экспорт модулей данным способом) ПРИМЕР:

    // const myModule = require('./main'); // импорт функции myModule которая экспортируется из main.js

    // const myModuleInstance = new myModule();
    // // тк функция myModule - функция конструктор то создаем экземпляр чтобы использовать ее методы

    // myModuleInstance.hello();
    // myModuleInstance.goodbye();   


    //in main.js:

    // function myModule() {
    //     this.hello = function () {
    //         console.log('hello');
    //     };
    //     this.goodbye = function () {
    //         console.log('bye');
    //     };
    // }

    // module.exports = myModule; // экспорт функции
});

