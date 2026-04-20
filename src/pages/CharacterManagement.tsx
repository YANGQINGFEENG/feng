import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const CharacterManagement: React.FC = () => {
  const navigate = useNavigate();
  const { currentPlayer, levelUpSkill } = useGameStore();

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-[#00d4ff] mb-4">
            没有角色
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            请先创建一个角色
          </p>
          <button
            onClick={() => navigate('/character-creation')}
            className="py-3 px-6 bg-[#00d4ff] text-[#1a1a2e] font-medium rounded-lg hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all duration-300"
          >
            创建角色
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-4">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-[#00d4ff] mb-2">
          {currentPlayer.name}
        </h1>
        <p className="text-xl text-gray-300">
          等级 {currentPlayer.level} • 经验值 {currentPlayer.experience}
        </p>
      </motion.div>

      {/* 角色状态 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        {/* 技能树 */}
        <div className="bg-[#2a2a3e] border border-[#00d4ff] rounded-lg p-6 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
          <h2 className="text-2xl font-bold text-[#00d4ff] mb-4">技能树</h2>
          <div className="space-y-4">
            {currentPlayer.skills.map((skill) => (
              <div key={skill.id} className="p-4 bg-[#1a1a2e] border border-[#00d4ff]/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-[#00d4ff]">{skill.name}</h3>
                  <span className="text-gray-300">等级 {skill.level}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{skill.description}</p>
                <button
                  onClick={() => levelUpSkill(skill.id)}
                  className="w-full py-2 bg-[#00d4ff] text-[#1a1a2e] font-medium rounded-lg hover:shadow-[0_0_10px_rgba(0,212,255,0.5)] transition-all duration-300"
                >
                  升级技能
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 装备和物品 */}
        <div className="bg-[#2a2a3e] border border-[#00d4ff] rounded-lg p-6 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
          <h2 className="text-2xl font-bold text-[#00d4ff] mb-4">装备</h2>
          <div className="space-y-3 mb-6">
            {currentPlayer.equipment.map((equipment) => (
              <div key={equipment.id} className="p-3 bg-[#1a1a2e] border border-[#00d4ff]/50 rounded-lg">
                <h3 className="text-[#00d4ff] font-medium">{equipment.name}</h3>
                <p className="text-gray-400 text-sm">{equipment.type} • {equipment.rarity}</p>
                <div className="text-gray-400 text-sm mt-1">
                  {Object.entries(equipment.stats).map(([key, value]) => (
                    <span key={key} className="mr-4">{key}: {value}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-[#00d4ff] mb-4">物品栏</h2>
          <div className="grid grid-cols-2 gap-3">
            {currentPlayer.inventory.items.length > 0 ? (
              currentPlayer.inventory.items.map((item) => (
                <div key={item.id} className="p-3 bg-[#1a1a2e] border border-[#00d4ff]/50 rounded-lg">
                  <h3 className="text-[#00d4ff] font-medium">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.type} • 数量: {item.quantity}</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-400 py-8">
                物品栏为空
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 返回按钮 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center"
      >
        <button
          onClick={() => navigate('/')}
          className="py-3 px-6 bg-[#2a2a3e] border border-[#00d4ff] rounded-lg text-[#00d4ff] hover:bg-[#1a1a2e] transition-all duration-300"
        >
          返回主菜单
        </button>
      </motion.div>

      {/* 背景效果 */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00d4ff] rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default CharacterManagement;
