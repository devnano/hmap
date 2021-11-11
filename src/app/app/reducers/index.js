import LayerType from '../../models/layerType';

const VISIBLE_LAYERS_KEY = 'VISIBLE_LAYERS_KEY';

const getPersistedVisibleLayers = () => {
  const persistedState = localStorage.getItem(VISIBLE_LAYERS_KEY);
  return persistedState ? new Set(JSON.parse(persistedState).map(Symbol.for)) : LayerType.all();
};

const persistVisibleLayers = (visibleLayers) => 
  localStorage.setItem(VISIBLE_LAYERS_KEY, visibleLayers && JSON.stringify([...visibleLayers].map(Symbol.keyFor)));


const deletePeristedVisibleLayers = () => localStorage.removeItem(VISIBLE_LAYERS_KEY);

const getInitialState =  () => ({
  VisibleLayerTypes: getPersistedVisibleLayers()
});

export default (state=getInitialState(), action) => {
  
  switch (action.type) {
    case "GET_LATEST_MODIS_24_SUCCESS":
      return {
        ...state,
        FIRMSLatestModis24Data: action.payload.data
      };
    case "GET_LATEST_VIIRS_24_SUCCESS":
      return {
        ...state,
        FIRMSLatestViirs24Data: action.payload.data
      };
    case "GET_LATEST_GOES_SUCCESS":
      return {
        ...state,
        GoesLatestData: action.payload.data
      };
    case "SUBMIT_USER_AUTH_SUCCESS":
      return {
        ...state,
        UserAuthData: action.payload
      };
    case "SUBMIT_GET_ME_SUCCESS":
        return {
          ...state,
          GetMeData: action.payload
        };
    case "SUBMIT_LOGOUT_SUCCESS":
        if(action.payload.isLoggedIn === false) {
          deletePeristedVisibleLayers();
          return getInitialState();
        }
    case "SUBMIT_GET_USER_LAYERS_SUCCESS":
      return {
        ...state,
        UserLayersData: action.payload
      };
    case "TOGGLE_LAYER_TYPE_VISIBILITY":
      const {layerType} = action.payload;
      const visibleLayers = new Set(state.VisibleLayerTypes);
      visibleLayers.has(layerType) ? visibleLayers.delete(layerType) : visibleLayers.add(layerType);
      persistVisibleLayers(visibleLayers);
      return {
        ...state,
        VisibleLayerTypes: visibleLayers
      }
    default:
    return state;
  }
};
