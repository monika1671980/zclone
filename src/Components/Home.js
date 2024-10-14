import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Home.css';
import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';
// import { withRouter } from 'react-router-dom';


class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []

        }
    }
  

    componentDidMount() {
        sessionStorage.clear();
        axios({
            method: 'GET',
            url: `http://localhost:3501/locations`,
            hedears: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            this.setState({ locations: response.data.locations})
        })
        .catch(err => console.log(err));
        
        // mealtype
        axios({
            method: 'GET',
            url: `http://localhost:3501/mealtypes`,
            hedears: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            this.setState({ mealtypes: response.data.mealtypes})
        })
        .catch(err => console.log(err));
        
  }
    render() {
        const { locations, mealtypes } = this.state;
        return(
            <div>
                <Wallpaper locationsData={locations}/>
                <QuickSearch quickSearchData={mealtypes}/>
              
              
        

            </div>
        )
    }
}
export default Home;
