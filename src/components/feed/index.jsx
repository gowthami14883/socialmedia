import "./feed.css";

const posts = [
  {
    id: 1,
    user: "gowthami",
    type: "image",
    media: "src/assests/dashboard/visaka.png",
    caption: "Chasing good vibes ✨",
    likes: 234
  },
  {
    id: 2,
    user: "wanderlust_diaries",
    type: "video",
    media: "src/assests/videos/video1.mp4",
    caption: "Travel diaries 🌍",
    likes: 1200
  },
  {
    id: 3,
    user: "foodie_corner",
    type: "image",
    media: "src/assests/dashboard/atumlife.jpg",
    caption: "Food is love ❤️",
    likes: 890
  },
  {
    id: 4,
    user: "fitness_freak",
    type: "video",
    media: "src/assests/videos/workout.mp4",
    caption: "No excuses 💪",
    likes: 2100
  },
  {
    id: 5,
    user: "music_vibes",
    type: "image",
    media: "src/assests/dashboard/insta.jpg",
    caption: "Late night mood 🎧",
    likes: 640
  },
  {
    id: 6,
    user: "tech_world",
    type: "image",
    media: "src/assests/dashboard/atumobile.jpg",
    caption: "Tech that matters 🚀",
    likes: 780
  },
  {
    id: 7,
    user: "nature_lover",
    type: "image",
    media: "src/assests/dashboard/atumlife.jpg",
    caption: "Peaceful mornings 🍃",
    likes: 530
  },
  {
    id: 8,
    user: "daily_vlogs",
    type: "video",
    media: "src/assests/videos/music.mp4",
    caption: "A day in my life 🎥",
    likes: 1500
  },
  {
    id: 9,
    user: "art_studio",
    type: "image",
    media: "src/assests/dashboard/visaka.png",
    caption: "Creativity everywhere 🎨",
    likes: 410
  },
  {
    id: 10,
    user: "street_photography",
    type: "image",
    media: "src/assests/dashboard/insta.jpg",
    caption: "Urban stories 📸",
    likes: 980
  },
  {
    id: 11,
    user: "startup_life",
    type: "video",
    media: "src/assests/videos/video1.mp4",
    caption: "Building in public 💻",
    likes: 860
  },
  {
    id: 12,
    user: "selfcare_club",
    type: "image",
    media: "src/assests/dashboard/atumobile.jpg",
    caption: "Slow days are good days 🌸",
    likes: 720
  },
  {
  id: 13,
  user: "sunset_seekers",
  type: "image",
  media: "src/assests/dashboard/insta.jpg",
  caption: "Golden hour magic 🌅",
  likes: 1340
},
{
  id: 14,
  user: "coding_life",
  type: "video",
  media: "src/assests/videos/video1.mp4",
  caption: "Debugging at 2 AM 😴💻",
  likes: 920
},
{
  id: 15,
  user: "yoga_daily",
  type: "image",
  media: "src/assests/dashboard/atumlife.jpg",
  caption: "Breathe in, breathe out 🧘‍♀️",
  likes: 680
},
{
  id: 16,
  user: "road_trip_vibes",
  type: "video",
  media: "src/assests/videos/music.mp4",
  caption: "Windows down, music up 🚘🎶",
  likes: 1750
},
{
  id: 17,
  user: "bookish_world",
  type: "image",
  media: "src/assests/dashboard/visaka.png",
  caption: "Currently reading 📖✨",
  likes: 540
},
{
  id: 18,
  user: "home_garden",
  type: "image",
  media: "src/assests/dashboard/atumobile.jpg",
  caption: "Growing happiness 🌱",
  likes: 460
},
{
  id: 19,
  user: "reel_creator",
  type: "video",
  media: "src/assests/videos/workout.mp4",
  caption: "Reels all day 🎬🔥",
  likes: 2400
},
{
  id: 20,
  user: "fashion_diary",
  type: "image",
  media: "src/assests/dashboard/insta.jpg",
  caption: "Today’s outfit 🖤",
  likes: 1120
},
{
  id: 21,
  user: "coffee_addict",
  type: "image",
  media: "src/assests/dashboard/atumlife.jpg",
  caption: "But first, coffee ☕",
  likes: 890
},
{
  id: 22,
  user: "mindfulness_space",
  type: "video",
  media: "src/assests/videos/video1.mp4",
  caption: "Slow down and relax 🌿",
  likes: 770
}

];


function Feed() {
  return (
    <div className="ig-feed">
      {posts.map((post) => (
        <div className="ig-post" key={post.id}>
          {/* Header */}
          <div className="ig-post-header">
            <div className="ig-avatar"></div>
            <b>{post.user}</b>
          </div>

          {/* Media */}
          {post.type === "image" ? (
            <img src={post.media} className="ig-media" />
          ) : (
            <video
              src={post.media}
              className="ig-media"
              controls
              muted
              loop
            />
          )}

          {/* Actions */}
          <div className="ig-actions">
            ❤️ 💬 📤
          </div>

          {/* Likes */}
          <div className="ig-likes">{post.likes} likes</div>

          {/* Caption */}
          <div className="ig-caption">
            <b>{post.user}</b> {post.caption}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;
