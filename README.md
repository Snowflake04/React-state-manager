# Signal Store

A lightweight and efficient state management solution built with Preact Signals. This store provides reactive state management without the complexity of traditional Redux, while maintaining familiar concepts and patterns.

## Features

- 🚀 Built on Preact Signals for optimal performance
- 🎯 Simple and intuitive API
- 📦 Zero dependencies (besides Preact Signals)
- 🔄 Support for computed values
- 🎭 Batch updates
- 👀 State change subscriptions
- 📝 TypeScript support

## Installation

```bash
npm install @preact/signals
```

## Basic Usage

```javascript
import { createStore } from './store';

// Create a store with initial state
const store = createStore({
  counter: 0,
  todos: [],
});

// Access state
console.log(store.get('counter')); // 0

// Update state
store.set('counter', 1);

// Subscribe to changes
const unsubscribe = store.subscribe((key, value) => {
  console.log(`${key} changed to:`, value);
});

// Add actions
store.addAction('INCREMENT', function() {
  this.set('counter', this.get('counter') + 1);
});

// Dispatch actions
store.dispatch('INCREMENT');

// Create computed values
const doubledCounter = store.compute(
  ['counter'],
  (counter) => counter * 2
);

// Batch updates
store.batchUpdate({
  counter: 5,
  todos: ['New Todo']
});

// Clean up subscription
unsubscribe();
```

## Using with React/Preact Components

```javascript
import { useSignal } from '@preact/signals';

function Counter() {
  const counterSignal = store.getSignal('counter');
  
  return (
    <div>
      <p>Count: {counterSignal.value}</p>
      <button onClick={() => store.dispatch('INCREMENT')}>
        Increment
      </button>
    </div>
  );
}
```

## Advanced Usage

### Async Actions

```javascript
import { createAsyncAction } from './actions';

const fetchTodos = createAsyncAction('FETCH_TODOS', async (payload, store) => {
  const response = await fetch('https://api.example.com/todos');
  const todos = await response.json();
  store.set('todos', todos);
  return todos;
});

// Use the async action
store.addAction(fetchTodos.type, fetchTodos);
await store.dispatch('FETCH_TODOS');
```

### Computed Values

```javascript
const completedTodos = store.compute(
  ['todos'],
  (todos) => todos.filter(todo => todo.completed)
);
```

## Best Practices

1. Keep state normalized and flat when possible
2. Use computed values for derived state
3. Use batch updates when making multiple state changes
4. Clean up subscriptions when they're no longer needed
5. Use TypeScript for better development experience

## TypeScript Support

The store comes with full TypeScript support. See `types.ts` for type definitions.