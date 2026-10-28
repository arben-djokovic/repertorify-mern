import "../../pages/Profile/profile.scss";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import { PlaylistSkeleton } from "../Skeleton/Skeleton";

export default function FavPlaylists({ user, loading }) {
  return (
    <section className="myPlaylists">
      <div className="list">
        {loading ? <PlaylistSkeleton count={4} /> : user.favouritePlaylists.length > 0 ? user.favouritePlaylists.map((playlist, i) => (
          <PlaylistItem playlist={{...playlist, user: user}} className={i} key={i} i={i} />
        )) : <p className="noPlaylists">{user._id !== localStorage.getItem("userid") ? "Private information" : "You don't have any favourite playlist"}</p>}
      </div>
    </section>
  );
}
