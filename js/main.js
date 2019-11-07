'use strict';

//кнопки рассчитать, сбросить
let buttonStart = document.getElementById('start');
let buttonCancel = document.getElementById('cancel');

//2 кнопки плюс
let buttonIncomePlus = document.getElementsByTagName('button')[0];
let buttonExpensesPlus = document.getElementsByTagName('button')[1];

//чекбокс депозит
let depositCheck = document.querySelector('#deposit-check');

//возможные доходы
let additionalIncomeItems = document.querySelectorAll('.additional_income-item');

let additionalIncomeItem1 = additionalIncomeItems[0];
let additionalIncomeItem2 = additionalIncomeItems[1];

//блоки result
let resultValue = document.querySelectorAll('.result-total');
let budgetMonthValue = resultValue[0];
let budgetDayValue = resultValue[1];
let expensesMonthValue = resultValue[2];
let additionalIncomeValue = resultValue[3];
let additionalExpensesValue = resultValue[4];
let incomePeriodValue = resultValue[5];
let targetMonthValue = resultValue[6];


//инпуты, оставшиеся поля

let salaryAmount = document.querySelector('.salary-amount');

let incomeItems = document.querySelectorAll('.income-items');
let incomeTitles = document.querySelectorAll('.income-title');
let incomeTitle = incomeTitles[1];


let incomeAmount = document.querySelector('.income-amount');

let expenses = document.querySelectorAll('.expenses-title');
let expensesTitle = expenses[1];
let expensesAmount = document.querySelector('.expenses-amount');
let expensesItems = document.querySelectorAll('.expenses-items');

let additionalExpensesItem = document.querySelector('.additional_expenses-item');

let depositAmount = document.querySelector('.deposit-amount');
let inputDepositPercent = document.querySelector('.deposit-percent');

let targetAmount = document.querySelector('.target-amount');

let periodSelect = document.querySelector('.period-select');

let period = document.querySelectorAll('.period');
let periodAmount = document.querySelectorAll('.period-amount');

let newPeriodAmount = document.createElement('div');

period[0].removeChild(periodAmount[0]);
//newPeriodAmount.textContent = 'Новый элемент';
//period[0].removeChild(periodAmount[0]);
//period[0].appendChild(newPeriodAmount);

let inputAll = document.querySelectorAll('input');
/* inputAll.forEach(function (item) {
	console.log(item);
	item.value = '';
}); */


