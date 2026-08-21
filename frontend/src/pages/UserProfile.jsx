// src/pages/UserProfile.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserProfile, toggleFollow, getUserBadges } from "../services/communityService";
import RecipeCard from "../components/RecipeCard";

function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileData, badgeData] = await Promise.all([
          getUserProfile(userId),
          getUserBadges(userId),
        ]);
        setProfile(profileData);
        setBadges(badgeData.badges);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      const result = await toggleFollow(userId);
      setIsFollowing(result.isFollowing);
      setProfile((prev) => ({ ...prev, followersCount: result.followersCount }));
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  if (loading) return <p className="p-8 text-gray-600">Loading profile...</p>;
  if (!profile) return <p className="p-8 text-red-600">User not found.</p>;

  const isOwnProfile = currentUser?._id === userId;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {profile.followersCount} followers · {profile.followingCount} following
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {badges.map((badge) => (
              <span
                key={badge.id}
                className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full"
              >
                🏆 {badge.label}
              </span>
            ))}
          </div>
        </div>

        {isAuthenticated && !isOwnProfile && (
          <button
            onClick={handleFollowToggle}
            className={`px-5 py-2 rounded-md font-medium transition ${
              isFollowing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recipes</h2>
      {profile.recipes.length === 0 ? (
        <p className="text-gray-600">No recipes published yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;