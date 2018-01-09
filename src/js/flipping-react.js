import React from 'react';
import PropTypes from "prop-types";
import  flipping  from './flipping';

class ReactFlipping extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    };

    componentDidMount() {
        flipping.init(this.props.id, this.props.options);
    };

    render() {
        return (
            <div id={this.props.id} className="flipping">

                <div>
                    <button>&#9668;</button>
                </div>

                <div className="card-box"
                     dangerouslySetInnerHTML={{__html:  this.props.content.join('')}}>
                </div>

                <div>
                    <button>&#9658;</button>
                </div>

            </div>)
    }
}


ReactFlipping.propTypes = {
    /*    "options": PropTypes.objectOf(PropTypes.shape({
     "autoflip_mode": PropTypes.bool,
     "autoflip-delay": PropTypes.number,
     "mouseover-pause": PropTypes.bool,

     "shadow": PropTypes.bool,
     "transition-duration": PropTypes.number,

     "rotation-mode": PropTypes.oneOf(["simultaneous", "sequential"]),
     "sequential-delay": PropTypes.number,

     "card-width": PropTypes.number,
     "card-height": PropTypes.number,

     "spacing-horizontal": PropTypes.number,
     "spacing-vertical": PropTypes.number,

     "cards-per-row": PropTypes.number,
     "number-of-rows": PropTypes.number,

     "starting-number": PropTypes.number
     })).isRequired,

     "content": PropTypes.arrayOf(PropTypes.string).isRequired*/
};


ReactFlipping.defaultProps = {
    /*    "autoflip-mode": false,
     "autoflip-delay": 1500,

     "shadow": true,
     "transition-duration": 700,
     "mouseover-pause": true,

     "rotation-mode": "simultaneous",
     "sequential-delay": 600,

     "card-width": 200,
     "card-height": 200,

     "spacing-vertical": 15,
     "spacing-horizontal": 15,

     "cards-per-row": 0,
     "number-of-rows": 0,

     "starting-number": 0*/
};

export default ReactFlipping;
