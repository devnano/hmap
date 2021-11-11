import React, { useState, useEffect } from "react";
import IconButtonSwitch from "../../components/IconButtonSwitch/IconButtonSwitch";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import baseLayers, { DEFAULT_HIDDEN_LAYERS } from "../../../config/layers";
import { connect } from "react-redux";
import ReactMapboxGl, { Popup } from "react-mapbox-gl";
import MapLayers from "../../components/Map/MapLayers/MapLayers";
import FIRMSLayer from "../../components/FIRMSLayer/FIRMSLayer";
import GOESLayer from "../../components/GOESLayer/GOESLayer";
import CoordinatePointLayer from "../../components/CoordinatePointLayer/CoordinatePointLayer";
import LoginForm from "../../components/LoginForm";
import LoadingIndicator from "../../components/LoadingIndicator";
import LayersMenu from "../../components/LayersMenu";
import {
  MAP_DEFAULT_CENTER,
  MAPBOX_ACCESS_TOKEN,
  MAPBOX_DEFAULT_STYLE,
} from "../../../config/config";
import {
  FIRMSLatestModis24Action,
  FIRMSLatestViirs24Action,
  GoesLatestAction,
  SubmitUserAuthAction,
  GetMeAction,
  LogOutAction,
  GetUserLayersAction,
} from "../../app/actions";
import {
  getFIRMSLatestModis24GeoJSON,
  getFIRMSLatestViirs24GeoJSON,
  getLatestGoesGeoJSON,
  getUserAuthData,
  getMeData,
  getUserLayersData,
  getVisibleLayerTypesData
} from "../../app/selectors";
import CoordinateInput from "../../components/CoordinateInput/CoordinateInput";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import './Cockpit.css';
import getServerErrorMessage from "../../lib/getServerErrorMessage";
import filterLayers from "../../lib/filterLayers";
import MenuIcon from '@mui/icons-material/Layers';


const MainMap = ReactMapboxGl({
  accessToken: MAPBOX_ACCESS_TOKEN,
});

