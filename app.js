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
      inputBtn: '.add__btn'
    }

    return {
      getInput: function() {
        return {
          type: document.querySelector(DOMstrings.inputType).value,
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: document.querySelector(DOMstrings.inputValue).value
        }
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


  var ctrlAddItem = function() {
    var input, newItem;

    //1. get input data
    input = UICtrl.getInput();
    console.log(input)
    //2. add item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    console.log(newItem)
    //3. add item to UI
    //4. calculate budget
    //5. display budget on UI
  }

  return {
    init: function() {
      console.log('begin')
      setupEventListeners();
    }
  }

})(budgetController, UIController);


controller.init();
