const LayerType = {
    PUBLIC: Symbol.for('LayerType.PUBLIC'),
    PRIVATE: Symbol.for('LayerType.PRIVATE'),
    ACTIVE_FIRES: Symbol.for('LayerType.ACTIVE_FIRES'),
    BIG_FIRES: Symbol.for('LayerType.BIG_FIRES')
  };

LayerType.all = () => new Set([LayerType.PUBLIC, LayerType.PRIVATE, LayerType.ACTIVE_FIRES, LayerType.BIG_FIRES]);

export default Object.freeze(LayerType);
  