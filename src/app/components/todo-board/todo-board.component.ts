import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-board',
  templateUrl: './todo-board.component.html',
  styleUrls: ['./todo-board.component.scss'],
})
export class TodoBoardComponent implements OnInit {
  todos: Todo[] = [];
  statusColumns = ['In Progress', 'Completed'];

   // New todo data
   newTodo: string = '';

  inCompleteTodos: Todo[] = [];
  completedTodos: Todo[] = [];

  constructor(private todoService: TodoService) {}

  async ngOnInit(): Promise<void> {
    this.todos = await this.todoService.fetchTodos();
    this.updateColumns();  // Update columns after fetching todos
  }

  // Fetch todos based on the column status
  getColumnTodos(status: string): Todo[] {
    switch (status) {
      case 'In Progress':
        return this.completedTodos;
      case 'Completed':
        return this.inCompleteTodos;
      default:
        return [];
    }
  }

  // Handle the drop event when a todo is moved between columns
  onDrop(event: DragEvent, status: string): void {
    event.preventDefault();
    const todoId = event.dataTransfer?.getData('todoId');
    if (todoId) {
      const todo = this.todos.find(t => t.id === parseInt(todoId, 10));
      if (todo) {
        // todo.completed = status;  // Update the todo's status
        todo.id = todo.id.toString();
        if (status === "Completed"){
          todo.completed = true
        }
        else{
          todo.completed = false;
        }
        this.todoService.updateTodo(todo);  // Update the todo via API
        this.updateColumns();  // Refresh columns after the update
      }
    }
  }

  // Allow the drop event to occur by preventing the default behavior
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Drag start event handler to store the todo id in dataTransfer
  onDragStart(event: DragEvent, todoId: number): void {
    event.dataTransfer?.setData('todoId', todoId.toString());
  }

  // Update todos in the columns after changes
  updateColumns(): void {
    this.inCompleteTodos = this.todos.filter(todo => todo.completed === true);
    this.completedTodos = this.todos.filter(todo => todo.completed === false);
  }

  // Add a new todo
  async addTodo(): Promise<void> {

    const newTodo: Todo = {
      id: this.todos.length + 1,  // Generate a simple ID for the new todo
      todo: this.newTodo,
      completed: false,  // Default status is "Pending"
      userId: 1, //default 1 since user auth is not added
    };

    // Add the new todo to the list and update the backend
    this.todos.push(newTodo);
    await this.todoService.createTodo(newTodo);  // Save new todo in the backend
    this.updateColumns();  // Refresh columns with the new todo

    // Clear the form fields
    this.newTodo = '';
  }
}

