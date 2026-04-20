import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-4">
      {/* 游戏标题 */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h1 className="text-6xl font-bold text-[#00d4ff] mb-4 tracking-wider">
          MECH DUNGEON
        </h1>
        <p className="text-xl text-gray-300">
          2.5D机甲地牢探索游戏
        </p>
      </motion.div>

      {/* 菜单按钮 */}
      <div className="space-y-6 w-full max-w-md">
        {[
          { label: '开始游戏', onClick: () => navigate('/dungeon') },
          { label: '角色创建', onClick: () => navigate('/character-creation') },
          { label: '多人游戏', onClick: () => navigate('/multiplayer') },
          { label: '角色管理', onClick: () => navigate('/character') },
          { label: '设置', onClick: () => {} }
        ].map((item, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={item.onClick}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#2a2a3e] to-[#1a1a2e] border border-[#00d4ff] rounded-lg text-[#00d4ff] text-xl font-medium hover:bg-[#2a2a3e] hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all duration-300 flex items-center justify-center"
          >
            {item.label}
          </motion.button>
        ))}
      </div>

      {/* 背景效果 */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00d4ff] rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff] rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default MainMenu;
