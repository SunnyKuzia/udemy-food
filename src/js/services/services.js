//эти функции могут использоваться где угодно
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

const getResource = async (url) => {
    const res = await fetch(url);
    // проверяем что мы получили информацию и все нормально сработало
    if (!res.ok) throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    // ошибку далее словит catch и обработает
    return await res.json();
}


export { postData };
export { getResource };
