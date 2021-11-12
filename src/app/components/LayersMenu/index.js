import React from 'react'
import { connect } from "react-redux";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import LayerType from '../../models/layerType';
import {
    getVisibleLayerTypesData
  } from "../../app/selectors";
import {
ToggleLayerTypeVisibility
} from "../../app/actions";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';



function Menu(props) {
    const {VisibleLayerTypesData, ToggleLayerTypeVisibilityAction} = props;
    const createLayerTypeSwitch = (layerType, label) => <FormControlLabel control={<Switch checked={VisibleLayerTypesData.has(layerType)} onChange={() => ToggleLayerTypeVisibilityAction(layerType)} />} label={label} />

    return (
        <Card sx={{ minWidth:275, position: "absolute", top: {xs:"50%", sm:"10%"}, left: {xs:"50%", sm:"5%"}, transform:{xs:'translate(-50%, -50%)', sm: 'translate(0%, 0%)'} }} >
                      <Toolbar style={{ background: '#1A76D2' }} variant="dense">
          {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" color="inherit" component="div" color="common.white">
            Humanitarian Map
          </Typography>
        </Toolbar>
            <CardContent>
  
                <FormGroup>
                    {createLayerTypeSwitch(LayerType.PUBLIC, "Public Layers")}
                    {createLayerTypeSwitch(LayerType.PRIVATE, "Private Layers")}
                    {createLayerTypeSwitch(LayerType.ACTIVE_FIRES, "Fire Points")}
                    {createLayerTypeSwitch(LayerType.BIG_FIRES, "Big Fires – Historical Data")}
                </FormGroup>
            </CardContent>
        </Card>
    )
}

const LayersMenu = (props) => {
    const {isMenuVisible, setIsMenuVisible} = props;
    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
    const displayModal = !bigScreen;
    const menu = <Menu {...props}></Menu>;
    console.log(displayModal);
    return   displayModal ?  <Modal open={isMenuVisible} onClose={() => setIsMenuVisible(false)}><div>{menu}</div></Modal> : menu;
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
  
