import React from 'react'
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function LayersMenu() {
    return (
        <Card sx={{ minWidth: 275 }} style={{position:'absolute', top: '0%',
        left: '0%'}}>
            <CardContent>
                <FormGroup>
                    <FormControlLabel control={<Switch defaultChecked />} label="Public Layers" />
                    <FormControlLabel control={<Switch />} label="Private Layers" />
                    <FormControlLabel control={<Switch />} label="Active Fires" />
                    <FormControlLabel control={<Switch />} label="Big Fires – Historical Data" />
                </FormGroup>
            </CardContent>
        </Card>
    )
}

export default LayersMenu;
