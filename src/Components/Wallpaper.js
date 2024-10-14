import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';


class Wallpaper extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            inputText: "",
            suggestions: []
        }
    }

    handleLocation = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);

        axios({
            method: 'GET',
            url: `http://localhost:3501/restaurants`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                // console.log(response);
                this.setState({restaurants: response.data.restaurants })
            })
            .catch(err => console.log(err));
    }


    handleSearch = (event) => {
        let inputText = event.target.value;
        const { restaurants } = this.state;

        const suggestions = restaurants.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()));
        this.setState({ suggestions, inputText });
    }


    showSuggestion = () => {

        const { suggestions, inputText } = this.state;

        if (suggestions.length == 0 && inputText == undefined) {
            return null;
        }
        if (suggestions.length > 0 && inputText == "") {
            return null;
        }
        if (suggestions.length == 0 && inputText) {
            return <ul>
                <li>No Search Results Found</li>
            </ul>
        }
        
        return (
            <ul>
                {
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.selectingRestaurant(item)}> {`${item.name}  -  ${item.locality}, ${item.city}`}</li>))
                }
            </ul>
        );
    
    
    }
    selectingRestaurant = (resObj) => {
        this.props.history.push(`/details?restaurant=${resObj.location_id}`);
        
    }

   
    
    render() {
        const { locationsData } = this.props;
        return(
            <div>
                  <img src="Assets/image1.jpg" alt="" className="homeImage"/>
        <div className="topSection">
            {/* add logo */}
            <div className="logo">m!</div>
            <div className="headerText"> Find The Resturants</div>
            <div className="searchOptions">
                
                    <select className="locationBox" onChange={this.handleLocation}>
                
                        <option value="0"> select </option>
                      
                        { locationsData.map((item) => {
                            return <option value={item.location_id}>{`${item.name},${item.city}`}</option>
                        }) }
                    </select>
                 
                 <span className="searchBox">
                    <i className="bi bi-search searchIcon"></i>
                    <input type="search" className="searchInput" placeholder="enter resturant name" onChange={this.handleSearch} />
                    {this.showSuggestion()}
                </span> 
            </div>
            
        

        </div>
            </div>

        )
    }
}
export default withRouter(Wallpaper);
