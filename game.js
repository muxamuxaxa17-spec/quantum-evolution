// Основные данные игры
let gameState = {
    // Прогресс
    size: 1.6e-35,
    currentStage: 0,
    currentEra: 0,
    
    // Ресурсы
    energy: 1250,
    knowledge: 450,
    quantumFragments: 0,
    
    // Автоматизация
    autoGrowth: 0,
    growthMultiplier: 1,
    
    // Исследования
    researches: [],
    
    // Статистика
    totalClicks: 0,
    totalBigBangs: 0,
    gameStartTime: Date.now()
};

// Этапы игры (сокращенная версия для начала)
const stages = [
    // Квантовая эра
    { name: "Планковская длина", size: 1.6e-35, era: "quantum", fact: "Наименьшая возможная длина в физике" },
    { name: "Квантовые струны", size: 1e-34, era: "quantum", fact: "Гипотетические одномерные объекты" },
    { name: "Виртуальные частицы", size: 1e-33, era: "quantum", fact: "Появляются и исчезают в квантовой пене" },
    
    // Атомная эра
    { name: "Атом водорода", size: 1e-10, era: "atomic", fact: "Самый распространенный элемент во Вселенной" },
    { name: "Атом углерода", size: 1.5e-10, era: "atomic", fact: "Основа всей органической химии" },
    
    // Биологическая эра
    { name: "Вирус", size: 1e-7, era: "biological", fact: "Не считается живым организмом" },
    { name: "Бактерия", size: 1e-6, era: "biological", fact: "Первые живые организмы на Земле" },
    
    // ... и так далее
];

// Инициализация игры
function initGame() {
    loadGame();
    setupEventListeners();
    startGameLoop();
    updateDisplay();
}

// Загрузка сохранения
function loadGame() {
    const saved = localStorage.getItem('quantumEvolutionSave');
    if (saved) {
        try {
            gameState = { ...gameState, ...JSON.parse(saved) };
        } catch (e) {
            console.log('Ошибка загрузки:', e);
        }
    }
}

// Сохранение игры
function saveGame() {
    try {
        localStorage.setItem('quantumEvolutionSave', JSON.stringify(gameState));
    } catch (e) {
        console.log('Ошибка сохранения:', e);
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Основная кнопка
    document.getElementById('quantum-fluctuation').addEventListener('click', handleQuantumFluctuation);
    document.getElementById('quantum-fluctuation').addEventListener('touchstart', function(e) {
        e.preventDefault();
        handleQuantumFluctuation();
    });
    
    // Быстрые кнопки
    document.getElementById('auto-growth').addEventListener('click', handleAutoGrowth);
    document.getElementById('research-btn').addEventListener('click', showResearchTab);
    document.getElementById('prestige-btn').addEventListener('click', handlePrestige);
    
    // Навигация
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
}

// Основной игровой цикл
function startGameLoop() {
    setInterval(() => {
        // Автоматический рост
        if (gameState.autoGrowth > 0) {
            gameState.size += gameState.autoGrowth * gameState.growthMultiplier;
            checkStageProgression();
            updateDisplay();
        }
        
        // Авто-сохранение каждые 30 секунд
        if (Date.now() % 30000 < 100) {
            saveGame();
        }
    }, 1000);
}

// Обработка квантовой флуктуации
function handleQuantumFluctuation() {
    const baseGrowth = 1.6e-37;
    gameState.size += baseGrowth * gameState.growthMultiplier;
    gameState.energy += 1;
    gameState.totalClicks++;
    
    // Анимация кнопки
    const btn = document.getElementById('quantum-fluctuation');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
    
    checkStageProgression();
    updateDisplay();
}

// Проверка прогресса этапов
function checkStageProgression() {
    const currentStage = stages[gameState.currentStage];
    
    if (gameState.size >= currentStage.size) {
        // Переход на следующий этап
        if (gameState.currentStage < stages.length - 1) {
            gameState.currentStage++;
            showStageFact(stages[gameState.currentStage]);
        }
    }
}

// Показ факта о этапе
function showStageFact(stage) {
    // Создаем всплывающее уведомление
    const notification = document.createElement('div');
    notification.className = 'stage-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>🎉 Новый этап: ${stage.name}</h3>
            <p>${stage.fact}</p>
            <button class="notification-close">✨ Понятно</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Закрытие уведомления
    notification.querySelector('.notification-close').addEventListener('click', function() {
        document.body.removeChild(notification);
    });
}

// Обновление интерфейса
function updateDisplay() {
    // Обновляем размер
    document.getElementById('current-size').textContent = formatSize(gameState.size);
    
    // Обновляем этап и эру
    const currentStage = stages[gameState.currentStage];
    document.getElementById('current-stage').textContent = currentStage.name;
    document.getElementById('current-era').textContent = getEraName(currentStage.era);
    
    // Обновляем ресурсы
    document.getElementById('energy').textContent = formatNumber(gameState.energy);
    document.getElementById('knowledge').textContent = formatNumber(gameState.knowledge);
    document.getElementById('fragments').textContent = formatNumber(gameState.quantumFragments);
    
    // Обновляем прогресс-бар
    updateProgressBar();
}

// Форматирование чисел
function formatSize(size) {
    if (size < 1e-9) {
        return size.toExponential(2) + ' м';
    } else if (size < 1) {
        return (size * 1e9).toFixed(2) + ' нм';
    } else if (size < 1000) {
        return size.toFixed(2) + ' м';
    } else {
        return (size / 1000).toFixed(2) + ' км';
    }
}

function formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1e6) return (num / 1000).toFixed(1) + 'K';
    if (num < 1e9) return (num / 1e6).toFixed(1) + 'M';
    return (num / 1e9).toFixed(1) + 'B';
}

// Получение названия эры
function getEraName(eraKey) {
    const eras = {
        quantum: 'Квантовая эра',
        atomic: 'Атомная эра', 
        biological: 'Биологическая эра',
        // ... остальные эры
    };
    return eras[eraKey] || 'Неизвестная эра';
}

// Обновление прогресс-бара
function updateProgressBar() {
    const currentStage = stages[gameState.currentStage];
    const nextStage = stages[Math.min(gameState.currentStage + 1, stages.length - 1)];
    
    const progress = (gameState.size - currentStage.size) / (nextStage.size - currentStage.size);
    const progressPercent = Math.min(100, Math.max(0, progress * 100));
    
    document.getElementById('stage-progress').style.width = progressPercent + '%';
}

// Переключение вкладок
function switchTab(tabName) {
    // Обновляем активную кнопку
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Здесь будет логика отображения разных вкладок
    console.log('Переключение на вкладку:', tabName);
}

// Обработчики быстрых кнопок (заглушки)
function handleAutoGrowth() {
    // Логика покупки авто-роста
    console.log('Авто-рост');
}

function showResearchTab() {
    switchTab('research');
}

function handlePrestige() {
    // Логика большого взрыва
    if (confirm('Активировать Большой Взрыв? Весь прогресс сбросится, но вы получите квантовые осколки.')) {
        // Реализация престиж-системы
        console.log('Большой взрыв!');
    }
}

// Запуск игры при загрузке
document.addEventListener('DOMContentLoaded', initGame);