// Action creator helper
export const createAction = (type, payloadCreator = payload => payload) => {
  const actionCreator = (payload) => ({
    type,
    payload: payloadCreator(payload)
  });
  actionCreator.type = type;
  return actionCreator;
};

// Async action creator helper
export const createAsyncAction = (type, handler) => {
  const actionCreator = async (payload, store) => {
    store.dispatch(`${type}_PENDING`);
    try {
      const result = await handler(payload, store);
      store.dispatch(`${type}_FULFILLED`, result);
      return result;
    } catch (error) {
      store.dispatch(`${type}_REJECTED`, error);
      throw error;
    }
  };
  actionCreator.type = type;
  return actionCreator;
};