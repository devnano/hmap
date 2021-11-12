import LayerType from '../models/layerType';

const layerTypeFilter = {
    [LayerType.PUBLIC]:(layer) => layer.is_public,
    [LayerType.PRIVATE]:(layer) => !layer.is_public,
    [LayerType.ACTIVE_FIRES]:(layer) => ["Firms Viirs", "Firms Modis"].includes(layer.name),
    [LayerType.BIG_FIRES]:(layer) => layer.name === "bigfires",
};

export default (layers, layerTypes) => {
    console.log(layers, layerTypes);
    const filters = [...layerTypes].map(type => layerTypeFilter[type]);
    return layers.filter(layer => filters.map(filter => filter(layer)).some(result => result));
}