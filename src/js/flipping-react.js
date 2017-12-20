import React from 'react';
import  {flipping}  from './flipping';

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
                     dangerouslySetInnerHTML={{__html:  this.props.content.slice(0,this.props.count>0?this.props.count:this.props.content.length).join('')}}>
                </div>

                <div>
                    <button>&#9658;</button>
                </div>

            </div>)
    }
}

ReactFlipping.propTypes = {};

ReactFlipping.defaultProps = {};

export default ReactFlipping;
