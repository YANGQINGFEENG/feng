import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const CharacterCreation: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { createCharacter } = useGameStore();

  const handleCreateCharacter = () => {
    if (name.trim()) {
      createCharacter(name.trim());
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-4">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-[#00d4ff] mb-4">
          角色创建
        </h1>
        <p className="text-xl text-gray-300">
          定制你的机甲战士
        </p>
      </motion.div>

      {/* 角色创建表单 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#2a2a3e] border border-[#00d4ff] rounded-lg p-8 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
      >
        {/* 姓名输入 */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 text-lg">
            战士姓名
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的战士姓名"
            className="w-full px-4 py-3 bg-[#1a1a2e] border border-[#00d4ff] rounded-lg text-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]"
          />
        </div>

        {/* 初始技能预览 */}
        <div className="mb-6">
          <h3 className="text-gray-300 mb-3 text-lg">初始技能</h3>
          <div className="space-y-3">
            {[
              { name: 'Assault Rifle Mastery', description: 'Increases assault rifle damage by 10%' },
              { name: 'Shield Enhancement', description: 'Increases shield capacity by 15%' },
              { name: 'Stealth Training', description: 'Reduces enemy detection range by 20%' }
            ].map((skill, index) => (
              <div key={index} className="p-3 bg-[#1a1a2e] border border-[#00d4ff]/50 rounded-lg">
                <h4 className="text-[#00d4ff] font-medium">{skill.name}</h4>
                <p className="text-gray-400 text-sm">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 初始装备预览 */}
        <div className="mb-8">
          <h3 className="text-gray-300 mb-3 text-lg">初始装备</h3>
          <div className="space-y-3">
            {[
              { name: 'Basic Assault Rifle', type: 'weapon', stats: 'Damage: 10, Accuracy: 80' },
              { name: 'Standard Shield', type: 'armor', stats: 'Defense: 5' }
            ].map((equipment, index) => (
              <div key={index} className="p-3 bg-[#1a1a2e] border border-[#00d4ff]/50 rounded-lg">
                <h4 className="text-[#00d4ff] font-medium">{equipment.name}</h4>
                <p className="text-gray-400 text-sm">{equipment.type} • {equipment.stats}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 px-4 bg-[#1a1a2e] border border-gray-600 rounded-lg text-gray-400 hover:bg-[#2a2a3e] transition-all duration-300"
          >
            取消
          </button>
          <button
            onClick={handleCreateCharacter}
            disabled={!name.trim()}
            className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${name.trim() ? 'bg-[#00d4ff] text-[#1a1a2e] font-medium hover:shadow-[0_0_15px_rgba(0,212,255,0.5)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
          >
            创建角色
          </button>
        </div>
      </motion.div>

      {/* 背景效果 */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00d4ff] rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default CharacterCreation;
