import { LightningElement, track } from "lwc";
import addTodo from "@salesforce/apex/ToDoController.addTodo";
import getCurrentTodos from "@salesforce/apex/ToDoController.getCurrentTodos";

export default class ToDOManager extends LightningElement {
  @track time = "8:15 PM";
  @track greeting = "Hello!!";

  @track todos = [];

  connectedCallback() {
    this.getTime();
    this.fetchTodos();

    setInterval(() => {
      this.getTime();
    }, 1000 * 60);
  }

  getTime() {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    this.time = `${this.getHour(hour)}:${this.gteDoubleDigit(
      min
    )} ${this.getMidDay(hour)}`;

    this.setGreeting(hour);
  }

  getHour(hour) {
    return hour === 0 ? 12 : hour > 12 ? (hour = 12) : hour;
  }

  getMidDay(hour) {
    return hour >= 12 ? "PM" : "AM";
  }

  gteDoubleDigit(digit) {
    return digit < 10 ? "0" + digit : digit;
  }

  setGreeting(hour) {
    if (hour < 14) {
      this.greeting = "Buenos días";
    } else if (hour >= 14 && hour <= 21) {
      this.greeting = "Buenas tardes";
    } else {
      this.greeting = "Buenas noches";
    }
  }

  addTodoHandler() {
    const inputBox = this.template.querySelector("lightning-input");

    const todo = {
      todoName: inputBox.value,
      done: false
    };

    addTodo({ payload: JSON.stringify(todo) })
      .then((response) => {
        console.log("Item insertado");
        this.fetchTodos();
      })
      .catch((error) => {
        console.error("Error insertando item " + error);
      });

    //this.todos.push(todo);
    inputBox.value = "";
  }

  fetchTodos() {
    getCurrentTodos()
      .then((result) => {
        if (result) {
          console.log("recuperando items");
          this.todos = result;
        }
      })
      .catch((error) => {
        console.error("Error recuperando item " + error);
      });
  }

  upateHandler() {
    this.fetchTodos();
  }

  deleteHandler() {
    this.fetchTodos();
  }

  get upcomingTasks() {
    return this.todos && this.todos.length
      ? this.todos.filter((todo) => !todo.done)
      : [];
  }

  get completedTasks() {
    return this.todos && this.todos.length
      ? this.todos.filter((todo) => todo.done)
      : [];
  }

  populateTodos() {
    const todos = [
      {
        todoId: 0,
        todoName: "Feed the dog",
        done: false,
        todoDate: new Date()
      },
      {
        todoId: 1,
        todoName: "Wash the car",
        done: false,
        todoDate: new Date()
      },
      {
        todoId: 2,
        todoName: "Send email",
        done: true,
        todoDate: new Date()
      }
    ];
    this.todos = todos;
  }
}
