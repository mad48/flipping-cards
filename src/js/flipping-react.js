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

    componentWillUnmount() {
        //if (typeof flipping !== 'undefined')  delete this.flipping;
    }

    render() {
        return (
            <div id={this.props.id} className="flipping">

                <div>
                    <button>&#9668;</button>
                </div>

                <div className="cards"
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
     "autoFlipMode": PropTypes.bool,
     "autoFlipDelay": PropTypes.number,
     "pauseMouseOver": PropTypes.bool,

     "displayShadow": PropTypes.bool,
     "transitionDuration": PropTypes.number,

     "rotationMode": PropTypes.oneOf(["simultaneous", "sequential"]),
     "sequentialDelay": PropTypes.number,

     "cardWidth": PropTypes.number,
     "cardHeight": PropTypes.number,

     "spacingHorizontal": PropTypes.number,
     "spacingVertical": PropTypes.number,

     "cardsPerRow": PropTypes.number,

     "startFromIndex": PropTypes.number
     })).isRequired,

     "content": PropTypes.arrayOf(PropTypes.string).isRequired*/
};


ReactFlipping.defaultProps = {
    /*    "autoFlipMode": false,
     "autoFlipDelay": 1500,

     "displayShadow": true,
     "transitionDuration": 700,
     "pauseMouseOver": true,

     "rotationMode": "simultaneous",
     "sequentialDelay": 600,

     "cardWidth": 200,
     "cardHeight": 200,

     "spacingVertical": 15,
     "spacingHorizontal": 15,

     "cardsPerRow": 0,

     "startFromIndex": 1*/
};

export default ReactFlipping;
