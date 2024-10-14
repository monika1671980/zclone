import React from 'react';
import QuickSearchItem from './QuickSearchItems';

class QuickSearch extends React.Component {

    
    render() {
        const { quickSearchData } = this.props;
        return(
            <div>
                <div className="bottomSection">
            <h1 className="qs-heading">Quick Searches</h1>
            <h3 className="qs-subHeading">Discover restaurants by type of meal</h3>
            <div className="qs-boxes-container">
                {
                   quickSearchData.map((item) =>{
                    return <QuickSearchItem QuickSearchItemData={item}/>
                   }) 
                }
              
            
                </div>
                </div>

            </div>
        )
    }
}
export default QuickSearch;