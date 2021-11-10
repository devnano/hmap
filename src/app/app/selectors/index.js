import { createSelector } from 'reselect';
import { CSVToGeoJSON } from '../utils';
import LayerType from '../../models/layerType';

const DEFAULT_VISIBLE_LAYERS = new Set([LayerType.PUBLIC, LayerType.PRIVATE, LayerType.ACTIVE_FIRES, LayerType.BIG_FIRES]);

const getFIRMSLatestModis24 = state => state ? state.FIRMSLatestModis24Data : {};
const getFIRMSLatestViirs24 = state => state ? state.FIRMSLatestViirs24Data : {};
const getLatestGoes = state => state ? state.GoesLatestData : {};
const getUserAuthDataFromState = state => state ? state.UserAuthData : {};
const getGetMeDataFromState = state => state ? state.GetMeData : {};
const getUserLayers = state => state ? state.UserLayersData : [];
const getVisibleLayerTypes = state => state ? state.VisibleLayerTypes : DEFAULT_VISIBLE_LAYERS;

export const getFIRMSLatestModis24GeoJSON = createSelector(
    [getFIRMSLatestModis24],
    (CSVString) => ( CSVToGeoJSON(CSVString) )
)

export const getFIRMSLatestViirs24GeoJSON = createSelector(
    [getFIRMSLatestViirs24],
    (CSVString) => ( CSVToGeoJSON(CSVString) )
)

export const getLatestGoesGeoJSON = createSelector(
    [getLatestGoes],
    result => result || {features: []}
)

export const getUserAuthData = createSelector(
    [getUserAuthDataFromState],
    result => result || {}
)

export const getMeData = createSelector(
    [getGetMeDataFromState],
    result => result || {}
)

export const getUserLayersData = createSelector(
    [getUserLayers],
    result => result || []
)

export const getVisibleLayerTypesData = createSelector(
    [getVisibleLayerTypes],
    result => result || DEFAULT_VISIBLE_LAYERS
)

