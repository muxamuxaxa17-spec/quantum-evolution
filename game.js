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
        this.lastSave = Date.now();
        this.playerId = this.generatePlayerId();
        
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
            },
            {
                id: "auto_efficiency",
                name: "Эффективность авто-роста",
                description: "Увеличивает эффективность авто-роста на 20%",
                cost: 200,
                costMultiplier: 1.5,
                type: "auto",
                effect: () => { this.autoEfficiency *= 1.2; },
                maxLevel: 10,
                currentLevel: 0
            },
            {
                id: "energy_storage",
                name: "Увеличение емкости",
                description: "Увеличивает максимальное количество энергии",
                cost: 100,
                costMultiplier: 1.3,
                type: "utility",
                effect: () => { this.energyCapacity *= 1.5; },
                maxLevel: 8,
                currentLevel: 0
            }
        ];

        this.autoEfficiency = 1.0;
        this.energyCapacity = 1e6;

        this.researches = [
            {
                id: "quantum_mechanics",
                name: "Квантовая механика",
                description: "Откройте принципы квантового мира",
                cost: { knowledge: 100, energy: 1000 },
                effect: () => { this.clickPower *= 2; },
                requirements: [],
                era: "quantum",
                researched: false
            },
            {
                id: "nuclear_physics",
                name: "Ядерная физика",
                description: "Изучите строение атомного ядра", 
                cost: { knowledge: 500, energy: 5000 },
                effect: () => { this.autoGrowthCost *= 0.8; },
                requirements: ["quantum_mechanics"],
                era: "atomic",
                researched: false
            }
        ];

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
        
        // Сохранение при закрытии страницы
        window.addEventListener('beforeunload', () => this.saveGame());
        
        // Периодическое сохранение каждые 10 секунд
        setInterval(() => {
            this.saveGame();
        }, 10000);

        // Периодическое обновление рейтинга
        setInterval(() => {
            this.updateRanking();
        }, 30000);
    }

    setupEventListeners() {
        document.getElementById('quantum-click').addEventListener('click', () => this.quantumClick());
        document.getElementById('quantum-click').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.quantumClick();
        }, { passive: false });

        document.getElementById('big-bang').addEventListener('click', () => this.bigBang());
        document.getElementById('auto-growth').addEventListener('click', () => this.toggleAutoGrowth());
        
        // Навигация
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            }, { passive: false });
        });

        // Предотвращение масштабирования при дабл-тапе
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
        this.increaseSize(this.clickPower);
        this.createParticles(3);
        this.updateQuantumObject();
        this.render();
        
        // Сохраняем после каждого клика
        this.quickSave();
    }

    increaseSize(amount) {
        const currentSize = this.stages[this.currentStage].size;
        const nextSize = this.stages[this.currentStage + 1]?.size;
        
        if (nextSize && currentSize * (1 + amount/10000) >= nextSize) {
            this.currentStage++;
            this.showNotification(`🎉 Новый этап: ${this.stages[this.currentStage].name}`, this.stages[this.currentStage].fact);
            this.updateQuantumObject();
            
            // Сохраняем при смене этапа
            this.quickSave();
            this.updateRanking();
        }
    }

    updateQuantumObject() {
        const object = document.getElementById('quantum-object');
        const size = Math.max(24, Math.min(200, 24 + this.currentStage * 8));
        object.style.transform = `scale(${size / 24})`;
        
        // Обновляем класс эры для визуальных эффектов
        object.className = 'quantum-object';
        if (this.currentStage < 5) object.classList.add('era-quantum');
        else if (this.currentStage < 10) object.classList.add('era-atomic');
        else object.classList.add('era-cosmic');
    }

    createParticles(count) {
        const container = document.getElementById('particles');
        // Ограничиваем количество частиц для производительности
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

    toggleAutoGrowth() {
        if (this.energy >= this.autoGrowthCost && !this.autoGrowth) {
            this.energy -= this.autoGrowthCost;
            this.autoGrowth = true;
            this.showNotification("✅ Авто-рост активирован!", "Теперь размер увеличивается автоматически");
            
            // Сохраняем после покупки авто-роста
            this.quickSave();
        }
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades.find(u => u.id === upgradeId);
        if (!upgrade || upgrade.currentLevel >= upgrade.maxLevel) return;

        // Проверяем требования
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
            this.renderUpgrades();
            this.quickSave();
        } else {
            this.showNotification("❌ Недостаточно энергии", `Нужно ${Math.floor(cost)}⚡`);
        }
    }

    research(researchId) {
        const research = this.researches.find(r => r.id === researchId);
        if (!research || research.researched) return;

        // Проверяем требования
        const canResearch = research.requirements.every(reqId => 
            this.researches.find(r => r.id === reqId)?.researched
        );

        if (!canResearch) {
            this.showNotification("❌ Требования не выполнены", "Исследуйте предыдущие технологии");
            return;
        }

        if (this.knowledge >= research.cost.knowledge && this.energy >= research.cost.energy) {
            this.knowledge -= research.cost.knowledge;
            this.energy -= research.cost.energy;
            research.researched = true;
            research.effect();
            
            this.showNotification("🔬 Исследование завершено!", research.name);
            this.renderResearch();
            this.quickSave();
        } else {
            this.showNotification("❌ Недостаточно ресурсов", `Нужно ${research.cost.knowledge}🧠 и ${research.cost.energy}⚡`);
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

        // Сброс прогресса (но сохраняем улучшения и исследования)
        this.energy = 0;
        this.currentStage = 0;
        this.autoGrowth = false;
        this.totalEnergy = 0;
        // Улучшения и исследования остаются!

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
        // В реальном приложении брать из Telegram
        return "Игрок_" + this.playerId.substr(7, 4);
    }

    savePlayerData(playerData) {
        let allPlayers = JSON.parse(localStorage.getItem('quantum_ranking') || '{}');
        allPlayers[playerData.id] = playerData;
        
        // Очищаем старые записи (старше 7 дней)
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
            .slice(0, 50); // Топ 50 игроков
        
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
        // Обновляем активные кнопки навигации
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Обновляем активные вкладки
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');

        // Загружаем контент вкладки
        if (tabName === 'ranking') {
            this.renderRanking();
        } else if (tabName === 'upgrades') {
            this.renderUpgrades();
        } else if (tabName === 'research') {
            this.renderResearch();
        }
    }

    render() {
        // Обновляем ресурсы
        document.getElementById('energy-count').textContent = Math.floor(this.energy);
        document.getElementById('knowledge-count').textContent = Math.floor(this.knowledge);
        document.getElementById('prestige-count').textContent = this.prestige;
        document.getElementById('click-power').textContent = this.clickPower;
        document.getElementById('auto-cost').textContent = this.autoGrowthCost;
        
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

    renderUpgrades() {
        const grid = document.getElementById('upgrades-grid');
        grid.innerHTML = '';
        
        this.upgrades.forEach(upgrade => {
            const cost = Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));
            const canAfford = this.energy >= cost;
            const canUpgrade = upgrade.currentLevel < upgrade.maxLevel && 
                (!upgrade.requirement || 
                 this.upgrades.find(u => u.id === upgrade.requirement.upgrade)?.currentLevel >= upgrade.requirement.level);
            
            const item = document.createElement('div');
            item.className = `upgrade-item ${canUpgrade && canAfford ? '' : 'locked'}`;
            item.innerHTML = `
                <div class="pixel-text" style="margin-bottom: 8px;">${upgrade.name}</div>
                <div style="font-size: 9px; margin-bottom: 8px;">${upgrade.description}</div>
                <div class="upgrade-level">Уровень: ${upgrade.currentLevel}/${upgrade.maxLevel}</div>
                <div class="upgrade-cost">
                    <span>${cost}⚡</span>
                    <span>${canUpgrade && canAfford ? 'КУПИТЬ' : 'НЕДОСТУПНО'}</span>
                </div>
            `;
            
            if (canUpgrade && canAfford) {
                item.addEventListener('click', () => this.buyUpgrade(upgrade.id));
                item.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.buyUpgrade(upgrade.id);
                }, { passive: false });
            }
            
            grid.appendChild(item);
        });
    }

    renderResearch() {
        const grid = document.getElementById('research-grid');
        grid.innerHTML = '';
        
        this.researches.forEach(research => {
            const canResearch = !research.researched && 
                research.requirements.every(reqId => this.researches.find(r => r.id === reqId)?.researched);
            const canAfford = this.knowledge >= research.cost.knowledge && this.energy >= research.cost.energy;
            
            const item = document.createElement('div');
            item.className = `research-item ${canResearch && canAfford ? '' : 'locked'} ${research.researched ? 'unlocked' : ''}`;
            item.innerHTML = `
                <div class="pixel-text" style="margin-bottom: 8px;">${research.name}</div>
                <div style="font-size: 9px; margin-bottom: 8px;">${research.description}</div>
                <div class="research-cost">
                    <span>${research.cost.knowledge}🧠 ${research.cost.energy}⚡</span>
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
            
            grid.appendChild(item);
        });
    }

    renderRanking() {
        const list = document.getElementById('ranking-list');
        list.innerHTML = '';
        
        const currentPlayerIndex = this.ranking.findIndex(p => p.id === this.playerId);
        const playerRank = currentPlayerIndex + 1;
        
        document.getElementById('player-rank').textContent = playerRank || '-';
        document.getElementById('total-players').textContent = this.ranking.length;
        
        this.ranking.slice(0, 20).forEach((player, index) => {
            const item = document.createElement('div');
            item.className = `ranking-item ${player.id === this.playerId ? 'current' : ''}`;
            item.innerHTML = `
                <div>
                    <span class="rank-number">#${index + 1}</span>
                    <span class="pixel-text">${player.name}</span>
                </div>
                <div class="pixel-text">${player.prestige}</div>
                <div class="pixel-text">${player.stage}</div>
            `;
            list.appendChild(item);
        });
    }

    calculateProgress() {
        if (this.currentStage >= this.stages.length - 1) {
            return { percentage: 100, nextStage: null };
        }
        
        const currentSize = this.stages[this.currentStage].size;
        const nextSize = this.stages[this.currentStage + 1].size;
        const progress = Math.log10(currentSize) / Math.log10(nextSize) * 100;
        
        return { 
            percentage: Math.min(100, Math.max(0, Math.floor(progress))),
            nextStage: this.stages[this.currentStage + 1]
        };
    }

    formatSize(size) {
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

    startGameLoop() {
        setInterval(() => {
            if (this.autoGrowth) {
                const autoGain = this.clickPower * 0.1 * this.autoEfficiency;
                this.energy += autoGain;
                this.totalEnergy += autoGain;
                this.increaseSize(this.clickPower * 0.01 * this.autoEfficiency);
                
                // Сохраняем каждые 30 секунд при активном авто-росте
                if (Date.now() - this.lastSave > 30000) {
                    this.quickSave();
                }
            }
            
            // Пассивная генерация знаний
            this.knowledge += (this.prestige * 0.001) + (this.currentStage * 0.01);
            
            this.render();
        }, 1000);
    }

    loadGame() {
        try {
            const saved = localStorage.getItem('quantum-evolution');
            if (saved) {
                const data = JSON.parse(saved);
                
                // Восстанавливаем основные данные
                this.energy = data.energy || 0;
                this.knowledge = data.knowledge || 0;
                this.prestige = data.prestige || 0;
                this.currentStage = data.currentStage || 0;
                this.autoGrowth = data.autoGrowth || false;
                this.clickPower = data.clickPower || 1;
                this.totalEnergy = data.totalEnergy || 0;
                this.autoEfficiency = data.autoEfficiency || 1.0;
                this.energyCapacity = data.energyCapacity || 1e6;
                
                // Восстанавливаем улучшения
                if (data.upgrades) {
                    data.upgrades.forEach(savedUpgrade => {
                        const upgrade = this.upgrades.find(u => u.id === savedUpgrade.id);
                        if (upgrade) {
                            upgrade.currentLevel = savedUpgrade.currentLevel || 0;
                        }
                    });
                }
                
                // Восстанавливаем исследования
                if (data.researches) {
                    data.researches.forEach(savedResearch => {
                        const research = this.researches.find(r => r.id === savedResearch.id);
                        if (research) {
                            research.researched = savedResearch.researched || false;
                        }
                    });
                }
                
                console.log('Игра загружена! Текущий этап:', this.stages[this.currentStage].name);
            }
        } catch (error) {
            console.error('Ошибка загрузки игры:', error);
        }
    }

    saveGame() {
        try {
            const saveData = {
                energy: this.energy,
                knowledge: this.knowledge,
                prestige: this.prestige,
                currentStage: this.currentStage,
                autoGrowth: this.autoGrowth,
                clickPower: this.clickPower,
                totalEnergy: this.totalEnergy,
                autoEfficiency: this.autoEfficiency,
                energyCapacity: this.energyCapacity,
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
            console.log('Игра сохранена!');
        } catch (error) {
            console.error('Ошибка сохранения игры:', error);
        }
    }

    // Быстрое сохранение с защитой от слишком частых вызовов
    quickSave() {
        // Сохраняем не чаще чем раз в 2 секунды
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

// Инициализация игры когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    window.game = new QuantumEvolution();
    
    // Добавляем класс для предотвращения выделения
    document.body.classList.add('no-select');
});