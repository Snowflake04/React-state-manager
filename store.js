import { signal, computed, batch } from "@preact/signals";

class SignalStore {
  constructor(initialState = {}) {
    this.state = {};
    this.actions = {};
    this.listeners = new Set();
    
    // Initialize state signals
    Object.entries(initialState).forEach(([key, value]) => {
      this.state[key] = signal(value);
    });
  }

  // Get state value
  get(key) {
    if (!this.state[key]) {
      throw new Error(`State key "${key}" does not exist`);
    }
    return this.state[key].value;
  }

  // Get signal reference
  getSignal(key) {
    if (!this.state[key]) {
      throw new Error(`State key "${key}" does not exist`);
    }
    return this.state[key];
  }

  // Set state value
  set(key, value) {
    if (!this.state[key]) {
      this.state[key] = signal(value);
    } else {
      this.state[key].value = value;
    }
    this.notifyListeners(key);
  }

  // Batch update multiple states
  batchUpdate(updates) {
    batch(() => {
      Object.entries(updates).forEach(([key, value]) => {
        this.set(key, value);
      });
    });
  }

  // Register action
  addAction(name, handler) {
    if (this.actions[name]) {
      throw new Error(`Action "${name}" already exists`);
    }
    this.actions[name] = handler.bind(this);
  }

  // Dispatch action
  dispatch(actionName, payload) {
    if (!this.actions[actionName]) {
      throw new Error(`Action "${actionName}" does not exist`);
    }
    return this.actions[actionName](payload);
  }

  // Create computed value
  compute(deps, computation) {
    const signals = deps.map(dep => this.getSignal(dep));
    return computed(() => computation(...signals.map(sig => sig.value)));
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify listeners of state change
  notifyListeners(key) {
    this.listeners.forEach(listener => listener(key, this.state[key].value));
  }

  // Get entire state snapshot
  getState() {
    const snapshot = {};
    Object.entries(this.state).forEach(([key, signal]) => {
      snapshot[key] = signal.value;
    });
    return snapshot;
  }
}

// Create store instance
export const createStore = (initialState = {}) => {
  return new SignalStore(initialState);
};