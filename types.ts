import { Signal, ReadonlySignal } from '@preact/signals';

export type State = Record<string, any>;
export type Listener = (key: string, value: any) => void;
export type ActionHandler = (payload?: any) => void;
export type ComputedFn = (...args: any[]) => any;

export interface ISignalStore {
  state: Record<string, Signal<any>>;
  actions: Record<string, ActionHandler>;
  get: (key: string) => any;
  getSignal: (key: string) => Signal<any>;
  set: (key: string, value: any) => void;
  batchUpdate: (updates: Record<string, any>) => void;
  addAction: (name: string, handler: ActionHandler) => void;
  dispatch: (actionName: string, payload?: any) => void;
  compute: (deps: string[], computation: ComputedFn) => ReadonlySignal<any>;
  subscribe: (listener: Listener) => () => void;
  getState: () => State;
}