/*import React, { useState } from "react";
import './survey.css';

function Survey() {
  const [currentStep, setCurrentStep] = useState(0); // Управление шагами
  const [surveyData, setSurveyData] = useState({
    genres: [],
    games: "",
    experience: "",
    preference: "",
    interaction: "",
    schedule: {
      days: [],
      time: "",
    },
    platform: "",
    teamPreference: [],
    esports: "",
  });

  const steps = [
    {
      title: "Какие жанры игр вам больше всего нравятся?",
      content: (
        <>
          {[
            "Шутеры (FPS)",
            "Многопользовательские онлайн-игры (MMO)",
            "Ролевые игры (RPG)",
            "MOBA",
            "Стратегии (RTS/Turn-based)",
            "Спортивные симуляторы",
            "Приключенческие игры",
            "Гонки",
            "Киберспортивные игры",
          ].map((genre, idx) => (
            <label key={idx}>
              <input
                type="checkbox"
                value={genre}
                onChange={(e) => handleCheckboxChange(e, "genres")}
                checked={surveyData.genres.includes(genre)}
              />
              {genre}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "В какие игры вы играете чаще всего и какой ваш текущий уровень в них?",
      content: (
        <>
          <input
            type="text"
            placeholder="Введите название игры"
            value={surveyData.games}
            onChange={(e) =>
              setSurveyData({ ...surveyData, games: e.target.value })
            }
          />
        </>
      ),
    },
    {
      title: "Как вы оцениваете свой игровой опыт?",
      content: (
        <>
          {["Начинающий", "Средний", "Продвинутый"].map((level) => (
            <label key={level}>
              <input
                type="radio"
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
      title: "Что для вас важнее: развлечение или победа?",
      content: (
        <>
          {[
            "Предпочитаю играть ради веселья",
            "Мне важны победы и достижения",
            "Мне все равно",
          ].map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                onChange={(e) =>
                  setSurveyData({ ...surveyData, preference: e.target.value })
                }
                checked={surveyData.preference === option}
              />
              {option}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "Какой формат взаимодействия с другими игроками вам подходит?",
      content: (
        <>
          {[
            "Активное общение во время игры (голосовой/текстовый чат)",
            "Предпочитаю минимальное общение",
            "Играю в тишине, но готов общаться вне игры",
            "Мне все равно",
          ].map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                onChange={(e) =>
                  setSurveyData({ ...surveyData, interaction: e.target.value })
                }
                checked={surveyData.interaction === option}
              />
              {option}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "В какие дни вы преимущественно играете?",
      content: (
        <>
          {["Будние", "Выходные"].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                onChange={(e) => handleCheckboxChange(e, "schedule.days")}
                checked={surveyData.schedule.days.includes(day)}
              />
              {day}
            </label>
          ))}
          <h4>В какое время суток вы чаще всего играете?</h4>
          {[
            "Утро (6:00 – 12:00)",
            "День (12:00 – 18:00)",
            "Вечер (18:00 – 00:00)",
            "Ночь (00:00 – 6:00)",
          ].map((time) => (
            <label key={time}>
              <input
                type="radio"
                value={time}
                onChange={(e) =>
                  setSurveyData({
                    ...surveyData,
                    schedule: { ...surveyData.schedule, time: e.target.value },
                  })
                }
                checked={surveyData.schedule.time === time}
              />
              {time}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "На какой платформе вы играете?",
      content: (
        <>
          {["ПК", "PlayStation", "Xbox", "Nintendo Switch", "Мобильные игры"].map(
            (platform) => (
              <label key={platform}>
                <input
                  type="radio"
                  value={platform}
                  onChange={(e) =>
                    setSurveyData({ ...surveyData, platform: e.target.value })
                  }
                  checked={surveyData.platform === platform}
                />
                {platform}
              </label>
            )
          )}
        </>
      ),
    },
    {
      title: "Какие типы игроков вы предпочитаете видеть в своей команде?",
      content: (
        <>
          {[
            "Опытные игроки",
            "Новички, готовые учиться",
            "Дружелюбные и открытые к общению",
            "Целеустремленные и нацеленные на результат",
          ].map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                onChange={(e) => handleCheckboxChange(e, "teamPreference")}
                checked={surveyData.teamPreference.includes(type)}
              />
              {type}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "Готовы ли вы участвовать в киберспортивных турнирах и лигах?",
      content: (
        <>
          {["Да", "Нет"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                onChange={(e) =>
                  setSurveyData({ ...surveyData, esports: e.target.value })
                }
                checked={surveyData.esports === option}
              />
              {option}
            </label>
          ))}
        </>
      ),
    },
  ];

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;

    setSurveyData((prevState) => {
      if (field === "schedule.days") {
        const updatedDays = checked
          ? [...prevState.schedule.days, value]
          : prevState.schedule.days.filter((day) => day !== value);

        return {
          ...prevState,
          schedule: {
            ...prevState.schedule,
            days: updatedDays,
          },
        };
      } else {
        const newValues = checked
          ? [...prevState[field], value]
          : prevState[field].filter((item) => item !== value);

        return { ...prevState, [field]: newValues };
      }
    });
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSave = () => {
    console.log("Сохраненные данные:", surveyData);
    alert("Опрос успешно сохранен!");
  };

  return (
    <div className="survey">
      <h2>{steps[currentStep].title}</h2>
      <div className="survey-content">{steps[currentStep].content}</div>
      <div className="survey-navigation">
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

export default Survey;*/





