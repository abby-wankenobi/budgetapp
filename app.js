var budgetController = (function(){

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(e){
      sum += e.value;
    });
    data.totals[type] = sum
  };

  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on 'inc' or 'exp' type
      if (type === 'expense') {
        newItem = new Expense(ID, des, val)
      } else if (type === 'income') {
        newItem = new Income(ID, des, val)
      }

      //push into data structure
      data.allItems[type].push(newItem)

      //return new element
      return newItem;
    },

    deleteItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(e){
        return e.id;
      }),

      index = ids.indexOf(id)

      if (index !== -1){
        data.allItems[type].splice(index, 1)
      }

    },

    calculateBudget: function() {

      // calculate total income and expenses
      calculateTotal('expense');
      calculateTotal('income');

      // calculate budget (income - expenses)
      data.budget = data.totals.income - data.totals.expense;

      // calculate percentaget of income spent
      if (data.totals.income > 0) {
        data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
      } else {
        data.percentage = -1;
      }

    },

    calculatePercentages: function() {
      data.allItems.expense.forEach(function(current){
        current.calcPercentage(data.totals.income);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.expense.map(function(current){
        return current.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.income,
        totalExp: data.totals.expense,
        percentage: data.percentage
      }
    },

    testing: function() {
      console.log(data)
    }

  }

})();


var UIController = (function() {

    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercentageLabel: '.item__percentage',
      dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
      var numSplit, int, dec;

      num = Math.abs(num);
      num = num.toFixed(2);
      numSplit = num.split('.')

      int = numSplit[0];
      if(int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, 3);
      }
      dec = numSplit[1];

      return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
      for (var i = 0; i < list.length; i++){
        callback(list[i], i)
      }
    };

    return {
      getInput: function() {
        return {
          type: document.querySelector(DOMstrings.inputType).value,
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        }
      },

      addListItem: function(obj, type) {
        var html, newHtml, element;
        //create html string with placeholder text

        if (type === 'income') {
          element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        } else if (type === "expense") {
          element = DOMstrings.expensesContainer;
          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

        //replace placeholder text with data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        //insert html into DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },

      deleteListItem: function(id) {
        var el = document.getElementById(id);
        el.parentNode.removeChild(el);
      },

      clearFields: function() {
        var fields, fieldsArr;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

        fieldsArr = Array.prototype.slice.call(fields);

        //why is index/array important in this line?
        fieldsArr.forEach(function(current, index, array){
          current.value = "";
        })

        //set cursor back to first field
        fieldsArr[0].focus();
      },

      displayBudget: function(obj){

        obj.budget > 0 ? type = 'income' : type = 'expense'
        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'income');
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'expense');


        if(obj.percentage > 0) {
          document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
        } else {
          document.querySelector(DOMstrings.percentageLabel).textContent = '--';
        }
      },

      displayPercentages: function(percentages) {
        var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

        nodeListForEach(fields, function(current, index) {
          if(percentages[index] > 0) {
            current.textContent = percentages[index] + "%";
          } else {
            current.textContent = "--";
          }
        });

      },

      displayMonth: function() {
        var now, months, year, month;
        now = new Date();
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        month = now.getMonth();
        year = now.getFullYear();
        document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;
      },

      changedType: function() {
        var fields = document.querySelectorAll(
          DOMstrings.inputType + ',' +
          DOMstrings.inputDescription + ',' +
          DOMstrings.inputValue
        );

        nodeListForEach(fields, function(current){
          current.classList.toggle('red-focus');
        })

        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
      },

      getDOMstrings: function() {
        return DOMstrings;
      }
    }
})();


var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e) {
      //1. event only when enter key is pressed
      if (e.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  }

  var updateBudget = function () {
    //1. calculate budget
    budgetCtrl.calculateBudget();

    //2. return budget
    var budget = budgetCtrl.getBudget();

    //3. display budget on UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    //1. calculate percentages
    budgetCtrl.calculatePercentages();

    //2. read percentage from budget controller
    var percentages = budgetCtrl.getPercentages();

    //3. update UI
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function() {
    var input, newItem;

    //1. get input data
    input = UICtrl.getInput();
    console.log(input)

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2. add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      console.log(newItem)
      //3. add item to UI
      UICtrl.addListItem(newItem, input.type);
      //4. clear fields
      UICtrl.clearFields();
      //5. calculate/update budget
      updateBudget();
      //6. calculate/update percentages
      updatePercentages();
    }
  }

  var ctrlDeleteItem = function(e) {
    var itemID, splitID, type, ID;

    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete item from data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. delete item from UI
      UICtrl.deleteListItem(itemID)

      // 3. update new budget
      updateBudget();

      // 4. calculate/update percentages
      updatePercentages();
    }

  };

  return {
    init: function() {
      console.log('begin')
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController);


//sets up initial event listeners which will trigger all actions when clicked
//only method being invoked when page is loaded, all other methods stem from this one
controller.init();
