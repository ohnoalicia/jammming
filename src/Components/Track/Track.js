import React from "react";

class Track extends React.Component {
  renderAction() {
    if (this.props.isRemoval) {
      return <button className="Track-action">-</button>;
    } else {
      return <button className="Track-action">+</button>;
    }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3> track name will go here</h3>
          <p> track artist | track album </p>
        </div>
      </div>
    );
  }
}

export default Track;
