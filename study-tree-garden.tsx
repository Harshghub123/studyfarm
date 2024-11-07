import React, { useState } from 'react';

const StudyTreeGarden = () => {
  const [trees, setTrees] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [selectedSize, setSelectedSize] = useState('regular');
  const [showAchievement, setShowAchievement] = useState(false);
  const [lastAchievement, setLastAchievement] = useState('');

  const treeTypes = {
    small: [
      { emoji: '🌱', name: 'Sprout', points: 1 },
      { emoji: '🌿', name: 'Seedling', points: 1 },
      { emoji: '☘️', name: 'Clover', points: 1 },
    ],
    regular: [
      { emoji: '🌳', name: 'Oak', points: 2 },
      { emoji: '🌴', name: 'Palm', points: 2 },
      { emoji: '🎋', name: 'Bamboo', points: 2 },
    ],
    big: [
      { emoji: '🌲', name: 'Pine', points: 3 },
      { emoji: '🎄', name: 'Evergreen', points: 3 },
      { emoji: '🌺', name: 'Flowering', points: 3 },
    ]
  };

  const achievements = {
    firstTree: { name: "First Seed! 🌱", desc: "Plant your first tree", points: 5 },
    tinyGrove: { name: "Tiny Grove! 🌿", desc: "Plant 5 trees", points: 10 },
    forestKeeper: { name: "Forest Keeper! 🌳", desc: "Plant 10 trees", points: 20 },
    masterGardener: { name: "Master Gardener! 🎋", desc: "Reach level 5", points: 30 },
    diverseGarden: { name: "Biodiversity! 🌺", desc: "Plant all tree types", points: 40 },
  };

  const getLevel = (points) => Math.floor(points / 10) + 1;
  const getTotalPoints = () => trees.reduce((sum, tree) => sum + tree.points, 0);

  const getRandomTreeOfSize = (size) => {
    const options = treeTypes[size];
    return options[Math.floor(Math.random() * options.length)];
  };

  const checkAchievements = (newTrees) => {
    const totalTrees = newTrees.length;
    const points = getTotalPoints();
    const level = getLevel(points);

    if (totalTrees === 1 && trees.length === 0) {
      showAchievementMessage(achievements.firstTree.name);
    } else if (totalTrees === 5) {
      showAchievementMessage(achievements.tinyGrove.name);
    } else if (totalTrees === 10) {
      showAchievementMessage(achievements.forestKeeper.name);
    } else if (level === 5) {
      showAchievementMessage(achievements.masterGardener.name);
    }
  };

  const showAchievementMessage = (message) => {
    setLastAchievement(message);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 3000);
  };

  const addTree = () => {
    if (newTopic && selectedSize) {
      const treeType = getRandomTreeOfSize(selectedSize);
      const newTrees = [...trees, {
        id: Date.now(),
        topic: newTopic,
        size: selectedSize,
        emoji: treeType.emoji,
        name: treeType.name,
        points: treeType.points,
        plantedAt: new Date().toLocaleDateString(),
        gridColumn: Math.floor(Math.random() * 3) + 1,
        gridRow: Math.floor(Math.random() * 3) + 1
      }];
      setTrees(newTrees);
      setNewTopic('');
      checkAchievements(newTrees);
    }
  };

  const deleteTree = (id) => {
    setTrees(trees.filter(tree => tree.id !== id));
  };

  const points = getTotalPoints();
  const level = getLevel(points);
  const progressToNextLevel = (points % 10) * 10;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-b from-green-50 to-white min-h-screen">
      {showAchievement && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          {lastAchievement}
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Study Farm</h1>
        
        <div className="bg-white rounded-lg shadow-md p-4 max-w-sm mx-auto mb-4">
          <div className="text-xl font-bold text-green-700">Level {level} Farmer</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progressToNextLevel}%` }}></div>
          </div>
          <div className="text-sm text-gray-600">
            {points} points • {10 - (points % 10)} points to next level
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <input
          type="text"
          placeholder="What did you study today?"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
        />

        <div className="flex justify-center gap-4 mb-6">
          {Object.entries(treeTypes).map(([size, types]) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-6 py-2 rounded-full capitalize transition-all ${
                selectedSize === size
                  ? 'bg-green-500 text-white shadow-md transform scale-105'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {size} ({types[0].points}pt)
            </button>
          ))}
        </div>

        <button
          onClick={addTree}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
        >
          Plant Your Tree
        </button>
      </div>

      {/* Farm Grid */}
      <div className="relative bg-amber-100 rounded-xl p-8 min-h-[500px] border-4 border-amber-200">
        <div className="absolute inset-0 bg-[radial-gradient(#86754c_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        <div className="grid grid-cols-3 gap-4 relative">
          {trees.map((tree) => (
            <div key={tree.id} 
                 className="relative bg-transparent p-4 transform hover:scale-105 transition-all duration-300 group">
              <button
                onClick={() => deleteTree(tree.id)}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-200 text-sm"
              >
                ×
              </button>
              <div className="flex flex-col items-center">
                <div style={{ fontSize: '2rem' }}>
                  {tree.emoji}
                </div>
                <h3 className="mt-1 text-sm font-semibold text-green-800 text-center bg-white/80 rounded-full px-2">
                  {tree.topic}
                </h3>
                <div className="mt-1 px-2 py-0.5 bg-green-100 rounded-full text-xs text-green-600">
                  {tree.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {trees.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          Your farm is empty. Plant your first tree by adding a topic above! 🌱
        </div>
      )}

      {/* Achievements Panel */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-green-800 mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(achievements).map((achievement) => (
            <div key={achievement.name} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <div className="text-2xl">{achievement.name.split('!')[1]}</div>
              <div>
                <div className="font-medium">{achievement.name.split('!')[0]}!</div>
                <div className="text-sm text-gray-600">{achievement.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyTreeGarden;
