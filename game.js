class QuantumEvolution {
    constructor() {
        this.energy = 0;
        this.prestige = 0;
        this.currentStage = 0;
        this.autoGrowthLevel = 0;
        this.clickPower = 1;
        this.totalEnergy = 0;
        this.totalClicks = 0;
        this.startTime = Date.now();
        this.lastSave = Date.now();
        this.playerId = this.generatePlayerId();
        
        // Новые переменные для статистики
        this.currentObjectSize = this.stages[0].size;
        this.maxSizeReached = this.stages[0].size;
        this.bigBangCount = 0;
        this.playTime = 0;
        
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

        this.upgrades = [
            {
                id: "click_power_1",
                name: "Усилитель клика I",
                description: "Увеличивает силу клика на +1",
                cost: 50,
                costMultiplier: 1.8,
                type: "click",
                effect: () => { this.clickPower += 1; },
                maxLevel: 10,
                currentLevel: 0
            },
            {
                id: "click_power_2", 
                name: "Усилитель клика II",
                description: "Увеличивает силу клика на +5",
                cost: 500,
                costMultiplier: 2.0,
                type: "click",
                effect: () => { this.clickPower += 5; },
                maxLevel: 5,
                currentLevel: 0,
                requirement: { upgrade: "click_power_1", level: 5 }
            }
        ];

        this.researches = [
            {
                id: "quantum_mechanics",
                name: "Квантовая механика",
                description: "Удваивает силу клика",
                cost: 1000,
                effect: () => { this.clickPower *= 2; },
                requirements: [],
                researched: false
            },
            {
                id: "nuclear_physics",
                name: "Ядерная физика",
                description: "Увеличивает эффективность авто-роста на 50%", 
                cost: 5000,
                effect: () => { this.autoEfficiency *= 1.5; },
                requirements: ["quantum_mechanics"],
                researched: false
            },
            {
                id: "cosmology",
                name: "Космология",
                description: "Увеличивает бонус престижа на 25%",
                cost: 10000,
                effect: () => { this.prestigeBonusMultiplier *= 1.25; },
                requirements: ["nuclear_physics"],
                researched: false
            }
        ];

        // Настройки авто-роста
        this.autoEfficiency = 1.0;
        this.autoBaseCost = 1000;
        this.autoCostMultiplier = 1.5;
        
        // Настройки престижа
        this.prestigeBonusMultiplier = 1.0;
        this.prestigeHistory = [];

        this.ranking = [];
        
        this.init();
    }

    generatePlayerId() {
        let id = localStorage.getItem('quantum_player_id');
        if (!id) {
            id = 'player_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('quantum_player_id', id);
        }
        return id;
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.render();
        this.startGameLoop();
        this.loadRanking();
        
        // Автосохранение
        window.addEventListener('beforeunload', () => this.saveGame());
        setInterval(() => this.saveGame(), 10000);
        setInterval(() => this.updateRanking(), 30000);
    }

    setupEventListeners() {
        // Основная кнопка клика
        const clickButton = document.getElementById('quantum-click');
        clickButton.addEventListener('click', () => this.quantumClick());
        clickButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.quantumClick();
        }, { passive: false });

        // Кнопка авто-роста
        document.getElementById('buy-auto').addEventListener('click', () => this.buyAutoGrowth());
        
        // Кнопка Большого Взрыва
        document.getElementById('big-bang').addEventListener('click', () => this.bigBang());

        // Навигация
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            }, { passive: false });
        });

        // Защита от дабл-тапа
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    quantumClick() {
        this.energy += this.clickPower;
        this.totalEnergy += this.clickPower;
        this.totalClicks++;
        
        this.increaseSize(this.clickPower);
        this.createParticles(3);
        this.updateQuantumObject();
        this.render();
        
        this.quickSave();
    }

    increaseSize(amount) {
        const currentStageSize = this.stages[this.currentStage].size;
        const nextStageSize = this.stages[this.currentStage + 1]?.size;
        
        // Увеличиваем текущий размер объекта
        this.currentObjectSize = currentStageSize * (1 + amount / 10000);
        this.maxSizeReached = Math.max(this.maxSizeReached, this.currentObjectSize);
        
        if (nextStageSize && this.currentObjectSize >= nextStageSize) {
            this.currentStage++;
            this.currentObjectSize = this.stages[this.currentStage].size;
            this.showNotification(`🎉 Новый этап: ${this.stages[this.currentStage].name}`, this.stages[this.currentStage].fact);
            this.updateQuantumObject();
            
            this.quickSave();
            this.updateRanking();
        }
    }

    updateQuantumObject() {
        const object = document.getElementById('quantum-object');
        const size = Math.max(24, Math.min(200, 24 + this.currentStage * 8));
        object.style.transform = `scale(${size / 24})`;
        
        object.className = 'quantum-object';
        if (this.currentStage < 5) object.classList.add('era-quantum');
        else if (this.currentStage < 10) object.classList.add('era-atomic');
        else object.classList.add('era-cosmic');
    }

    createParticles(count) {
        const container = document.getElementById('particles');
        if (container.children.length > 20) {
            Array.from(container.children).slice(0, 5).forEach(child => child.remove());
        }

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode === container) {
                    particle.remove();
                }
            }, 6000);
        }
    }

    getAutoGrowthCost() {
        return Math.floor(this.autoBaseCost * Math.pow(this.autoCostMultiplier, this.autoGrowthLevel));
    }

    getAutoGrowthSpeed() {
        return this.clickPower * 0.1 * this.autoEfficiency * (1 + this.autoGrowthLevel * 0.5);
    }

    buyAutoGrowth() {
        const cost = this.getAutoGrowthCost();
        if (this.energy >= cost) {
            this.energy -= cost;
            this.autoGrowthLevel++;
            this.showNotification("✅ Авто-рост улучшен!", `Уровень ${this.autoGrowthLevel}`);
            this.renderDevelopmentTab();
            this.quickSave();
        } else {
            this.showNotification("❌ Недостаточно энергии", `Нужно ${cost}⚡`);
        }
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade || upgrade.currentLevel >= upgrade.maxLevel) return;

        if (upgrade.requirement) {
            const reqUpgrade = this.upgrades.find(u => u.id === upgrade.requirement.upgrade);
            if (!reqUpgrade || reqUpgrade.currentLevel < upgrade.requirement.level) {
                this.showNotification("❌ Требования не выполнены", `Нужно улучшение "${reqUpgrade.name}" уровня ${upgrade.requirement.level}`);
                return;
            }
        }

        const cost = upgrade.cost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel);
        if (this.energy >= cost) {
            this.energy -= cost;
            upgrade.currentLevel++;
            upgrade.effect();
            
            this.showNotification("✅ Улучшение куплено!", `${upgrade.name} уровень ${upgrade.currentLevel}`);
            this.renderDevelopmentTab();
            this.quickSave();
        } else {
            this.showNotification("❌ Недостаточно энергии", `Нужно ${Math.floor(cost)}⚡`);
        }
    }

    research(researchId) {
        const research = this.researches.find(r => r.id === researchId);
        if (!research || research.researched) return;

        const canResearch = research.requirements.every(reqId => 
            this.researches.find(r => r.id === reqId)?.researched
        );

        if (!canResearch) {
            this.showNotification("❌ Требования не выполнены", "Исследуйте предыдущие технологии");
            return;
        }

        if (this.energy >= research.cost) {
            this.energy -= research.cost;
            research.researched = true;
            research.effect();
            
            this.showNotification("🔬 Исследование завершено!", research.name);
            this.renderDevelopmentTab();
            this.quickSave();
        } else {
            this.showNotification("❌ Недостаточно энергии", `Нужно ${research.cost}⚡`);
        }
    }

    canBigBang() {
        const sizeRequirement = this.currentStage >= 18; // После Солнца
        const energyRequirement = this.energy >= 10000;
        return sizeRequirement && energyRequirement;
    }

    bigBang() {
        if (!this.canBigBang()) return;

        const currentSize = this.stages[this.currentStage].size;
        const prestigeGained = Math.floor(currentSize / 1000);
        const speedBonus = 1 + (prestigeGained * 0.001 * this.prestigeBonusMultiplier);

        this.prestige += prestigeGained;
        this.clickPower *= speedBonus;
        this.bigBangCount++;
        
        // Сохраняем историю
        this.prestigeHistory.unshift({
            cycle: this.bigBangCount,
            prestige: prestigeGained,
            bonus: speedBonus,
            stage: this.stages[this.currentStage].name,
            timestamp: Date.now()
        });

        this.showNotification(
            "💥 БОЛЬШОЙ ВЗРЫВ!", 
            `Получено ${prestigeGained} престижа! Скорость увеличена на ${((speedBonus - 1) * 100).toFixed(1)}%`
        );

        // Сброс прогресса
        this.energy = 0;
        this.currentStage = 0;
        this.currentObjectSize = this.stages[0].size;
        this.autoGrowthLevel = 0;
        this.totalEnergy = 0;
        this.totalClicks = 0;

        // Сохраняем улучшения и исследования
        this.updateRanking();
        this.render();
        this.saveGame();
    }

    updateRanking() {
        const playerData = {
            id: this.playerId,
            name: this.getPlayerName(),
            prestige: this.prestige,
            stage: this.stages[this.currentStage].name,
            stageIndex: this.currentStage,
            lastActive: Date.now(),
            clickPower: this.clickPower,
            totalEnergy: this.totalEnergy
        };

        this.savePlayerData(playerData);
        this.loadRanking();
    }

    getPlayerName() {
        return "Игрок_" + this.playerId.substr(7, 4);
    }

    savePlayerData(playerData) {
        let allPlayers = JSON.parse(localStorage.getItem('quantum_ranking') || '{}');
        allPlayers[playerData.id] = playerData;
        
        // Очистка старых записей
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        Object.keys(allPlayers).forEach(id => {
            if (allPlayers[id].lastActive < weekAgo) {
                delete allPlayers[id];
            }
        });
        
        localStorage.setItem('quantum_ranking', JSON.stringify(allPlayers));
    }

    loadRanking() {
        const allPlayers = JSON.parse(localStorage.getItem('quantum_ranking') || '{}');
        this.ranking = Object.values(allPlayers)
            .sort((a, b) => b.prestige - a.prestige || b.stageIndex - a.stageIndex || b.totalEnergy - a.totalEnergy)
            .slice(0, 50);
        
        this.renderRanking();
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
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');

        if (tabName === 'development') {
            this.renderDevelopmentTab();
        } else if (tabName === 'prestige') {
            this.renderPrestigeTab();
        } else if (tabName === 'stats') {
            this.renderStatsTab();
        }
    }

    formatSize(size) {
        if (size < 0.001) {
            return size.toExponential(2) + ' м';
        }
        
        const units = ['м', 'км', 'Мм', 'Гм', 'Тм', 'Пм', 'Эм', 'Зм', 'Йм'];
        let unitIndex = 0;
        let formattedSize = size;
        
        while (formattedSize >= 1000 && unitIndex < units.length - 1) {
            formattedSize /= 1000;
            unitIndex++;
        }
        
        if (formattedSize >= 1000) {
            return formattedSize.toExponential(2) + ' ' + units[unitIndex];
        } else {
            return formattedSize.toFixed(2) + ' ' + units[unitIndex];
        }
    }

    calculateProgress() {
        if (this.currentStage >= this.stages.length - 1) {
            return { percentage: 100, nextStage: null };
        }
        
        const currentStageSize = this.stages[this.currentStage].size;
        const nextStageSize = this.stages[this.currentStage + 1].size;
        
        const currentLog = Math.log10(this.currentObjectSize);
        const currentStageLog = Math.log10(currentStageSize);
        const nextStageLog = Math.log10(nextStageSize);
        
        const progress = ((currentLog - currentStageLog) / (nextStageLog - currentStageLog)) * 100;
        
        return { 
            percentage: Math.min(100, Math.max(0, Math.floor(progress))),
            nextStage: this.stages[this.currentStage + 1]
        };
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    render() {
        // Основные ресурсы
        document.getElementById('energy-count').textContent = Math.floor(this.energy);
        document.getElementById('prestige-count').textContent = this.prestige;
        document.getElementById('click-power').textContent = this.clickPower;
        
        // Информация о этапе
        const stage = this.stages[this.currentStage];
        document.getElementById('stage-name').textContent = stage.name;
        document.getElementById('current-size').textContent = this.formatSize(this.currentObjectSize);
        
        // Прогресс-бар
        const progress = this.calculateProgress();
        document.getElementById('progress-fill').style.width = progress.percentage + '%';
        document.getElementById('progress-text').textContent = progress.percentage + '%';
        
        // Бонусы на вкладке Эволюция
        document.getElementById('bonus-click').textContent = this.clickPower + '⚡';
        document.getElementById('bonus-auto').textContent = this.getAutoGrowthSpeed().toFixed(1) + '⚡/с';
        document.getElementById('bonus-prestige').textContent = (1 + this.prestige * 0.001 * this.prestigeBonusMultiplier).toFixed(2) + 'x';
        
        // Статистика на вкладке Эволюция
        document.getElementById('stat-total-clicks').textContent = this.totalClicks;
        document.getElementById('stat-play-time').textContent = this.formatTime(this.playTime);
        document.getElementById('stat-max-size').textContent = this.formatSize(this.maxSizeReached);
        document.getElementById('stat-stages-completed').textContent = this.currentStage + '/24';
        
        // Обновляем кнопку Большого Взрыва
        document.getElementById('big-bang').disabled = !this.canBigBang();
    }

    renderDevelopmentTab() {
        // Авто-рост
        document.getElementById('auto-level').textContent = this.autoGrowthLevel;
        document.getElementById('auto-speed').textContent = this.getAutoGrowthSpeed().toFixed(1);
        document.getElementById('auto-efficiency').textContent = Math.floor(this.autoEfficiency * 100);
        document.getElementById('auto-cost').textContent = this.getAutoGrowthCost();
        
        // Улучшения клика
        const upgradesGrid = document.getElementById('upgrades-grid');
        upgradesGrid.innerHTML = '';
        
        this.upgrades.forEach(upgrade => {
            const cost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));
            const canAfford = this.energy >= cost;
            const canUpgrade = upgrade.currentLevel < upgrade.maxLevel && 
                (!upgrade.requirement || 
                 this.upgrades.find(u => u.id === upgrade.requirement.upgrade)?.currentLevel >= upgrade.requirement.level);
            
            const item = document.createElement('div');
            item.className = `upgrade-item ${canUpgrade && canAfford ? '' : 'locked'}`;
            item.innerHTML = `
                <div class="upgrade-header">
                    <span class="pixel-text">${upgrade.name}</span>
                    <span class="upgrade-level">Ур. ${upgrade.currentLevel}/${upgrade.maxLevel}</span>
                </div>
                <div class="upgrade-description">${upgrade.description}</div>
                <div class="upgrade-stats">
                    <span>Стоимость: ${cost}⚡</span>
                    <span>${canUpgrade && canAfford ? 'ДОСТУПНО' : 'НЕДОСТУПНО'}</span>
                </div>
            `;
            
            if (canUpgrade && canAfford) {
                item.addEventListener('click', () => this.buyUpgrade(upgrade.id));
                item.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.buyUpgrade(upgrade.id);
                }, { passive: false });
            }
            
            upgradesGrid.appendChild(item);
        });

        // Исследования
        const researchGrid = document.getElementById('research-grid');
        researchGrid.innerHTML = '';
        
        this.researches.forEach(research => {
            const canResearch = !research.researched && 
                research.requirements.every(reqId => this.researches.find(r => r.id === reqId)?.researched);
            const canAfford = this.energy >= research.cost;
            
            const item = document.createElement('div');
            item.className = `research-item ${canResearch && canAfford ? '' : 'locked'} ${research.researched ? 'unlocked' : ''}`;
            item.innerHTML = `
                <div class="pixel-text" style="margin-bottom: 8px;">${research.name}</div>
                <div style="font-size: 9px; margin-bottom: 8px;">${research.description}</div>
                <div class="research-cost">
                    <span>${research.cost}⚡</span>
                    <span>${research.researched ? 'ИССЛЕДОВАНО' : canResearch && canAfford ? 'ИССЛЕДОВАТЬ' : 'НЕДОСТУПНО'}</span>
                </div>
            `;
            
            if (canResearch && canAfford && !research.researched) {
                item.addEventListener('click', () => this.research(research.id));
                item.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.research(research.id);
                }, { passive: false });
            }
            
            researchGrid.appendChild(item);
        });
    }

    renderPrestigeTab() {
        document.getElementById('current-prestige').textContent = this.prestige;
        document.getElementById('total-multiplier').textContent = (1 + this.prestige * 0.001 * this.prestigeBonusMultiplier).toFixed(2) + 'x';
        document.getElementById('next-bonus').textContent = '+' + (0.1 * this.prestigeBonusMultiplier).toFixed(1) + '%';
        
        // Требования
        const sizeRequirement = this.currentStage >= 18;
        const energyRequirement = this.energy >= 10000;
        
        document.getElementById('size-status').textContent = sizeRequirement ? '✅' : '❌';
        document.getElementById('energy-status').textContent = energyRequirement ? '✅' : '❌';
        
        // История
        const historyList = document.getElementById('prestige-history-list');
        historyList.innerHTML = '';
        
        if (this.prestigeHistory.length === 0) {
            historyList.innerHTML = '<div class="history-item">История пуста</div>';
        } else {
            this.prestigeHistory.slice(0, 5).forEach(entry => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.innerHTML = `Цикл ${entry.cycle}: ${entry.prestige} престижа (+${((entry.bonus - 1) * 100).toFixed(1)}%)`;
                historyList.appendChild(item);
            });
        }
    }

    renderStatsTab() {
        document.getElementById('stat-total-time').textContent = this.formatTime(this.playTime);
        document.getElementById('stat-all-clicks').textContent = this.totalClicks;
        document.getElementById('stat-total-energy').textContent = Math.floor(this.totalEnergy) + '⚡';
        document.getElementById('stat-all-max-size').textContent = this.formatSize(this.maxSizeReached);
        document.getElementById('stat-big-bangs').textContent = this.bigBangCount;
        
        this.renderRanking();
    }

    renderRanking() {
        const list = document.getElementById('ranking-list');
        if (!list) return;
        
        list.innerHTML = '';
        
        const currentPlayerIndex = this.ranking.findIndex(p => p.id === this.playerId);
        const playerRank = currentPlayerIndex + 1;
        
        this.ranking.slice(0, 10).forEach((player, index) => {
            const item = document.createElement('div');
            item.className = `ranking-item ${player.id === this.playerId ? 'current' : ''}`;
            item.innerHTML = `
                <div>
                    <span class="rank-number">#${index + 1}</span>
                    <span class="pixel-text">${player.name}</span>
                </div>
                <div class="pixel-text">${player.prestige}</div>
            `;
            list.appendChild(item);
        });
    }

    startGameLoop() {
        setInterval(() => {
            // Авто-рост
            if (this.autoGrowthLevel > 0) {
                const autoGain = this.getAutoGrowthSpeed();
                this.energy += autoGain;
                this.totalEnergy += autoGain;
                this.increaseSize(this.clickPower * 0.01 * this.autoEfficiency * (1 + this.autoGrowthLevel * 0.5));
            }
            
            // Обновление времени игры
            this.playTime = Math.floor((Date.now() - this.startTime) / 1000);
            
            this.render();
        }, 1000);
    }

    loadGame() {
        try {
            const saved = localStorage.getItem('quantum-evolution');
            if (saved) {
                const data = JSON.parse(saved);
                
                this.energy = data.energy || 0;
                this.prestige = data.prestige || 0;
                this.currentStage = data.currentStage || 0;
                this.currentObjectSize = data.currentObjectSize || this.stages[this.currentStage].size;
                this.autoGrowthLevel = data.autoGrowthLevel || 0;
                this.clickPower = data.clickPower || 1;
                this.totalEnergy = data.totalEnergy || 0;
                this.totalClicks = data.totalClicks || 0;
                this.startTime = data.startTime || Date.now();
                this.playTime = data.playTime || 0;
                this.maxSizeReached = data.maxSizeReached || this.stages[this.currentStage].size;
                this.bigBangCount = data.bigBangCount || 0;
                this.autoEfficiency = data.autoEfficiency || 1.0;
                this.prestigeBonusMultiplier = data.prestigeBonusMultiplier || 1.0;
                this.prestigeHistory = data.prestigeHistory || [];
                
                // Загрузка улучшений
                if (data.upgrades) {
                    data.upgrades.forEach(savedUpgrade => {
                        const upgrade = this.upgrades.find(u => u.id === savedUpgrade.id);
                        if (upgrade) {
                            upgrade.currentLevel = savedUpgrade.currentLevel || 0;
                        }
                    });
                }
                
                // Загрузка исследований
                if (data.researches) {
                    data.researches.forEach(savedResearch => {
                        const research = this.researches.find(r => r.id === savedResearch.id);
                        if (research) {
                            research.researched = savedResearch.researched || false;
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки игры:', error);
        }
    }

    saveGame() {
        try {
            const saveData = {
                energy: this.energy,
                prestige: this.prestige,
                currentStage: this.currentStage,
                currentObjectSize: this.currentObjectSize,
                autoGrowthLevel: this.autoGrowthLevel,
                clickPower: this.clickPower,
                totalEnergy: this.totalEnergy,
                totalClicks: this.totalClicks,
                startTime: this.startTime,
                playTime: this.playTime,
                maxSizeReached: this.maxSizeReached,
                bigBangCount: this.bigBangCount,
                autoEfficiency: this.autoEfficiency,
                prestigeBonusMultiplier: this.prestigeBonusMultiplier,
                prestigeHistory: this.prestigeHistory,
                upgrades: this.upgrades.map(upgrade => ({
                    id: upgrade.id,
                    currentLevel: upgrade.currentLevel
                })),
                researches: this.researches.map(research => ({
                    id: research.id,
                    researched: research.researched
                })),
                lastSave: Date.now()
            };
            
            localStorage.setItem('quantum-evolution', JSON.stringify(saveData));
            this.lastSave = Date.now();
            
            this.showSaveIndicator();
        } catch (error) {
            console.error('Ошибка сохранения игры:', error);
        }
    }

    quickSave() {
        if (Date.now() - this.lastSave > 2000) {
            this.saveGame();
        }
    }

    showSaveIndicator() {
        const indicator = document.getElementById('save-indicator');
        if (!indicator) return;
        
        indicator.textContent = 'Сохранено';
        indicator.className = 'save-indicator show';
        
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
}

// Автоисправление при загрузке
window.addEventListener('load', function() {
    setTimeout(() => {
        if (window.game && window.game.renderRanking) {
            window.game.renderRanking();
        }
    }, 500);
});

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    window.game = new QuantumEvolution();
    document.body.classList.add('no-select');
});