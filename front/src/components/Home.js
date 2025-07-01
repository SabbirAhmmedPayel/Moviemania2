import { Link } from "react-router-dom";
import "../styles/Home.css"; // Make sure you have this CSS file
import TopUsers from './TopUsers';


function Home() {
  return (
     
    <div className="home-wrapper">
      <section className="intro">
        <h2>Your source for everything movies</h2>
        <p>
          Discover reviews, trailers, and ratings for your favorite films.
          <br />
          <a href="https://donate.example.com" target="_blank" rel="noopener noreferrer">
            Donate here
          </a>
        </p>
      </section>

      <div className="center-link">
        <Link to="/allmovies">View All Movies →</Link>
      </div>

      <div className="sidebar">
        <small>
          Are you an editor?{" "}
          <a href="/editor" className="editor-link">
            Click here
          </a>
        </small>

        <div className="friend-sites">
          <h4>🎬 Friend Websites:</h4>
          <ul>
            <li><a href="https://yts.mx" target="_blank">YTS</a></li>
            <li><a href="https://opensubtitles.org" target="_blank">OPENSUBS</a></li>
            <li><a href="https://netflix.com" target="_blank">Netflix</a></li>
          </ul>
        </div>

      
        
        <div className="youtube-link">
          <a href="https://youtube.com" target="_blank">
            📺 Follow our YouTube Channel
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
