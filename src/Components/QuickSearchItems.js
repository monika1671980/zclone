import React from "react";
import { withRouter } from 'react-router-dom';

class QuickSearchItem extends React.Component {
    handleNavigate = (mealtypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`);
        } else {
            this.props.history.push(`/filter?mealtype=${mealtypeId}`);
        }

    }

    render() {
        const { name, content, image, meal_type } = this.props.QuickSearchItemData;
        return (
            <div>
                <div className="qs-box" onClick={() => this.handleNavigate(meal_type)}>
                    <div className="qs-box-content">
                        <img src={`./${image}`} className="qs-image" />
                        <h4 className="qs-item-heading"> {name}</h4>
                        <p className="qs-item-description">{content}</p>
                    </div>
                </div>


            </div>
        )
    }

}
export default withRouter(QuickSearchItem);