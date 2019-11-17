import React, { PureComponent } from 'react';
import IconButtonSwitch from '../../components/IconButtonSwitch/IconButtonSwitch';
import layers, { DEFAULT_HIDDEN_LAYERS } from '../../../config/layers';
import { Layer, Feature } from 'react-mapbox-gl';
import { connect } from "react-redux";
import ReactMapboxGl from 'react-mapbox-gl';
import MapLayers from '../../components/Map/MapLayers/MapLayers';
import {
    MAP_DEFAULT_CENTER,
    MAPBOX_ACCESS_TOKEN,
    MAPBOX_DEFAULT_STYLE,
} from '../../../config/config';
import { FIRMSLatestModis24Action, FIRMSLatestViirs24Action } from '../../app/actions';
import { getFIRMSLatestModis24GeoJSON, getFIRMSLatestViirs24GeoJSON } from '../../app/selectors';
import DTMFListener from '../../components/DTMFListener/DTMFListener';
import CoordinateInput from '../../components/CoordinateInput/CoordinateInput';

const MainMap = ReactMapboxGl({
    accessToken: MAPBOX_ACCESS_TOKEN
});

class Cockpit extends PureComponent {

    state = {
        showFireHistory: false,
        showFIRMS: false,
        firmsDataWasLoaded: false,
        center: MAP_DEFAULT_CENTER,
        isListening: false,
        hiddenLayers: DEFAULT_HIDDEN_LAYERS,
        layers: [],
        coordinateInputValue: "",
    }

    constructor(props) {
        super(props);
        this.clockClickHandler = this.clockClickHandler.bind(this);
        this.fireClickHandler = this.fireClickHandler.bind(this);
        this.earClickHandler = this.earClickHandler.bind(this);
        this.coordinateSubmitHandler = this.coordinateSubmitHandler.bind(this);
        this.DTMFDecodeHandler = this.DTMFDecodeHandler.bind(this);
    }

    render() {
        const firmsIsLoading = this.state.firmsDataWasLoaded && (this.props.FIRMSLatestViirs24.features.length < 1 || this.props.FIRMSLatestModis24.features.length < 1);

        const FIRMSModisLayer = this.props.FIRMSLatestModis24 ? [
            {
                id: 'firms-modis',
                data: this.props.FIRMSLatestModis24,
                circlePaint: {
                    "circle-radius": 4,
                    "circle-color": "red",
                }
            },
        ] : []; 

        const FIRMSViirsLayer = this.props.FIRMSLatestViirs24 ? [
            {
                id: 'firms-viirs',
                data: this.props.FIRMSLatestViirs24,
                circlePaint: {
                    "circle-radius": 4,
                    "circle-color": "yellow",
                }
            },
        ] : [];

        const allLayers = [...layers, ...this.state.layers, ...FIRMSModisLayer, ...FIRMSViirsLayer];

        return (
            <div>
                <MainMap
                    // eslint-disable-next-line react/style-prop-object
                    onStyleLoad={ el => this.map = el } 
                    style={MAPBOX_DEFAULT_STYLE}
                    center={this.state.center}
                    containerStyle={{
                        height: '100vh',
                        width: '100vw'
                    }}
                    antialias={true}
                > 
                    <MapLayers 
                        onDTMFDecode={this.DTMFDecodeHandler}
                        layers={allLayers}
                        hiddenLayers={this.state.hiddenLayers}
                    />                    
                </MainMap>
                <IconButtonSwitch backgroundImage="clock-icon.png" value={this.state.showFireHistory} onClick={this.clockClickHandler} />
                <IconButtonSwitch loading={firmsIsLoading} right={64} backgroundImage="fire-emoji.png" value={this.state.showFIRMS} onClick={this.fireClickHandler} />
                <IconButtonSwitch loading={this.state.isListening} right={105} backgroundImage="ear-icon.png" onClick={this.earClickHandler} />
                <CoordinateInput value={this.state.coordinateInputValue} onSubmit={this.coordinateSubmitHandler} />
                <DTMFListener listen={this.state.isListening} onDecode={this.DTMFDecodeHandler} />    
            </div>
        );
    }

    DTMFDecodeHandler(value) {
        const coords = value.split(' ');

        if (coords.length === 2) {
            const myLayer = {
                id: value,
                layer:
                    <Layer type="circle" key={Math.random().toString()} paint={{
                        "circle-radius": 10,
                        "circle-color": "green",
                    }}>
                        <Feature coordinates={coords} />
                    </Layer>
            }

            const updatedLayers = [...this.state.layers, myLayer];

            this.setState({
                coordinateInputValue: value,
                isListening: false,
                layers: updatedLayers,
            });

            this.map.flyTo({
                center: coords,
                zoom: [15]
            });
        }

    }

    coordinateSubmitHandler(value) {

        const coords = value.split(' ');
        if (coords.length === 2) {
            const myLayer = {
                id: value,
                layer:
                    <Layer type="circle" key={Math.random().toString()} paint={{
                        "circle-radius": 10,
                        "circle-color": "green",
                    }}>
                        <Feature coordinates={coords} />
                    </Layer>
            }

            const updatedLayers = [...this.state.layers, myLayer];

            this.setState({
                layers: updatedLayers,
            });

            this.map.flyTo({
                center: coords,
                zoom: [15]
            });
        }
    }

    earClickHandler() {
        if (this.state.isListening) {
            this.setState({
                isListening: false,
            });
        } else {
            this.setState({
                isListening: true,
            });
        }

    }

    clockClickHandler() {
        if (this.state.showFireHistory) {
            const hiddenLayers = [...this.state.hiddenLayers, 'big-fires'];
            this.setState({
                hiddenLayers: hiddenLayers,
                showFireHistory: false,
            });
        } else {
            const hiddenLayers = [...this.state.hiddenLayers];
            hiddenLayers.splice(hiddenLayers.indexOf('big-fires'), 1);
            this.setState({
                hiddenLayers: hiddenLayers,
                showFireHistory: true,
            });
        }

    }

    fireClickHandler() {
        if (this.state.showFIRMS) {
            const hiddenLayers = [...this.state.hiddenLayers, 'firms-modis', 'firms-viirs'];
            this.setState({
                hiddenLayers: hiddenLayers,
                showFIRMS: false,
            });
        } else {
            if (!this.state.firmsDataWasLoaded) {
                this.props.FIRMSLatestModis24Action();
                this.props.FIRMSLatestViirs24Action();    
                this.setState({
                    firmsDataWasLoaded: true
                });
            }
            const hiddenLayers = [...this.state.hiddenLayers];
            hiddenLayers.splice(hiddenLayers.indexOf('firms-modis'), 1);
            hiddenLayers.splice(hiddenLayers.indexOf('firms-viirs'), 1);
            this.setState({
                hiddenLayers: hiddenLayers,
                showFIRMS: true,
            });
        }

    }
}
const mapStateToProps = state => ({
    FIRMSLatestModis24: getFIRMSLatestModis24GeoJSON(state),
    FIRMSLatestViirs24: getFIRMSLatestViirs24GeoJSON(state),
});

const mapDispatchToProps = dispatch => ({
    FIRMSLatestModis24Action: () => dispatch(FIRMSLatestModis24Action),
    FIRMSLatestViirs24Action: () => dispatch(FIRMSLatestViirs24Action),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cockpit);

