import React from "react";
import '../Styles/Details.css';
import queryString from 'query-string';
import axios from "axios";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Modal from 'react-modal';
import { withRouter } from "react-router-dom";
import GooglePayButton from '@google-pay/button-react';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'pink',
        color: 'black'
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},//we get single restaurant
            menuItems: [],
            menuItemsModalIsOpen: false,
            galleryModalIsOpen: false,
            restId: undefined,
            subTotal: 0,
            formModalIsOpen: false,
            userName: undefined,
            userEmail: undefined,
            userAddress: undefined,
            useContact: undefined

        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restaurant } = qs;// restaurant id

        axios({
            method: 'GET',
            url: `http://localhost:3501/restaurant/${restaurant}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                // console.log(response);
                this.setState({ restaurant: response.data.restaurant, restId: restaurant })
            })
            .catch(err => console.log(err));

    }


    handleOrder = (restId) => {

        if (!restId) {
            console.log("No restId provided");  // Add this for debugging
            return;
        }

        axios({
            method: 'GET',
            url: `http://localhost:3501/menuitems/${restId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                console.log(response);

                const menuItems = response.data.menuItems.map(item => ({
                    ...item,
                    qty: 0  // Initialize qty to 0 for each item
                }));


                this.setState({ menuItems: menuItems, menuItemsModalIsOpen: true })


            })

            .catch(err => console.log(err));


    }



    handleModal = (state, value) => {

        this.setState({ [state]: value });
    }


    addItems = (index, operationType) => {

        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == "add") {
            item.qty += 1;
        } else {
            item.qty -= 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });

    }

    handleFormDataChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    isDate(val) {
        // cross realm compatible
        return Object.prototype.toString.call(val) === '[object Date]';

    }

    isObj = (val) => {
        return typeof val === 'object';
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }

    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createComment('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)

        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`http://localhost:3501/api/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    handlePayment = () => {
        const { subTotal, userEmail } = this.state;
        if (!userEmail) {
            alert("Please fill this field and then Proceed......");
        }
        else {
            // payment API call
            const paymentObj = {
                amount: subTotal,
                email: userEmail
            };

            axios({
                url: `http://localhost:3501/api/payment`,
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                // data: data
            }).then(response => {
                var information = {
                    action: "https",
                    params: response
                }
                this.post(information)
            }).catch(err => console.log(err));




        }
    }


    render() {
        const { restaurant, menuItems, menuItemsModalIsOpen, subTotal, galleryModalIsOpen, formModalIsOpen } = this.state;

        return (


            <div>
                <div>

                    <Carousel
                        showThumbs={false}
                        showIndicators={false}>
                        <div style={{ height: "550px", width: "100%" }}>
                            <img src="Assets/food.jpg" alt="sorry for inconvenince" style={{ width: "100%", objectFit: "cover", height: "100%" }} />

                        </div>
                        <div style={{ height: "550px", width: "100%" }}>
                            <img src="Assets/food.jpg" alt="sorry for inconvenince" style={{ width: "100%", objectFit: "cover", height: "100%" }} />

                        </div>
                        <div style={{ height: "550px", width: "100%" }}>
                            <img src="Assets/food.jpg" alt="sorry for inconvenince" style={{ width: "100%", objectFit: "cover", height: "100%" }} />

                        </div>

                    </Carousel>
                    <button className="gallery-button" onClick={() => this.handleModal("galleryModalIsOpen", true)}> Click to see image gallery </button>
                </div>
                <div className="rest-name">

                    <div className="heading">{restaurant.name}</div>
                  
                    <button className="btn-order" onClick={() => {
                        this.handleOrder(restaurant._id)

                    }}> Place Online order</button>
                </div>




                <Tabs>
                    <TabList className="my-tabs__tab-list">
                        <Tab className="my-tabs__tab" selectedClassName="my-tabs__tab--selected"><h2>overview</h2></Tab>
                        <Tab className="my-tabs__tab" selectedClassName="my-tabs__tab--selected"><h2>contact</h2></Tab>
                    </TabList>
                    <TabPanel className="my-tabs__tab-panel">

                        <div className="tab" style={{ marginLeft: "50px" }}>
                            <input type="radio" id="tab-1" />&nbsp;&nbsp;
                            <label for="tab_1">overview</label>
                            <div className="content">
                                <div className="about">about this place</div>
                                <div className="about">about this place</div>
                                <div className="about">average cost</div>
                                <div className="about">&#8377; 700 for two pepole</div>
                                <div className="about">about this place</div>
                            </div>
                        </div>

                    </TabPanel>
                    <TabPanel className="my-tabs__tab-panel">
                        <div className="tab" style={{ marginLeft: "50px" }}>
                            <input type="radio" id="tab-2" />&nbsp;&nbsp;
                            <label for="tab_2">contact</label>
                            <div className="content">
                                <div className="about">phone number</div>
                                <div className="about">about this place</div>
                                <div className="about">average cost</div>
                                <div className="about">&#8377; 700 for two pepole</div>
                                <div className="about">about this place</div>
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>

                <Modal
                    isOpen={menuItemsModalIsOpen}
                    style={customStyles}>


                    <div>

                        <button className="crossModel" style={{
                            marginLeft: '90%',
                            backgroundColor: 'transparent',
                            fontSize: '25px',
                            border: 'none'

                        }}
                            onClick={() => this.handleModal("menuItemsModalIsOpen", false)}>
                            x
                        </button>
                        <div>
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            <h3 className="item-total"> SubTotal: {subTotal}</h3>
                            <button className="btn btn-danger order-button" onClick={() => {

                                this.handleModal("formModalIsOpen", true)
                            }}> Pay Now </button>

                        </div>

                        {menuItems.map((item, index) => {
                            return (
                                <div key={index}>

                                    <div className="card mb-3" style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        width: '350px'
                                    }}>
                                        <div className="row g-0">
                                            <div className="col-md-9">
                                                <h5 className="card-text">{item.name}</h5>
                                                <p className="card-text">&#8377;{item.price}</p>
                                                <p className="card-text"><small className="text-body-secondary">{item.description}</small></p>

                                            </div>
                                            <div className="col-md-3 ">


                                                <img src="Assets/dinner.jpg" class="img-fluid " alt="..." style={{
                                                    height: '55px',
                                                    width: '55px',
                                                    borderRadius: '10px',
                                                    marginTop: '12px',
                                                    marginLeft: '3px'

                                                }} />
                                                {item.qty == 0 ? (<div>
                                                    <button className="add-button" onClick={() => this.addItems(index, "add")}>Add</button>

                                                </div>) : (

                                                    <div>
                                                        <button onClick={() => this.addItems(index, "subtract")}> - </button>
                                                        <span style={{
                                                            backgroundColor: "blue",
                                                            color: 'white',
                                                            padding: '8px'

                                                        }}>{item.qty}</span>
                                                        <button onClick={() => this.addItems(index, "add")}> + </button>

                                                    </div>)}




                                            </div>
                                        </div>
                                    </div>
                                    <hr />

                                </div>

                            );
                        })}

                    </div>

                </Modal>
                <Modal
                    isOpen={galleryModalIsOpen}
                    style={customStyles}>


                    <div style={{ width: "800px", height: "600px" }}>

                        <button className="crossModel" style={{
                            marginLeft: '98%',
                            backgroundColor: 'transparent',
                            fontSize: '30px',
                            border: 'none',
                            color: 'blue'

                        }}
                            onClick={() => this.handleModal("galleryModalIsOpen", false)}> x </button>
                        <Carousel
                            showThumbs={false}
                            showIndicators={false}>
                            {restaurant && restaurant.thumb && restaurant.thumb.map(item => {
                                return <div style={{ width: "100%", height: "600px" }}>
                                    <img src={`./${item}`} alt="sorry for inconvenince" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                                </div>
                            })
                            }

                        </Carousel>
                    </div>
                </Modal>
               
                <Modal
                    isOpen={formModalIsOpen}
                    style={customStyles}>
                    <div>
                        <button className="crossModel" style={{
                            marginLeft: '98%',
                            backgroundColor: 'transparent',
                            fontSize: '30px',
                            border: 'none',
                            color: 'black'

                        }}
                            onClick={() => this.handleModal("formModalIsOpen", false)}> x </button>
                        <form>
                            <h4 className="restaurant-name">{restaurant.name}</h4>

                            <label for="name"> Name:</label><br></br>
                            <input type="text" id="name" placeholder="Enter Your Name" className="payment_form" /><br></br>

                            <label for="E_mail"> Email</label><br></br>
                            <input type="email" id="E_mail" placeholder="Enter Your Email" className="payment_form" /><br></br>

                            <label for="address">Address:</label><br></br>
                            <input type="text" id="address" placeholder="Enter Your Address" className="payment_form" onChange={(event) => this.handleFormDataChange(event, 'useAddress')} /><br></br>

                            <label for="contact">Contact Number:</label><br></br>
                            <input type="text" id="contact" placeholder="Enter Your Contact Number" className="payment_form" onChange={(event) => this.handleFormDataChange(event, 'useContact')} /><br></br>

                            <input type="submit" value="Proceed" id="proceed" onClick={this.handlePayment} />
                         
                            <GooglePayButton
                                environment="TEST"
                                paymentRequest={{
                                    apiVersion: 2,
                                    apiVersionMinor: 0,
                                    allowedPaymentMethods: [
                                        {
                                            type: 'CARD',
                                            parameters: {
                                                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                                allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                            },
                                            tokenizationSpecification: {
                                                type: 'PAYMENT_GATEWAY',
                                                parameters: {
                                                    gateway: 'example',
                                                    gatewayMerchantId: 'exampleGatewayMerchantId',
                                                },
                                            },
                                        },
                                    ],
                                    merchantInfo: {
                                        merchantId: '12345678901234567890',
                                        merchantName: 'Demo Merchant',
                                    },
                                    transactionInfo: {
                                        totalPriceStatus: 'FINAL',
                                        totalPriceLabel: 'Total',
                                        totalPrice: '1.00',
                                        currencyCode: 'INR',
                                        countryCode: 'IN',
                                    },
                                }}
                                onLoadPaymentData={paymentRequest => {
                                    console.log('load payment data', paymentRequest);
                                }}
                            />

                        </form>
                    </div>

                </Modal>


            </div>
        )
    }
}
export default withRouter(Details);