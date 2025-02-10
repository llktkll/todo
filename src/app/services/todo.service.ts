import axios from 'axios';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'https://dummyjson.com/todos';  // Replace with your API URL

  // Fetch all todos from the API
  async fetchTodos(): Promise<Todo[]> {
    const response = await axios.get(this.apiUrl);
    return response.data.todos;  // Adjust based on your API response structure
  }

  // Update a todo's status via the API
  async updateTodo(todo: Todo): Promise<Todo> {
    const response = await axios.put(`${this.apiUrl}/${todo.id}`, todo);
    return response.data;  // Return updated todo
  }
  
  // Create a new todo via the API
  async createTodo(newTodo: Todo): Promise<Todo> {
    const response = await axios.post(this.apiUrl + '/add', newTodo);
    return response.data;  // Return the created todo
  }
}
