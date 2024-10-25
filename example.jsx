import { createStore } from './store';
import { createAction, createAsyncAction } from './actions';

// Create store instance
const store = createStore({
  counter: 0,
  todos: [],
  loading: false,
  error: null
});

// Create actions
const incrementCounter = createAction('INCREMENT_COUNTER');
const addTodo = createAction('ADD_TODO');
const toggleTodo = createAction('TOGGLE_TODO');

// Register actions
store.addAction(incrementCounter.type, function() {
  this.set('counter', this.get('counter') + 1);
});

store.addAction(addTodo.type, function(todo) {
  const todos = [...this.get('todos'), todo];
  this.set('todos', todos);
});

store.addAction(toggleTodo.type, function(id) {
  const todos = this.get('todos').map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  this.set('todos', todos);
});

// Create async action
const fetchTodos = createAsyncAction('FETCH_TODOS', async (_, store) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos = await response.json();
  store.set('todos', todos);
});

store.addAction(fetchTodos.type, fetchTodos);

// Create computed values
const completedTodos = store.compute(
  ['todos'],
  (todos) => todos.filter(todo => todo.completed)
);

const incompleteTodos = store.compute(
  ['todos'],
  (todos) => todos.filter(todo => !todo.completed)
);

// Example component using the store
function TodoApp() {
  const todos = store.getSignal('todos');
  const completed = completedTodos;
  const loading = store.getSignal('loading');
  const error = store.getSignal('error');

  const handleAddTodo = (text) => {
    store.dispatch(addTodo.type, {
      id: Date.now(),
      text,
      completed: false
    });
  };

  const handleToggleTodo = (id) => {
    store.dispatch(toggleTodo.type, id);
  };

  return (
    <div>
      {loading.value && <div>Loading...</div>}
      {error.value && <div>Error: {error.value}</div>}
      
      <div>
        <h3>Todos ({todos.value.length})</h3>
        <button onClick={() => store.dispatch(fetchTodos.type)}>
          Fetch Todos
        </button>
      </div>

      <div>
        <h4>Completed ({completed.value.length})</h4>
        <ul>
          {completed.value.map(todo => (
            <li key={todo.id} onClick={() => handleToggleTodo(todo.id)}>
              ✓ {todo.text}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <input
          type="text"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddTodo(e.target.value);
              e.target.value = '';
            }
          }}
          placeholder="Add new todo"
        />
      </div>
    </div>
  );
}