const Cockpit = (props) => {
  // const [showFireHistory, setShowFireHistory] = useState(false);
  const [showFIRMS, setShowFIRMS] = useState(false);
  const [firmsDataWasLoaded, setFirmsDataWasLoaded] = useState(false);
  const [center] = useState(MAP_DEFAULT_CENTER);
  // const [isListening, setIsListening] = useState(false);
  const [hiddenLayers, setHiddenLayers] = useState(DEFAULT_HIDDEN_LAYERS);
  const [layers, setLayers] = useState([]);
  const [userLayers, setUserLayers] = useState([]);
  const [coordinateInputValue, setCoordinateInputValue] = useState("");
  const [query, setQuery] = useState(queryString.parse(props.location.search));
  // const [showFireHistoryAnimation, setShowFireHistoryAnimation] = useState(false);
  // const [fireHistoryIndex, setFireHistoryIndex] = useState(0);
  const [popup, setPopup] = useState(null);
  const [loginPopup, setLoginPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const mapRef = React.createRef();

  const switchFIRMSLayer = () => {
    if (showFIRMS) {
      console.log("HERE 1")
      setHiddenLayers(oldLayers => [
        ...oldLayers,
        "firms-modis",
        "firms-viirs",
        "goes",
      ]);
      setShowFIRMS(false);
    } else {
      console.log("HERE 2")
      if (!firmsDataWasLoaded) {
        console.log("HERE 3")
        props.FIRMSLatestModis24Action();
        props.FIRMSLatestViirs24Action();
        props.GoesLatestAction();
        console.log("HERE 4")
        setFirmsDataWasLoaded(true);
      }
      const allHiddenLayers = [...hiddenLayers];
      allHiddenLayers.splice(hiddenLayers.indexOf("firms-modis"), 1);
      allHiddenLayers.splice(hiddenLayers.indexOf("firms-viirs"), 1);
      allHiddenLayers.splice(hiddenLayers.indexOf("goes"), 1);
      setShowFIRMS(true);
      setHiddenLayers(allHiddenLayers);
    }
  }

  const escFunction = (event) => {
    if(event.keyCode === 27) {
      setPopup(null);
    }
  }

  const fireClickHandler = () => {
    switchFIRMSLayer();
  };

  const mapClickHandler = (clickEvent, mapEvent) => {
    setPopup({ 
        lat: mapEvent.lngLat.lat,
        lng: mapEvent.lngLat.lng,
      });
  };

  const coordinateChangeHandler = (value) => {
    setCoordinateInputValue(value);
  };

  const coordinateSubmitHandler = (coordinateValue, fly) => {
    let value;
    let coords;

    if (!coordinateValue) {
      value = coordinateInputValue;
      coords = value.split(" ");
    } else {
      coords = coordinateValue;
    }

    if (coords.length === 2) {
      try {
        const myLayer = CoordinatePointLayer(coords);
        let updatedLayers;
        updatedLayers = [myLayer];
        setLayers(updatedLayers);
        if (fly === true) {
          map.flyTo({
            center: coords,
            zoom: [15],
          });
        }
      } catch (e) {
        console.log("Coordinate error", e);
      }
    }
  };

  useEffect(() => {
    fireClickHandler();
    document.addEventListener("keydown", escFunction, false);
    props.GetMeAction();
    props.GetUserLayersAction();

    return () => document.removeEventListener("keydown", escFunction, false);
  }, []);

  useEffect(() => {
    if (query.coord) {
      setQuery(query.coord);
      coordinateInputValue = query.coord;
    }
  }, [query]);

  useEffect(() => {
    if (props.UserAuthData.error) {
      setError(getServerErrorMessage(props.UserAuthData.error));
      setLoading(false);
    } else {
      props.GetMeAction();
    }
  }, [props.UserAuthData]);

  useEffect(() => {
    if (props.GetMeData.email) {
      setLoginPopup(false);
      setLoading(false);
      props.GetUserLayersAction();
    } else {
      setUserLayers([]);
    }
  }, [props.GetMeData.email]);

  useEffect(() => {
    if(props.UserLayersData.error) {
      return;
    }
    setUserLayers(filterLayers(props.UserLayersData, props.VisibleLayerTypesData).map(layerData => ({...layerData, ...layerData.styles, id: JSON.stringify(layerData.id), data: layerData.geojson_data,   })));
  }, [props.UserLayersData, props.VisibleLayerTypesData]);

  const FIRMSModisLayer = props.FIRMSLatestModis24
  ? FIRMSLayer("firms-modis", props.FIRMSLatestModis24)
  : [];
  const FIRMSViirsLayer = props.FIRMSLatestViirs24
    ? FIRMSLayer("firms-viirs", props.FIRMSLatestViirs24)
    : [];
  const GoesLayer = props.GoesLatest
    ? GOESLayer("goes", props.GoesLatest)
    : [];
  const allLayers = [
    ...baseLayers,
    ...layers,
    ...FIRMSModisLayer,
    ...FIRMSViirsLayer,
    ...GoesLayer,
    ...userLayers,
  ];
  
  return (
      <div>
        <MainMap
          onClick={mapClickHandler}
          onStyleLoad={(el) => {
            setMap(el);
            if (query) {
              coordinateSubmitHandler(false, true);
            }
          }}
          ref={mapRef}
          style={MAPBOX_DEFAULT_STYLE}
          center={center}
          containerStyle={{
            height: "100vh",
            width: "100vw",
          }}
          antialias={true}
        >
          <MapLayers
            layers={allLayers}
            hiddenLayers={hiddenLayers}
          />

          { popup ? 
            <Popup
              coordinates={[popup.lng, popup.lat]}
              offset={{
                'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
              }}>
              {popup.title ? <h1>{popup.title}</h1> : null }
              <em>{popup.lng}, {popup.lat}</em>
            </Popup>
          : null}        


        </MainMap>
        <Grid sx={{position:"absolute", top: "0%", left: "0%", marginTop:"25px", alignItems:"top"}} container>
          <Grid item xs={0} sm={0}>
            <Box display={{ sm: "none" }}>
              <IconButton onClick={() => setIsMenuVisible(!isMenuVisible)}  size="large" color="primary" aria-label="menu" component="span">
                <MenuIcon fontSize="inherit"/>
              </IconButton>
            </Box>
          </Grid>
          <Grid spacing={3} xs={10} sm={12} sx={{ alignItems: "center", textAlign:"right"}}  item container >
            <Grid item xs={0} sm={6} md={8} display={{ xs: "none", sm: "block"}}/>
            <Grid item xs={12} sm={3} md={2}>
            {!props.GetMeData.email ? <Button onClick={() => setLoginPopup(!loginPopup)} variant="contained">Login</Button> : <Button onClick={props.LogOutAction} variant="contained">Logout</Button>}
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <CoordinateInput
                value={coordinateInputValue}
                onChange={coordinateChangeHandler}
                onSubmit={(event) => coordinateSubmitHandler(event, true)}
              />
            </Grid>

          </Grid>

          {/* <Grid item xs={4}>
            xs=4
          </Grid>
          <Grid item xs={8}>
            xs=8
          </Grid> */}
        </Grid>

        <Box display={{ xs: isMenuVisible ? "block" : "none", sm:"block" }}>
          <LayersMenu/>
        </Box>
        {error && <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
          </Alert>
        </Snackbar>}
        {loginPopup && !props.UserAuthData.isLoggedIn && <LoginForm open={loginPopup} setOpen={setLoginPopup} onSubmit={(email, password) => {
          setLoading(true);
          props.SubmitUserAuthAction(email, password);
        }}/>}
        {loading && <LoadingIndicator/>}
      </div>

    );
}


const mapStateToProps = (state) => ({
  FIRMSLatestModis24: getFIRMSLatestModis24GeoJSON(state),
  FIRMSLatestViirs24: getFIRMSLatestViirs24GeoJSON(state),
  GoesLatest: getLatestGoesGeoJSON(state),
  UserAuthData: getUserAuthData(state),
  GetMeData: getMeData(state),
  UserLayersData: getUserLayersData(state),
  VisibleLayerTypesData: getVisibleLayerTypesData(state),
});

const mapDispatchToProps = (dispatch) => ({
  FIRMSLatestModis24Action: () => dispatch(FIRMSLatestModis24Action),
  FIRMSLatestViirs24Action: () => dispatch(FIRMSLatestViirs24Action),
  GoesLatestAction: () => dispatch(GoesLatestAction),
  SubmitUserAuthAction: (email, password) => dispatch(SubmitUserAuthAction(email, password)),
  GetMeAction: () => dispatch(GetMeAction),
  LogOutAction: () => dispatch(LogOutAction),
  GetUserLayersAction: () => dispatch(GetUserLayersAction),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Cockpit));
