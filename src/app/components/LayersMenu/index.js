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

function LayersMenu({VisibleLayerTypesData}) {
    return (
        <Card sx={{ minWidth: 275 }} style={{position:'absolute', top: '0%',
        left: '0%'}}>
            <CardContent>
                <FormGroup>
                    <FormControlLabel control={<Switch checked={VisibleLayerTypesData.has(LayerType.PUBLIC)} />} label="Public Layers" />
                    <FormControlLabel control={<Switch checked={VisibleLayerTypesData.has(LayerType.PRIVATE)} />} label="Private Layers" />
                    <FormControlLabel control={<Switch checked={VisibleLayerTypesData.has(LayerType.ACTIVE_FIRES)} />} label="Active Fires" />
                    <FormControlLabel control={<Switch checked={VisibleLayerTypesData.has(LayerType.BIG_FIRES)} />} label="Big Fires – Historical Data" />
                </FormGroup>
            </CardContent>
        </Card>
    )
}


const mapStateToProps = (state) => ({
    VisibleLayerTypesData: getVisibleLayerTypesData(state)
});

export default connect(
    mapStateToProps
  )(LayersMenu);
  
