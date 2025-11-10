class QuantumEvolution {
    constructor() {
        this.energy = 0;
        this.knowledge = 0;
        this.prestige = 0;
        this.currentStage = 0;
        this.autoGrowth = false;
        this.autoGrowthCost = 1000;
        this.clickPower = 1;
        this.totalEnergy = 0;
        
        this.stages = [
            { name: "Планковская длина", size: 1.6e-35, fact: "Наименьшая возможная длина в физике" },
            { name: "Квантовая пена", size: 1e-33, fact: "Пространство-время теряет непрерывность" },
            { name: "Струны", size: 1e-32, fact: "Фундаментальные одномерные объекты" },
            { name: "Кварк", size: 1e-18, fact: "Фундаментальная частица материи" },
            { name: "Электрон", size: 1e-15, fact: "Отрицательно заряженная элементарная частица" },
            { name: "Атом водорода", size: 5.3e-11, fact: "Самый простой и распространенный атом" },
            { name: "Водородная молекула", size: 7.4e-11, fact: "Два атома водорода, связанные вместе" },
            { name: "Вирус", size: 1e-7, fact: "Грань между живым и неживым" },
            { name: "Бактерия", size: 1e-6, fact: "Простейшая форма жизни" },
            { name: "Клетка человека", size: 1e-5, fact: "Основная единица жизни" },
            { name: "Песчинка", size: 1e-3, fact: "Микроскопический камень" },
            { name: "Муравей", size: 5e-3, fact: "Социальное насекомое с сложным поведением" },
            { name: "Человек", size: 1.7, fact: "Homo sapiens - человек разумный" },
            { name: "Синий кит", size: 30, fact: "Крупнейшее животное на Земле" },
            { name: "Статуя Свободы", size: 93, fact: "Символ свободы и демократии" },
            { name: "Эверест", size: 8848, fact: "Высочайшая вершина Земли" },
            { name: "Земля", size: 1.274e7, fact: "Наш дом в космосе" },
            { name: "Юпитер", size: 1.398e8, fact: "Крупнейшая планета Солнечной системы" },
            { name: "Солнце", size: 1.392e9, fact: "Звезда, дающая жизнь Земле" },
            { name: "Солнечная система", size: 2.9e12, fact: "Наша космическая обитель" },
            { name: "Световой год", size: 9.46e15, fact: "Расстояние, которое свет проходит за год" },
            { name: "Галактика Млечный Путь", size: 9.46e17, fact: "Наша галактика с миллиардами звезд" },
            { name: "Местная группа", size: 3e20, fact: "Группа галактик, включающая Млечный Путь" },
            { name: "Наблюдаемая Вселенная", size: 8.8e26, fact: "Предел того, что мы можем увидеть" }
        ];

        this.researches = [
            {
                id: "quantum_mechanics",
                name: "Квантовая механика",
                description: "Откройте принципы квантового мира",
                cost: { knowledge: 100, energy: 1000 },
                effect: () => { this.clickPower *= 2; },
                requirements: [],
                era: "quantum"
            },
            {
                id: "nuclear_physics",
                name: "Ядерная физика",
                description: "Изучите строение атомного ядра",
                cost: { knowledge: 500, energy: 5000 },
                effect: () => { this.autoGrowthCost *= 0.8; },
                requirements: ["quantum_mechanics"],
                era: "atomic"
            }
        ];

        this.completedResearches = [];
        this.ranking = [];
        
        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.render();
        this.startGameLoop();
        
        // Инициализация рейтинга (демо данные)
        this.initRanking();
    }

    setupEventListeners() {
        document.getElementById('quantum-click').addEventListener('click', () => this.quantumClick());
        document.getElementById('big-bang').addEventListener('click', () => this.bigBang());
        document.getElementById('auto-growth').addEventListener('click', () => this.toggleAutoGrowth());
        
        // Навигация
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
    }

    quantumClick() {
        this.energy += this.clickPower;
        this.totalEnergy += this.clickPower;
        this.increaseSize(this.clickPower);
        this.createParticles(5);
        this.updateQuantumObject();
        this.render();
    }

    increaseSize(amount) {
        const currentSize = this.stages[this.currentStage].size;
        const nextSize = this.stages[this.currentStage + 1]?.size;
        
        if (nextSize && currentSize * (1 + amount/1000) >= nextSize) {
            this.currentStage++;
            this.showNotification(`🎉 Новый этап: ${this.stages[this.currentStage].name}`, this.stages[this.currentStage].fact);
            this.updateQuantumObject();
        }
    }

    updateQuantumObject() {
        const object = document.getElementById('quantum-object');
        const size = Math.max(20, Math.min(200, 20 + this.currentStage * 10));
        object.style.transform = `scale(${size / 20})`;
        
        // Обновляем класс эры для визуальных эффектов
        object.className = 'quantum-object';
        if (this.currentStage < 5) object.classList.add('era-quantum');
        else if (this.currentStage < 10) object.classList.add('era-atomic');
        else object.classList.add('era-cosmic');
    }

    createParticles(count) {
        const container = document.getElementById('particles');
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 6000);
        }
    }

    toggleAutoGrowth() {
        if (this.energy >= this.autoGrowthCost && !this.autoGrowth) {
            this.energy -= this.autoGrowthCost;
            this.autoGrowth = true;
            this.showNotification("✅ Авто-рост активирован!", "Теперь размер увеличивается автоматически");
        }
    }

    canBigBang() {
        return this.currentStage >= 18; // После Солнца
    }

    bigBang() {
        if (!this.canBigBang()) {
            this.showNotification("❌ Слишком мал для Большого Взрыва!", "Достигните размера больше Солнца");
            return;
        }

        const currentSize = this.stages[this.currentStage].size;
        const prestigeGained = Math.floor(currentSize / 1000); // 1 престиж за каждый км
        const speedBonus = 1 + (prestigeGained * 0.001); // +0.1% за престиж

        this.prestige += prestigeGained;
        this.clickPower *= speedBonus;
        
        this.showNotification(
            "💥 БОЛЬШОЙ ВЗРЫВ!", 
            `Получено ${prestigeGained} престижа! Скорость увеличена на ${((speedBonus - 1) * 100).toFixed(1)}%`
        );

        // Сброс прогресса
        this.energy = 0;
        this.currentStage = 0;
        this.autoGrowth = false;
        this.totalEnergy = 0;

        this.updateRanking();
        this.render();
    }

    updateRanking() {
        const playerData = {
            name: "Ты", // В реальной игре брать из Telegram
            prestige: this.prestige,
            stage: this.stages[this.currentStage].name,
            timestamp: Date.now()
        };

        // Обновляем или добавляем игрока в рейтинг
        const existingIndex = this.ranking.findIndex(p => p.name === playerData.name);
        if (existingIndex >= 0) {
            this.ranking[existingIndex] = playerData;
        } else {
            this.ranking.push(playerData);
        }

        // Сортируем по престижу
        this.ranking.sort((a, b) => b.prestige - a.prestige);
    }

    initRanking() {
        // Демо данные для рейтинга
        this.ranking = [
            { name: "QuantumMaster", prestige: 12847, stage: "Мультивселенная", timestamp: Date.now() - 86400000 },
            { name: "GalaxyExplorer", prestige: 9632, stage: "Сверхскопление", timestamp: Date.now() - 172800000 },
            { name: "StarTraveler", prestige: 7415, stage: "Галактическое скопление", timestamp: Date.now() - 259200000 },
            { name: "Ты", prestige: this.prestige, stage: this.stages[this.currentStage].name, timestamp: Date.now() }
        ].sort((a, b) => b.prestige - a.prestige);
    }

    showNotification(title, message) {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <strong>${title}</strong><br>
            <small>${message}</small>
        `;
        
        notifications.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    switchTab(tabName) {
        // Обновляем активные кнопки навигации
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Обновляем активные вкладки
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');

        // Если переключаемся на рейтинг, обновляем его
        if (tabName === 'ranking') {
            this.renderRanking();
        }
    }

    render() {
        // Обновляем ресурсы
        document.getElementById('energy-count').textContent = Math.floor(this.energy);
        document.getElementById('knowledge-count').textContent = Math.floor(this.knowledge);
        document.getElementById('prestige-count').textContent = this.prestige;
        
        // Обновляем информацию о этапе
        const stage = this.stages[this.currentStage];
        document.getElementById('stage-name').textContent = stage.name;
        document.getElementById('current-size').textContent = this.formatSize(stage.size);
        
        // Обновляем прогресс
        const progress = this.calculateProgress();
        document.getElementById('progress-fill').style.width = progress.percentage + '%';
        document.getElementById('progress-text').textContent = progress.percentage + '%';
        
        // Обновляем кнопку Большого Взрыва
        document.getElementById('big-bang').disabled = !this.canBigBang();
        
        // Обновляем кнопку авто-роста
        const autoBtn = document.getElementById('auto-growth');
        autoBtn.disabled = this.autoGrowth || this.energy < this.autoGrowthCost;
        autoBtn.innerHTML = this.autoGrowth ? 
            '<span class="button-icon">🔁</span><span class="pixel-text">Авто-рост (АКТИВНО)</span>' :
            `<span class="button-icon">🔁</span><span class="pixel-text">Авто-рост (${this.autoGrowthCost}⚡)</span>`;
    }

    renderRanking() {
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';
        
        this.ranking.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = `ranking-item ${player.name === 'Ты' ? 'current' : ''}`;
            item.innerHTML = `
                <div>
                    <span class="rank-number">#${index + 1}</span>
                    <span class="pixel-text">${player.name}</span>
                </div>
                <div class="pixel-text">${player.prestige} престижа</div>
            `;
            rankingList.appendChild(item);
        });
    }

    calculateProgress() {
        if (this.currentStage >= this.stages.length - 1) {
            return { percentage: 100, nextStage: null };
        }
        
        const currentSize = this.stages[this.currentStage].size;
        const nextSize = this.stages[this.currentStage + 1].size;
        const progress = (currentSize / nextSize) * 100;
        
        return { 
            percentage: Math.min(100, Math.max(0, Math.floor(progress))),
            nextStage: this.stages[this.currentStage + 1]
        };
    }

    formatSize(size) {
        const units = ['м', 'км', 'Мм', 'Гм', 'Тм', 'Пм', 'Эм', 'Зм', 'Йм'];
        let unitIndex = 0;
        
        while (size >= 1000 && unitIndex < units.length - 1) {
            size /= 1000;
            unitIndex++;
        }
        
        return size.toExponential(2) + ' ' + units[unitIndex];
    }

    startGameLoop() {
        setInterval(() => {
            if (this.autoGrowth) {
                this.energy += this.clickPower * 0.1;
                this.totalEnergy += this.clickPower * 0.1;
                this.increaseSize(this.clickPower * 0.01);
            }
            
            // Пассивная генерация знаний
            this.knowledge += this.prestige * 0.001 + this.currentStage * 0.01;
            
            this.render();
        }, 1000);
    }

    loadGame() {
        // Загрузка из Telegram Cloud Storage или localStorage
        const saved = localStorage.getItem('quantum-evolution');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(this, data);
        }
    }

    saveGame() {
        // Сохранение в Telegram Cloud Storage или localStorage
        const saveData = {
            energy: this.energy,
            knowledge: this.knowledge,
            prestige: this.prestige,
            currentStage: this.currentStage,
            autoGrowth: this.autoGrowth,
            clickPower: this.clickPower,
            totalEnergy: this.totalEnergy,
            completedResearches: this.completedResearches
        };
        localStorage.setItem('quantum-evolution', JSON.stringify(saveData));
    }
}

// Авто-сохранение каждые 30 секунд
setInterval(() => {
    if (window.game) {
        window.game.saveGame();
    }
}, 30000);

// Инициализация игры когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    window.game = new QuantumEvolution();
});