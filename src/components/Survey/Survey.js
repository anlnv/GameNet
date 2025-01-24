import { useState } from 'react';
import { callAPI } from '@/utils/api';
import styles from './Survey.module.css';

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState({
    genres: [],
    experience: '',
    purpose: '', // Новое поле: цель поиска напарника
    preferred_communication: '', // Новое поле: предпочтительный формат общения
    hours_per_week: '', // Новое поле: количество часов игры в неделю
    platforms: [],
  });

  const steps = [
    {
      title: 'Какие жанры игр вам больше всего нравятся?',
      content: (
        <>
          {[
            'Шутеры (FPS)',
            'Многопользовательские онлайн-игры (MMO)',
            'Ролевые игры (RPG)',
            'MOBA',
            'Стратегии (RTS/Turn-based)',
            'Спортивные симуляторы',
            'Приключенческие игры',
            'Гонки',
            'Киберспортивные игры',
          ].map((genre, idx) => (
            <label key={idx}>
              <input
                type='checkbox'
                value={genre}
                onChange={(e) => handleCheckboxChange(e, 'genres')}
                checked={surveyData.genres.includes(genre)}
              />
              {genre}
            </label>
          ))}
        </>
      ),
    },
    {
      title: 'С какой целью вы ищете напарника?',
      content: (
        <>
          {['Для развлечения', 'Для участия в киберспортивных турнирах'].map(
            (option) => (
              <label key={option}>
                <input
                  type='radio'
                  value={option}
                  onChange={(e) =>
                    setSurveyData({ ...surveyData, purpose: e.target.value })
                  }
                  checked={surveyData.purpose === option}
                />
                {option}
              </label>
            ),
          )}
        </>
      ),
    },
    {
      title: 'Как вы оцениваете свой игровой опыт?',
      content: (
        <>
          {['Начинающий', 'Средний', 'Продвинутый'].map((level) => (
            <label key={level}>
              <input
                type='radio'
                value={level}
                onChange={(e) =>
                  setSurveyData({ ...surveyData, experience: e.target.value })
                }
                checked={surveyData.experience === level}
              />
              {level}
            </label>
          ))}
        </>
      ),
    },
    {
      title: 'Какой формат взаимодействия с другими игроками вам подходит?',
      content: (
        <>
          {['Голосовой чат', 'Внутриигровой текстовый чат', 'Никакой'].map(
            (option) => (
              <label key={option}>
                <input
                  type='radio'
                  value={option}
                  onChange={(e) =>
                    setSurveyData({
                      ...surveyData,
                      preferred_communication: e.target.value,
                    })
                  }
                  checked={surveyData.preferred_communication === option}
                />
                {option}
              </label>
            ),
          )}
        </>
      ),
    },
    {
      title: 'Сколько часов в неделю вы играете?',
      content: (
        <>
          <input
            type='number'
            placeholder='Введите количество часов'
            value={surveyData.hours_per_week}
            onChange={(e) =>
              setSurveyData({
                ...surveyData,
                hours_per_week: e.target.value,
              })
            }
            min='0'
          />
        </>
      ),
    },
    {
      title: 'На какой платформе вы играете?',
      content: (
        <>
          {[
            'ПК',
            'PlayStation',
            'Xbox',
            'Nintendo Switch',
            'Мобильные игры',
          ].map((platform) => (
            <label key={platform}>
              <input
                type='checkbox'
                value={platform}
                onChange={(e) => handleCheckboxChange(e, 'platforms')}
                checked={surveyData.platforms.includes(platform)}
              />
              {platform}
            </label>
          ))}
        </>
      ),
    },
  ];

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setSurveyData((prevState) => {
      const updatedValues = checked
        ? [...prevState[field], value]
        : prevState[field].filter((item) => item !== value);

      return { ...prevState, [field]: updatedValues };
    });
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSave = async () => {
    try {
      const body = JSON.stringify({
        purpose: surveyData.purpose,
        self_assessment_lvl: surveyData.experience,
        preferred_communication: surveyData.preferred_communication,
        hours_per_week: Number(surveyData.hours_per_week),
      });
      const result = await callAPI(`/user/update-me`, {
        method: 'PATCH',
        body: body,
      });
      // const response = await fetch("http://87.242.103.34:5000/user/updateme", {
      //     method: "PATCH",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Authorization": `Bearer ${token}`,
      //     },
      //     body: JSON.stringify({
      //       purpose: surveyData.purpose,
      //       self_assessment_lvl: surveyData.experience,
      //       preferred_communication: surveyData.preferred_communication,
      //       hours_per_week: Number(surveyData.hours_per_week),
      //     }),
      //   });
      console.log('Данные успешно отправлены:', result);
      alert('Данные успешно сохранены!');

      // if (response.ok) {
      //   const result = await response.json();
      //   console.log("Данные успешно отправлены:", result);
      //   alert("Данные успешно сохранены!");
      // } else {
      //   console.error("Ошибка при отправке данных:", response.status);
      //   alert("Не удалось сохранить данные. Попробуйте снова.");
      // }
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert('Произошла ошибка. Проверьте соединение с сетью.');
    }
  };

  return (
    <div className={styles.survey}>
      <h2>{steps[currentStep].title}</h2>
      <div className={styles.survey_content}>{steps[currentStep].content}</div>
      <div className={styles.survey_navigation}>
        {currentStep > 0 && <button onClick={goToPreviousStep}>Назад</button>}
        {currentStep < steps.length - 1 && (
          <button onClick={goToNextStep}>Далее</button>
        )}
        {currentStep === steps.length - 1 && (
          <button onClick={handleSave}>Сохранить</button>
        )}
      </div>
    </div>
  );
}
