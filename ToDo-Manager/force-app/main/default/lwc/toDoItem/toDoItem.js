import { LightningElement, api } from "lwc";
import updateTodo from "@salesforce/apex/ToDoController.updateTodo";
import deleteTodo from "@salesforce/apex/ToDoController.deleteTodo";

export default class ToDoItem extends LightningElement {
  @api todoId;
  @api todoName;
  @api done = false;

  updateHandler() {
    const todo = {
      todoId: this.todoId,
      todoName: this.todoName,
      done: !this.done
    };

    updateTodo({ payload: JSON.stringify(todo) })
      .then((response) => {
        console.log("Item actualizado");
        this.dispatchEvent(new CustomEvent("update"));
      })
      .catch((error) => {
        console.error("Error actualizando item " + error);
      });
  }

  deleteHandler() {
    deleteTodo({ todoId: this.todoId })
      .then((response) => {
        console.log("Item borrado");
        this.dispatchEvent(new CustomEvent("delete"));
      })
      .catch((error) => {
        console.error("Error borrando item " + error);
      });
  }

  get containerClass() {
    return this.done ? "todo completed" : "todo upcoming";
  }

  get iconName() {
    return this.done ? "utility:check" : "utility:add";
  }
}
