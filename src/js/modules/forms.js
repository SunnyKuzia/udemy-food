import { modalOpen, modalClose } from './modal';
import { postData } from '../services/services';

function forms(formSelector, modalTimerId) {

    // Forms

    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'img/modal/spinner.svg',
        success: 'Спасибо! Мы скоро свяжемся с Вами',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => bindPostData(item));

    function bindPostData(form) { //привязываем постинг данных для дальнейшей работы
        /* submit срабатывает при нажатии button внутри form */
        form.addEventListener('submit', async (e) => {
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

            // Fetch

            try {
                const data = await postData('http://localhost:3000/requests', json);

                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();

            } catch {
                console.log("error");
                showThanksModal(message.failure);
                statusMessage.remove();
            } finally {
                form.reset();
            }

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
        modalOpen('.modal', modalTimerId);

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
            modalClose('.modal');
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


    // доступ к db.json и свойству 'menu'
    // fetch('http://localhost:3000/menu')
    //     .then((data) => data.json())
    //     .then((res) => console.log(res));
    // доступ к db.json через Терминал и команду json-server src/db.json 

}

// module.exports = forms; синтаксис Common JS

export default forms; //синтаксис ES6