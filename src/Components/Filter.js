import React from "react";
import '../Styles/Filter.css';
import queryString from "query-string";//it convert string into object
import axios from 'axios';

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations: [],
            mealtype: undefined,
            location: undefined,
            cuisine: [],
            lcost: undefined,
            hcost: undefined,
            page: 1,
            sort: 1,
            pageCount: []
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);

        const { mealtype, location } = qs;

        const filterObj = {
            mealtype: Number(mealtype),
            location
        };

        axios({
            method: 'POST',
            url: `http://localhost:3501/filter`,
            hedears: { 'Content-Type': 'application/json' },
            data: filterObj
        })

            .then(response => {
                this.setState({ restaurants: response.data.restaurants, mealtype, pageCount: response.data.pageCount })
            })

            .catch(err => console.log(err));

        axios({
            method: 'GET',
            url: `http://localhost:3501/locations`,
            hedears: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ locations: response.data.locations })
            })
            .catch(err => console.log(err));


    }

    handleLocationChange = (event) => {
        const location = event.target.value;
        const { mealtype, cuisine, lcost, hcost, sort, page } = this.state;

        const filterObj = {
            mealtype: Number(mealtype),
            location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            method: 'POST',
            url: `http://localhost:3501/filter`,
            hedears: { 'Content-Type': 'application/json' },
            data: filterObj
        })

            .then(response => {
                this.setState({ restaurants: response.data.restaurants, location, pageCount: response.data.pageCount })
            })

            .catch(err => console.log(err));

    }

    handleCuisineChange = (cuisineId) => {

        const { mealtype, cuisine, location, lcost, hcost, sort, page } = this.state;
        const index = cuisine.indexOf(cuisineId);

        if (index == -1) {
            cuisine.push(cuisineId);

        } else {
            cuisine.splice(index, 1);
        }



        const filterObj = {
            mealtype: Number(mealtype),
            location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            method: 'POST',
            url: `http://localhost:3501/filter`,
            hedears: { 'Content-Type': 'application/json' },
            data: filterObj
        })

            .then(response => {
                this.setState({ restaurants: response.data.restaurants, cuisine, pageCount: response.data.pageCount })
            })

            .catch(err => console.log(err));

    }

    handleCostChange = (lcost, hcost) => {
        const { mealtype, cuisine, location, sort, page } = this.state;

        const filterObj = {
            mealtype: Number(mealtype),
            location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            method: 'POST',
            url: `http://localhost:3501/filter`,
            hedears: { 'Content-Type': 'application/json' },
            data: filterObj
        })

            .then(response => {
                this.setState({ restaurants: response.data.restaurants, lcost, hcost, pageCount: response.data.pageCount })
            })

            .catch(err => console.log(err));



    }

    handleSortChange = (sort) => {
        const { mealtype, cuisine, location, lcost, hcost, page } = this.state;

        const filterObj = {
            mealtype: Number(mealtype),
            location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            method: 'POST',
            url: `http://localhost:3501/filter`,
            hedears: { 'Content-Type': 'application/json' },
            data: filterObj
        })

            .then(response => {
                this.setState({ restaurants: response.data.restaurants, sort, pageCount: response.data.pageCount })
            })

            .catch(err => console.log(err));

    }

    handlePageChange = (page) => {
        const { mealtype, cuisine, location, lcost, hcost, sort } = this.state;

        const filterObj = {
            mealtype: Number(mealtype),
            location,
            cuisine: cuisine.length == 0 ? undefined : cuisine,
            lcost,
            hcost,
            sort,
            page
        };

        axios({
            method: 'POST',
            url: `http://localhost:3501/filter`,
            hedears: { 'Content-Type': 'application/json' },
            data: filterObj
        })

            .then(response => {
                this.setState({ restaurants: response.data.restaurants, page, pageCount: response.data.pageCount })
            })

            .catch(err => console.log(err));

    }

    handleNavigate = (restId) => {
        this.props.history.push(`/details?restaurant=${restId}`);
    }

    render() {
        const { restaurants, locations, pageCount } = this.state;
        return (
            <div>
                <div className="container">
                    <div className="row heading">
                        Breakfast Places in
                    </div>
                    <div className="row">
                        <div className="col-3 col-sm-12 col-md-4 col-lg-3">
                            <div className="filterPanel">
                                <div className="filterPanelHeading">
                                    Filters / Sort
                                </div>
                                <div className="filterPanelSubHeading">
                                    Select Location
                                </div>
                                <select className="locationselection" onChange={this.handleLocationChange}>
                                    <option value="0"> select </option>

                                    {locations.map((item) => {
                                        return <option value={item.location_id}>{`${item.name},${item.city}`}</option>
                                    })}
                                </select>
                                <div className="filterPanelSubHeading">
                                    Cuisine
                                </div>
                                <input type="checkbox" className="cuisinOption" onChange={() => this.handleCuisineChange(1)} />
                                <label>North Indian</label>
                                <br />
                                <input type="checkbox" className="cuisinOption" onChange={() => this.handleCuisineChange(2)} />
                                <label>South Indian</label>
                                <br />
                                <input type="checkbox" className="cuisinOption" onChange={() => this.handleCuisineChange(3)} />
                                <label>Chinese Indian</label>
                                <br />
                                <input type="checkbox" className="cuisinOption" onChange={() => this.handleCuisineChange(4)} />
                                <label>Fast Food </label>
                                <br />
                                <input type="checkbox" className="cuisinOption" onChange={() => this.handleCuisineChange(5)} />
                                <label>Street Food</label>
                                <br />

                                <div className="filterPanelSubHeading">
                                    Cost For Two                                </div>
                                <input type="radio" className="cuisinOption" name="cost" onChange={() => this.handleCostChange(1, 500)} />
                                <label>Less then &#8377; 500</label>
                                <br />
                                <input type="radio" className="cuisinOption" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                                <label>&#8377; 500 to &#8377; 1000</label>
                                <br />
                                <input type="radio" className="cuisinOption" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                                <label>&#8377; 1000 to &#8377; 1500</label>
                                <br />
                                <input type="radio" className="cuisinOption" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                                <label>&#8377; 1500 to &#8377; 2000</label>
                                <br />
                                <input type="radio" className="cuisinOption" name="cost" onChange={() => this.handleCostChange(2000, 50000)} />
                                <label> &#8377; 2000 +</label>
                                <br />
                                <div className="filterPanelSubHeading">
                                    Sort
                                </div>
                                <input type="radio" className="cuisinOption" name="sort" onChange={() => this.handleSortChange(1)} />
                                <label> Price Low to High </label>
                                <br />
                                <input type="radio" className="cuisinOption" name="sort" onChange={() => this.handleSortChange(-1)} />
                                <label>Price High to Low</label>
                                <br />


                            </div>
                        </div>
                        <div className="col-9 col-sm-12 col-md-8 col-lg-9">
                            {restaurants.length > 0 ? restaurants.map((item) => {
                                return <div className="resultPanel" onClick={() => this.handleNavigate(item._id)}>
                                    <div className="row upperSection">
                                        <div className="col-2">
                                            <img src={`./${item.image}`} className="resultImage" />
                                        </div>
                                        <div className="col-10">
                                            <div className="resultheading">{item.name}</div>
                                            <div className="resultSubheading">{item.locality}</div>
                                            <div className="resultAddress">{item.city}</div>

                                        </div>

                                    </div>

                                    <div className="row lowerSection">
                                        <div className="col-2">
                                            <div className="resultAddress">CUISINES:</div>
                                            <div className="resultAddress">COST FOR TWO:</div>
                                        </div>
                                        <div className="col-10">
                                            <div className="resultSubheading">{item.cuisine.map(c_item => {
                                                return `${c_item.name}`;
                                            }).join(", ")}</div>
                                            <div className="resultSubheading">&#8377;{item.min_price}</div>

                                        </div>
                                    </div>

                                </div>
                            }) : <div className="no_records">No Records Found........&#128542; </div>}



                            {restaurants.length > 0 ? (
                                <div className="pagination">
                                    <div
                                        className={`page-number ${this.state.page === 1 ? 'disabled' : ''}`}
                                        onClick={() => this.handlePageChange(Math.max(1, this.state.page - 1))}
                                    >
                                        &laquo;
                                    </div>
                                    {pageCount.map((pageNo) => {
                                        return (
                                            <div
                                                key={pageNo}
                                                className={pageNo === this.state.page ? "page-number active" : "page-number"}
                                                onClick={() => this.handlePageChange(pageNo)}
                                            >
                                                {pageNo}
                                            </div>
                                        );
                                    })}
                                    <div
                                        className={`page-number ${this.state.page === pageCount.length ? 'disabled' : ''}`}
                                        onClick={() => this.handlePageChange(Math.min(pageCount.length, this.state.page + 1))}
                                    >
                                        &raquo;
                                    </div>
                                </div>
                            ) : null}

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
export default Filter;