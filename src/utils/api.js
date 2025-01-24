export const callAPI = async (url, options = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const defaultHeaders = {
    ...(options.headers?.['Content-Type'] === undefined && {
      'Content-Type': 'application/json',
    }),
    ...(token && { Authorization: `Bearer ${token}` }), // Добавляем токен, если он есть
  };

  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  const body =
    headers['Content-Type'] === 'application/x-www-form-urlencoded' &&
    typeof options.body === 'object'
      ? new URLSearchParams(options.body).toString() // Преобразуем объект в строку
      : JSON.stringify(options.body); // Оставляем JSON по умолчанию

  const config = {
    method: options.method || 'GET', // По умолчанию GET
    headers,
    ...(options.body && { body }),
  };

  try {
    const response = await fetch(`${baseUrl}${url}`, config); // Делаем запрос

    // Проверяем что ответ пришел в json
    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      // console.error("Ошибка парсинга JSON:", jsonError);
      throw {
        type: 'ParseError',
        message: 'Ошибка парсинга ответа от сервера',
        details: jsonError,
        status: response.status,
      };
    }

    // Проверяем что ответ 200 ОК, а не что-то другое
    if (!response.ok) {
      // console.error("Ошибка сервера:", responseData.message);
      // console.log(responseData.detail)
      throw {
        type: 'ServerError',
        message: responseData.message || responseData.detail,
        details: responseData,
        status: response.status,
      };
    }

    return responseData; // Успешный ответ
  } catch (error) {
    // Сетевые ошибки
    if (error.type === undefined) {
      // console.error("Ошибка сети:", error);
      throw {
        type: 'NetworkError',
        message: 'Ошибка сети, проверьте подключение к интернету',
        details: error.message,
      };
    }
    throw error; // Пробрасываем уже обработанные ошибки
  }
};
