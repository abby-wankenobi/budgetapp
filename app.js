var budgetController = (function(){

  var Expense = function(id, description, value) {
    this.id = id,
    this.description = description,
    this.value = value
  }

  var Income = function(id, description, value) {
    this.id = id,
    this.description = description,
    this.value = value
  }

  var data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    }
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
      expensesContainer: '.expenses__list'
    }

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
        newHtml = newHtml.replace('%value%', obj.value);

        //insert html into DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
      },

      clearFields: function() {
        var fields, fieldsArr;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue)

        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach(function(current, index, array){
          current.value = "";
        })

        fieldsArr[0].focus();
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
  }

  var updateBudget = function () {
    //1. calculate budget
    //2. return budget
    //3. display budget on UI
  }

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
    }
  }

  return {
    init: function() {
      console.log('begin')
      setupEventListeners();
    }
  }

})(budgetController, UIController);


controller.init();
