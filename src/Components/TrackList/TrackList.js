import React from "react";
import "./TrackList.css";
import Track from "../Track/Track";

class TrackList extends React.Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks[0].name} 
        {/* <button className="Playlist-save">SAVE TO SPOTIFY</button>
        {this.props.tracks.map((track) => {
          return <Track track={track} key={track.id} />;
        })} */}
      </div>
    );
  }
}
export default TrackList;

//not displaying - issue somewhere in step 32
