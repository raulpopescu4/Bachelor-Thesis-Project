import React from 'react';
import './WatchLinks.css'; // Import the CSS for styling

const WatchLinks = () => {
  const links = [
    { url: 'https://combatpress.com/live/', title: 'Combat Press Live' },
    { url: 'https://www.ufc.com/watch', title: 'Watch UFC' },
    { url: 'https://www.espn.com/where-to-watch/leagues/ufc?addata=w2w_mma_subnav', title: 'ESPN UFC Watch' },
    { url: 'https://fightingtomatoes.com/Best-Fights-On-YouTube', title: 'Best Fights on YouTube' },
    { url: 'https://www.youtube.com/@ufc', title: 'UFC YouTube Channel' },
    { url: 'https://plus.espn.com/', title: 'ESPN Plus' },
    { url: 'https://bellator.com/watch/bellator', title: 'Bellator Watch' },
  ];

  return (
    <div className="watchlinks-container">
      <h2 className="title">Watch Fights Online</h2>
      <div className="links-list">
        {links.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="link-item">
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default WatchLinks;
