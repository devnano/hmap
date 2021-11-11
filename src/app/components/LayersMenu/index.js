import React from 'react'
import { connect } from "react-redux";
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import LayerType from '../../models/layerType';
import {
    getVisibleLayerTypesData
  } from "../../app/selectors";
import {
ToggleLayerTypeVisibility
} from "../../app/actions";



function LayersMenu(props) {
    const {VisibleLayerTypesData, ToggleLayerTypeVisibilityAction} = props;
    const createLayerTypeSwitch = (layerType, label) => <FormControlLabel control={<Switch checked={VisibleLayerTypesData.has(layerType)} onChange={() => ToggleLayerTypeVisibilityAction(layerType)} />} label={label} />
    return (
        <Card sx={{ minWidth: 275 }} style={{position:'absolute', top: '0%',
        left: '0%'}}>
            <CardContent>
                <FormGroup>
                    {createLayerTypeSwitch(LayerType.PUBLIC, "Public Layers")}
                    {createLayerTypeSwitch(LayerType.PRIVATE, "Private Layers")}
                    {createLayerTypeSwitch(LayerType.ACTIVE_FIRES, "Active Fires")}
                    {createLayerTypeSwitch(LayerType.BIG_FIRES, "Big Fires – Historical Data")}
                </FormGroup>
            </CardContent>
        </Card>
    )
}


const mapStateToProps = (state) => ({
    VisibleLayerTypesData: getVisibleLayerTypesData(state)
});

const mapDispatchToProps = (dispatch) => ({
    ToggleLayerTypeVisibilityAction: (layerType) => dispatch(ToggleLayerTypeVisibility(layerType)),
    
  });

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(LayersMenu);
  
