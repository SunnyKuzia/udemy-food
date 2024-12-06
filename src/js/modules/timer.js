function timer(deadline, id) {

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

    setTimer(deadline, id);
}

// module.exports = timer; синтаксис Common JS

export default timer; //синтаксис ES6