import React, { useState } from "react";
import './survey.css';

function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState({
    genres: [],
    games: "",
    experience: "",
    preference: "",
    interaction: "",
    schedule: {
      days: [],
      time: [],
    },
    platforms: [],
    teamPreference: [],
    esports: "",
  });

  const steps = [
    {
      title: "Какие жанры игр вам больше всего нравятся?",
      content: (
        <>
          {[
            "Шутеры (FPS)",
            "Многопользовательские онлайн-игры (MMO)",
            "Ролевые игры (RPG)",
            "MOBA",
            "Стратегии (RTS/Turn-based)",
            "Спортивные симуляторы",
            "Приключенческие игры",
            "Гонки",
            "Киберспортивные игры",
          ].map((genre, idx) => (
            <label key={idx}>
              <input
                type="checkbox"
                value={genre}
                onChange={(e) => handleCheckboxChange(e, "genres")}
                checked={surveyData.genres.includes(genre)}
              />
              {genre}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "В какие игры вы играете чаще всего и какой ваш текущий уровень в них?",
      content: (
        <>
          <input
            type="text"
            placeholder="Введите название игры"
            value={surveyData.games}
            onChange={(e) =>
              setSurveyData({ ...surveyData, games: e.target.value })
            }
          />
        </>
      ),
    },
    {
      title: "Как вы оцениваете свой игровой опыт?",
      content: (
        <>
          {["Начинающий", "Средний", "Продвинутый"].map((level) => (
            <label key={level}>
              <input
                type="radio"
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
      title: "Что для вас важнее: развлечение или победа?",
      content: (
        <>
          {[
            "Предпочитаю играть ради веселья",
            "Мне важны победы и достижения",
            "Мне все равно",
          ].map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                onChange={(e) =>
                  setSurveyData({ ...surveyData, preference: e.target.value })
                }
                checked={surveyData.preference === option}
              />
              {option}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "Какой формат взаимодействия с другими игроками вам подходит?",
      content: (
        <>
          {[
            "Активное общение во время игры (голосовой/текстовый чат)",
            "Предпочитаю минимальное общение",
            "Играю в тишине, но готов общаться вне игры",
            "Мне все равно",
          ].map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                onChange={(e) =>
                  setSurveyData({ ...surveyData, interaction: e.target.value })
                }
                checked={surveyData.interaction === option}
              />
              {option}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "В какие дни вы преимущественно играете?",
      content: (
        <>
          {["Будние", "Выходные"].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                onChange={(e) => handleCheckboxChange(e, "schedule.days")}
                checked={surveyData.schedule.days.includes(day)}
              />
              {day}
            </label>
          ))}
          <h4>В какое время суток вы чаще всего играете?</h4>
          {[
            "Утро (6:00 – 12:00)",
            "День (12:00 – 18:00)",
            "Вечер (18:00 – 00:00)",
            "Ночь (00:00 – 6:00)",
          ].map((time) => (
            <label key={time}>
              <input
                type="checkbox"
                value={time}
                onChange={(e) => handleCheckboxChange(e, "schedule.time")}
                checked={surveyData.schedule.time.includes(time)}
              />
              {time}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "На какой платформе вы играете?",
      content: (
        <>
          {["ПК", "PlayStation", "Xbox", "Nintendo Switch", "Мобильные игры"].map(
            (platform) => (
              <label key={platform}>
                <input
                  type="checkbox"
                  value={platform}
                  onChange={(e) => handleCheckboxChange(e, "platforms")}
                  checked={surveyData.platforms.includes(platform)}
                />
                {platform}
              </label>
            )
          )}
        </>
      ),
    },
    {
      title: "Какие типы игроков вы предпочитаете видеть в своей команде?",
      content: (
        <>
          {[
            "Опытные игроки",
            "Новички, готовые учиться",
            "Дружелюбные и открытые к общению",
            "Целеустремленные и нацеленные на результат",
          ].map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                onChange={(e) => handleCheckboxChange(e, "teamPreference")}
                checked={surveyData.teamPreference.includes(type)}
              />
              {type}
            </label>
          ))}
        </>
      ),
    },
    {
      title: "Готовы ли вы участвовать в киберспортивных турнирах и лигах?",
      content: (
        <>
          {["Да", "Нет"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                onChange={(e) =>
                  setSurveyData({ ...surveyData, esports: e.target.value })
                }
                checked={surveyData.esports === option}
              />
              {option}
            </label>
          ))}
        </>
      ),
    },
  ];

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;

    setSurveyData((prevState) => {
      if (field.startsWith("schedule.")) {
        const subField = field.split(".")[1];
        const updatedValues = checked
          ? [...prevState.schedule[subField], value]
          : prevState.schedule[subField].filter((item) => item !== value);

        return {
          ...prevState,
          schedule: {
            ...prevState.schedule,
            [subField]: updatedValues,
          },
        };
      } else {
        const updatedValues = checked
          ? [...prevState[field], value]
          : prevState[field].filter((item) => item !== value);

        return { ...prevState, [field]: updatedValues };
      }
    });
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSave = () => {
    console.log("Сохраненные данные:", surveyData);
    alert("Опрос успешно сохранен!");
  };

  return (
    <div className="survey">
      <h2>{steps[currentStep].title}</h2>
      <div className="survey-content">{steps[currentStep].content}</div>
      <div className="survey-navigation">
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

export default Survey;