//объект appData
let appData = {
	income: {},
	incomeMonth: 0,
	addIncome: [],
	expenses: {},
	addExpenses: [],
	deposit: false,
	percentDeposit: 0,
	moneyDeposit: 0,
	budget: 0,
	budgetDay: 0,
	budgetMonth: 0,
	expensesMonth: 0,
	start: function () {

		if (salaryAmount.value === '') {
			return false;
		}
		appData.budget = +salaryAmount.value;
		appData.deleteButtonStart();//удаляем кнопку "рассчитать", появляется "сбросить"
		appData.getExpenses();
		appData.getExpensesMonth();
		appData.getIncome();
		appData.getAddExpenses();
		appData.getAddIncome();
		appData.getBudget();
		appData.calcPeriod();
		appData.getSelectPeriod();
		appData.getReadOnly();

		appData.showResult();
	},
	showResult: function () {//показ результатов
		budgetMonthValue.value = this.budgetMonth;
		budgetDayValue.value = this.budgetDay;
		expensesMonthValue.value = this.expensesMonth;
		additionalExpensesValue.value = this.addExpenses.join(', ');//разбиваем на строку
		additionalIncomeValue.value = this.addIncome.join(', ');
		targetMonthValue.value = this.getTargetMonth();

	},
	deleteButtonStart: function () {
		buttonStart.style.display = 'none';
		buttonCancel.style.display = 'block';
	},
	getReadOnly: function () {//блокировка полей слева, после кнопки "рассчитать"
		buttonIncomePlus.disabled = true;
		buttonExpensesPlus.disabled = true;
		salaryAmount.readOnly = true;
		incomeTitle.readOnly = true;
		incomeAmount.readOnly = true;
		additionalIncomeItem1.readOnly = true;
		additionalIncomeItem2.readOnly = true;
		expensesTitle.readOnly = true;
		expensesAmount.readOnly = true;
		additionalExpensesItem.readOnly = true;
		targetAmount.readOnly = true;
		depositCheck.disabled = true;
		//periodSelect.disabled = true;
	},
	addExpensesBlock: function () {//получение полей

		let cloneExpensesItem = expensesItems[0].cloneNode(true);
		expensesItems[0].parentNode.insertBefore(cloneExpensesItem, buttonExpensesPlus);
		expensesItems = document.querySelectorAll('.expenses-items');
		if (expensesItems.length === 3) {
			buttonExpensesPlus.style.display = 'none';
		}
	},
	addIncomeBlock: function () {
		let cloneIncomeItem = incomeItems[0].cloneNode(true);
		incomeItems[0].parentNode.insertBefore(cloneIncomeItem, buttonIncomePlus);
		incomeItems = document.querySelectorAll('.income-items');
		if (incomeItems.length === 3) {
			buttonIncomePlus.style.display = 'none';
		}

	},
	getExpenses: function () {//псевдомассив, перебор элементов 
		expensesItems.forEach(function (item) {
			let itemExpenses = item.querySelector('.expenses-title').value;//получим значение элементов
			let cashExpenses = item.querySelector('.expenses-amount').value;
			if (itemExpenses !== '' && cashExpenses !== '') {
				appData.expenses[itemExpenses] = cashExpenses;//присваиваем ключ и значение
			}

		});
	},
	getIncome: function () {//дополнительный доход
		incomeItems.forEach(function (item) {
			let itemIncome = item.querySelector('.income-title').value;
			let cashIncome = item.querySelector('.income-amount').value;
			if (itemIncome !== '' && cashIncome !== '') {
				appData.income[itemIncome] = cashIncome;
			}
		});

		for (let key in appData.income) {
			appData.incomeMonth += +appData.income[key];//складываем дополн. заработок
		}

	},
	getAddExpenses: function () {
		let addExpenses = additionalExpensesItem.value.split(',');
		addExpenses.forEach(function (item) {
			item = item.trim();//очистка от пробелов
			if (item !== '') {
				appData.addExpenses.push(item);//добавляем в массив
			}
		});
	},
	getAddIncome: function () {
		additionalIncomeItems.forEach(function (item) {
			let itemValue = item.value.trim();//получаем значение с инпута, без пробелов
			if (itemValue !== '') {
				appData.addIncome.push(itemValue);//передаём в массив
			}
		});
	},
	getExpensesMonth: function () {
		for (let key in appData.expenses) {
			appData.expensesMonth += +appData.expenses[key];
		}
	},
	getBudget: function () {
		this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;//накопления за месяц(минус расходы)
		this.budgetDay = Math.floor(this.budgetMonth / 30);
	},
	getTargetMonth: function () {
		return Math.ceil(targetAmount.value / this.budgetMonth);//расчёт периода достижения цели в месяцах
	},
	getStatusIncome: function () {
		if (appData.budgetDay >= 800) {
			return ('Высокий уровень дохода');
		} else if (appData.budgetDay >= 300 && appData.budgetDay < 800) {
			return ('Средний уровень дохода');
		} else if (appData.budgetDay >= 0 && appData.budgetDay < 300) {
			return ('Низкий уровень дохода');
		} else {
			return ('Что-то пошло не так');
		}

	},
	getInfoDeposit: function () {
		if (appData.deposit) {
			appData.percentDeposit = prompt('Какой годовой процент?', '14');
			while (isNaN(appData.percentDeposit) || appData.percentDeposit === '' || appData.percentDeposit === null) {
				appData.percentDeposit = prompt('Какой годовой процент?', '14');
			}
			appData.moneyDeposit = prompt('Какая сумма заложена?', '20000');
			while (isNaN(appData.moneyDeposit) || appData.moneyDeposit === '' || appData.moneyDeposit === null) {
				appData.moneyDeposit = prompt('Какая сумма заложена?', '20000');
			}

		}
	},
	calcPeriod: function () {
		return appData.budgetMonth * periodSelect.value;
	},
	getSelectPeriod: function () {
		newPeriodAmount.textContent = periodSelect.value;
		period[0].appendChild(newPeriodAmount);
		newPeriodAmount.setAttribute('style', 'color: #353a43');
		incomePeriodValue.value = appData.budgetMonth * periodSelect.value;
	},
	getReset: function () {
		inputAll.forEach(function (item) {
			item.value = '';
			item.readOnly = false;
			item.disabled = false;
		});
		newPeriodAmount.textContent = periodSelect.value = 1;
		buttonIncomePlus.disabled = false;
		buttonExpensesPlus.disabled = false;
		buttonStart.style.display = 'block';
		buttonCancel.style.display = 'none';
	},
};

//addEventListener
let newStart = appData.start.bind(appData);//привязка к объекту и методу start

buttonStart.addEventListener('click', newStart);//вызов функции старт

buttonCancel.addEventListener('click', appData.getReset);

buttonExpensesPlus.addEventListener('click', appData.addExpensesBlock);//вызов функции добавления полей
buttonIncomePlus.addEventListener('click', appData.addIncomeBlock);//вызов функции добавления полей

periodSelect.addEventListener('change', appData.getSelectPeriod);

//console.log(appData);


//Function
appData.getTargetMonth();
appData.getStatusIncome();
appData.getInfoDeposit();

appData.addExpenses = appData.addExpenses.map(function (item) {
	return item[0].toUpperCase() + item.slice(1).toLowerCase();
});

//console.log('Возможные расходы: ', appData.addExpenses.join(', '));//вывод возможных расходов

//console.log('Наша программа включает в себя данные:');

// for (let key in appData) {
// 	console.log(key + ' : ' + appData[key]);
// }












