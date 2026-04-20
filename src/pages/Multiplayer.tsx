import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Multiplayer: React.FC = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState('');

  const handleCreateRoom = () => {
    // 生成随机房间ID
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCreatedRoomId(newRoomId);
    setIsCreatingRoom(true);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      // 这里应该实现加入房间的逻辑
      navigate('/dungeon');
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
          多人游戏
        </h1>
        <p className="text-xl text-gray-300">
          局域网连接
        </p>
      </motion.div>

      {/* 多人游戏选项 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#2a2a3e] border border-[#00d4ff] rounded-lg p-8 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
      >
        {!isCreatingRoom ? (
          <>
            {/* 创建房间 */}
            <div className="mb-6">
              <button
                onClick={handleCreateRoom}
                className="w-full py-4 px-6 bg-[#00d4ff] text-[#1a1a2e] font-medium rounded-lg hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all duration-300"
              >
                创建游戏房间
              </button>
            </div>

            {/* 加入房间 */}
            <div>
              <h3 className="text-gray-300 mb-3 text-lg">加入房间</h3>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="输入房间ID"
                className="w-full px-4 py-3 bg-[#1a1a2e] border border-[#00d4ff] rounded-lg text-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff] mb-4"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!roomId.trim()}
                className={`w-full py-3 px-4 rounded-lg transition-all duration-300 ${roomId.trim() ? 'bg-[#00d4ff] text-[#1a1a2e] font-medium hover:shadow-[0_0_15px_rgba(0,212,255,0.5)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                加入房间
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-[#00d4ff] text-xl font-medium mb-4">房间创建成功</h3>
            <div className="bg-[#1a1a2e] border border-[#00d4ff] rounded-lg p-4 mb-6">
              <p className="text-gray-300 mb-2">房间ID</p>
              <p className="text-3xl font-bold text-[#00d4ff]">{createdRoomId}</p>
            </div>
            <p className="text-gray-400 mb-6">请让其他玩家输入此ID加入房间</p>
            <button
              onClick={() => navigate('/dungeon')}
              className="w-full py-3 px-4 bg-[#00d4ff] text-[#1a1a2e] font-medium rounded-lg hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all duration-300"
            >
              进入地牢
            </button>
          </div>
        )}

        {/* 返回按钮 */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-[#1a1a2e] border border-gray-600 rounded-lg text-gray-400 hover:bg-[#2a2a3e] transition-all duration-300"
          >
            返回主菜单
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

export default Multiplayer;
