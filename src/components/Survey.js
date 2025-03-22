import React, { useState, useRef, useEffect } from "react";
import './survey.css';
import games from "./games";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState({
    genres: [],
    preferred_communication: "",
    purpose: "",
    preferred_days: "",
    preferred_time: "",
    favorite_games: [],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredGames = games.filter(game =>
    game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGameSelect = (game) => {
    setSurveyData(prev => ({
      ...prev,
      favorite_games: prev.favorite_games.includes(game)
        ? prev.favorite_games.filter(g => g !== game)
        : [...prev.favorite_games, game],
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSearchFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContainerClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  };

  const steps = [
    {
      title: "Какие жанры игр вам больше всего нравятся?",
      content: (
        <div className="checkbox-group">
          {["Шутеры (FPS)", "MMO", "RPG", "MOBA", "RTS/Turn-based", 
            "Спортивные симуляторы", "Приключенческие игры", "Гонки", 
            "Киберспортивные игры"].map((genre, idx) => (
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
        </div>
      ),
      validation: () => surveyData.genres.length > 0
    },
    {
      title: "Какой формат взаимодействия с другими игроками вам подходит?",
      content: (
        <div className="radio-group">
          {["Активное общение во время игры (голосовой/текстовый чат)", 
            "Предпочитаю минимальное общение", 
            "Мне все равно"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                onChange={(e) => setSurveyData({ ...surveyData, preferred_communication: e.target.value })}
                checked={surveyData.preferred_communication === option}
              />
              {option}
            </label>
          ))}
        </div>
      ),
      validation: () => surveyData.preferred_communication !== ""
    },
    {
      title: "Что для вас важнее: развлечение или победа?",
      content: (
        <div className="radio-group">
          {["Развлечение", "Победа"].map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                onChange={(e) => setSurveyData({ ...surveyData, purpose: e.target.value })}
                checked={surveyData.purpose === option}
              />
              {option}
            </label>
          ))}
        </div>
      ),
      validation: () => surveyData.purpose !== ""
    },
    {
      title: "Когда вы играете?",
      content: (
        <>
          <h4>В какие дни вы преимущественно играете?</h4>
          <div className="radio-group">
            {["Будние", "Выходные", "Любые дни"].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  onChange={(e) => setSurveyData({ ...surveyData, preferred_days: e.target.value })}
                  checked={surveyData.preferred_days === option}
                />
                {option}
              </label>
            ))}
          </div>
          <h4>В какое время суток вы чаще всего играете?</h4>
          <div className="radio-group">
            {["Утро (6:00 – 12:00)", "День (12:00 – 18:00)", 
              "Вечер (18:00 – 00:00)", "Ночь (00:00 – 6:00)"].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  onChange={(e) => setSurveyData({ ...surveyData, preferred_time: e.target.value })}
                  checked={surveyData.preferred_time === option}
                />
                {option}
              </label>
            ))}
          </div>
        </>
      ),
      validation: () => 
        surveyData.preferred_days !== "" && surveyData.preferred_time !== ""
    },
    {
      title: "Какие ваши любимые игры?",
      content: (
        <div 
          className="game-selector" 
          ref={dropdownRef}
          onClick={handleContainerClick}
        >
          <div className="search-container">
            <input
              type="text"
              placeholder="Поиск игр..."
              value={searchQuery}
              onChange={handleSearch}
              onFocus={handleSearchFocus}
              className="search-input"
              onClick={(e) => e.stopPropagation()}
            />
            <span className={`arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
          </div>
          
          {isDropdownOpen && (
            <div className="dropdown-options">
              {filteredGames.length > 0 ? (
                filteredGames.map(game => (
                  <div 
                    key={game} 
                    className="option" 
                    onClick={() => handleGameSelect(game)}
                    role="button"
                    tabIndex={0}
                  >
                    <input
                      type="checkbox"
                      id={game}
                      checked={surveyData.favorite_games.includes(game)}
                      onChange={() => handleGameSelect(game)}
                    />
                    <label htmlFor={game} className="game-label">{game}</label>
                  </div>
                ))
              ) : (
                <div className="no-results">Ничего не найдено</div>
              )}
            </div>
          )}
          
          <div className="selected-games">
            {surveyData.favorite_games.map((game, index) => (
              <div key={index} className="game-tag">
                {game}
                <button 
                  type="button"
                  className="remove-game"
                  onClick={() => handleGameSelect(game)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ),
      validation: () => surveyData.favorite_games.length > 0
    },
  ];

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setSurveyData(prevState => ({
      ...prevState,
      [field]: checked 
        ? [...prevState[field], value] 
        : prevState[field].filter(item => item !== value),
    }));
  };

  const goToNextStep = () => {
    const currentStepData = steps[currentStep];
    if (currentStepData.validation()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };


  const handleSave = async () => {
    if (!steps.every(step => step.validation())) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/user/survey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(surveyData),
      });
      
      if (!response.ok) {
        throw new Error("Ошибка при сохранении данных");
      }

      alert("Данные успешно сохранены!");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Не удалось сохранить данные");
    }
  };

  return (
    <div className="survey">
      <h2>{steps[currentStep].title}</h2>
      <div className="survey-content">{steps[currentStep].content}</div>
      <div className="survey-navigation">
        {currentStep > 0 && (
          <button onClick={goToPreviousStep}>Назад</button>
        )}
        
        {currentStep < steps.length - 1 && (
          <button 
            onClick={goToNextStep}
            disabled={!steps[currentStep].validation()}
          >
            Далее
          </button>
        )}
        
        {currentStep === steps.length - 1 && (
          <button 
            onClick={handleSave}
            disabled={!steps[currentStep].validation()}
          >
            Сохранить
          </button>
        )}
      </div>
    </div>
  );
}

export default Survey;