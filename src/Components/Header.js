import React from 'react';
import '../Styles/header.css';
import Modal from 'react-modal';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import FacebookLogin from 'react-facebook-login';


const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'aliceblue'
    },
  };
//   const textButton = {
//     backgroundColor: 'rgba(0, 0, 0, 0.8)'
//   };


class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            backgroundColor: '',
            display: "none",
            loginModelIsOpen: false,
            signUpModelIsOpen: false,
            isLoggedIn: false,
            loggedInUser: undefined
            
        }
        
    }
    componentDidMount() {
        const path = this.props.history.location.pathname;
        let bg;
        let display;
      

        if (path == '/') {
            // bg = "black";
            bg = "red";
            // display = "none";
          

        } else {
            bg ="#ff0000";
            display ="inline-block";
         
        }
        this.setState({ backgroundColor: bg, display: display });
    }

    navigate = (path) => {
        this.props.history.push(path);
    }
    

    credentialResponse = (response) => {
        const decodedToken = jwtDecode(response.credential);
        this.setState({  isLoggedIn: true, loggedInUser: decodedToken.name, loginModelIsOpen: false })

    }

   responseFacebook = (response) => {
        console.log("result:",response);
      }
      componentClicked = (data) => {
        console.log(data);
        
      }
 
    handlelogin = () => {
        this.setState({ loginModelIsOpen: true });
    }
    handleCancel = () => {
        this.setState({ loginModelIsOpen: false });

    } 
    handleSignUp = () => {
        this.setState({ signupModelIsOpen: true });
    }
    handleSignUpCancel = () => {
        this.setState({ signupModelIsOpen: false });

    } 
  
    handleLogout = () => {
        this.setState({ isLoggedIn: false, loggedInUser: undefined })
    }


    render() {
        const { backgroundColor, display, loginModelIsOpen, isLoggedIn, loggedInUser, signupModelIsOpen } = this.state;
        return(
            <div>
            <div className='header' style={{ backgroundColor: backgroundColor }}>
                <div className='header-logo' style={{ display: display }}>
                    <p className='p-logo'  onClick={() => this.navigate('/')}>m!</p>
                </div>
                {!isLoggedIn ?
                
                <div className='user-account'>
                    <div className='login' onClick={this.handlelogin}>Login</div>
                    <div className='signup' onClick={this.handleSignUp}>Create an Account</div>
                </div>
                :   <div className='user-account'>
                <div className='login'>{loggedInUser}</div>
                <div className='signup' onClick={this.handleLogout}>Logout</div>
            </div>}
             

                
            </div>
            <Modal
                                    isOpen={signupModelIsOpen}
                                    style={customStyles}>
                         

                            <div>
                                <h2 className='h2-login'>Sign Up</h2>
                                <input className='ep-input'  type='text' placeholder='Email'/>
                                <br></br>
                                
                                
                                <input className='ep-input' type='text' placeholder='Password'/>
                                <br></br>
                               
                                <div className='button-div'>
                                    <button className='form-button'>Sign Up</button>
                                    <button className='form-button' onClick={this.handleSignUpCancel}>Cancel</button>
                                   
                                </div>
                            </div>
                            </Modal>

                <Modal
                        isOpen={loginModelIsOpen}
                        style={customStyles}>
                         

                            <div>
                                <h2 className='h2-login'>Login</h2>
                                <input className='ep-input'  type='text' placeholder='Email'/>
                                <br></br>
                                
                                
                                <input className='ep-input' type='text' placeholder='Password'/>
                                <br></br>
                               
                                <div className='button-div'>
                                    <button className='form-button'>Login</button>
                                    <button className='form-button' onClick={this.handleCancel}>Cancel</button>
                                   
                                </div>
                            </div>

                  
                            <div>
                            <GoogleOAuthProvider clientId="714118314428-r9dp6aq06b1ip3tu8dgc3ta0613gk2qs.apps.googleusercontent.com">
                            <GoogleLogin
                                    // onSuccess={credentialResponse => {
                                    //     // console.log(credentialResponse);
                                    //     const credentialResponseDecoded = jwtDecode(
                                    //         credentialResponse?.credential
                                    //     );
                                    //     console.log(credentialResponseDecoded); 
                                    // }}
                                    onSuccess={this.credentialResponse}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                    />
                                     </GoogleOAuthProvider>
                            </div>
                            <div>
                            <FacebookLogin
                           
                                    appId="821435860167305"
                                    textButton='continue with facebook'
                                    autoLoad={true}
                                    fields="name,email,picture"
                                    onClick={this.componentClicked}
                                    callback={this.responseFacebook}
                                    
                                     />

                            </div>
                                    
                   
                       
      </Modal>

               
              
              
        

            </div>
        )
    }
}
export default Header;