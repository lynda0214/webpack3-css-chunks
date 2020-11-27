import React, {Component} from "react";

export default class NotFound extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-12 page-404">
          <div className="number font-red"> 404</div>
          <div className="details">
            <h3>Oops! You're lost.</h3>
            <p> We can not find the page you're looking for.</p>
          </div>
        </div>
      </div>
    );
  };
}
