const LayerType = Object.freeze({
    PUBLIC: Symbol.for('LayerType.PUBLIC'),
    PRIVATE: Symbol.for('LayerType.PRIVATE'),
    ACTIVE_FIRES: Symbol.for('LayerType.ACTIVE_FIRES'),
    BIG_FIRES: Symbol.for('LayerType.BIG_FIRES')
  });
  
  export default LayerType;
  