import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const DungeonExploration: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentPlayer, 
    currentDungeon, 
    startDungeon, 
    movePlayer, 
    attackEnemy, 
    collectItem, 
    activateExtraction, 
    completeExtraction, 
    failExtraction,
    gameStatus,
    timeRemaining
  } = useGameStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化Three.js场景
  useEffect(() => {
    if (!canvasRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1a1a2e');

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(20, 20, 20);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // 创建地牢网格
    const gridHelper = new THREE.GridHelper(50, 50, 0x2a2a3e, 0x1a1a2e);
    scene.add(gridHelper);

    // 创建玩家
    const playerGeometry = new THREE.BoxGeometry(2, 2, 2);
    const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00d4ff });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, 1, 0);
    scene.add(player);

    // 创建敌人
    const enemyGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const enemyMaterial = new THREE.MeshPhongMaterial({ color: 0xff4444 });
    
    if (currentDungeon) {
      currentDungeon.rooms.forEach(room => {
        room.enemies.forEach(enemy => {
          const enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
          enemyMesh.position.set(enemy.position.x, 0.75, enemy.position.z);
          scene.add(enemyMesh);
        });

        // 创建物品
        const itemGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const itemMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        
        room.items.forEach(item => {
          const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
          itemMesh.position.set(item.position?.x || 0, 0.5, item.position?.z || 0);
          scene.add(itemMesh);
        });

        // 创建撤离点
        if (room.extractionPoint) {
          const extractionGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 32);
          const extractionMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
          const extractionPoint = new THREE.Mesh(extractionGeometry, extractionMaterial);
          extractionPoint.position.set(room.extractionPoint.position.x, 0.25, room.extractionPoint.position.z);
          scene.add(extractionPoint);
        }
      });
    }

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 窗口大小调整
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [currentDungeon]);

  // 开始游戏
  useEffect(() => {
    if (!currentPlayer) {
      navigate('/character-creation');
      return;
    }

    if (!currentDungeon) {
      startDungeon('dungeon1');
    }

    setIsLoading(false);
  }, [currentPlayer, currentDungeon, startDungeon, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-[#00d4ff] text-2xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#1a1a2e]">
      {/* Three.js 渲染画布 */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 游戏UI */}
      <div className="relative z-10 p-4">
        {/* 顶部状态栏 */}
        <div className="flex justify-between items-center mb-4">
          <div className="bg-[#2a2a3e] border border-[#00d4ff] rounded-lg p-3">
            <h2 className="text-[#00d4ff] font-medium">{currentPlayer?.name}</h2>
            <div className="flex space-x-4 mt-2">
              <div>
                <span className="text-gray-400">生命值:</span>
                <span className="text-[#00d4ff] ml-2">{currentPlayer?.health}</span>
              </div>
              <div>
                <span className="text-gray-400">能量:</span>
                <span className="text-[#00d4ff] ml-2">{currentPlayer?.energy}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2a3e] border border-[#00d4ff] rounded-lg p-3">
            <div className="text-gray-400">时间剩余</div>
            <div className="text-[#00d4ff] text-xl font-bold">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#2a2a3e] border border-[#00d4ff] rounded-lg p-4 flex space-x-4">
          <button
            onClick={() => movePlayer({ x: 0, y: 0, z: 0 })}
            className="px-4 py-2 bg-[#00d4ff] text-[#1a1a2e] font-medium rounded-lg hover:shadow-[0_0_10px_rgba(0,212,255,0.5)] transition-all duration-300"
          >
            移动
          </button>
          <button
            onClick={() => attackEnemy('enemy1')}
            className="px-4 py-2 bg-[#ff4444] text-white font-medium rounded-lg hover:shadow-[0_0_10px_rgba(255,68,68,0.5)] transition-all duration-300"
          >
            攻击
          </button>
          <button
            onClick={() => collectItem('item1')}
            className="px-4 py-2 bg-[#ffff00] text-[#1a1a2e] font-medium rounded-lg hover:shadow-[0_0_10px_rgba(255,255,0,0.5)] transition-all duration-300"
          >
            收集
          </button>
          <button
            onClick={activateExtraction}
            className="px-4 py-2 bg-[#00ff00] text-[#1a1a2e] font-medium rounded-lg hover:shadow-[0_0_10px_rgba(0,255,0,0.5)] transition-all duration-300"
          >
            激活撤离
          </button>
        </div>

        {/* 游戏状态提示 */}
        {gameStatus === 'extracting' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2a2a3e] border border-[#00ff00] rounded-lg p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-[#00ff00] mb-2">撤离激活</h2>
            <p className="text-gray-300">抵御敌人进攻，等待撤离完成</p>
          </motion.div>
        )}

        {gameStatus === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2a2a3e] border border-[#00ff00] rounded-lg p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-[#00ff00] mb-2">撤离成功</h2>
            <p className="text-gray-300 mb-4">你成功撤离了地牢，保留了所有物品</p>
            <button
              onClick={() => navigate('/character')}
              className="px-4 py-2 bg-[#00d4ff] text-[#1a1a2e] font-medium rounded-lg hover:shadow-[0_0_10px_rgba(0,212,255,0.5)] transition-all duration-300"
            >
              查看角色
            </button>
          </motion.div>
        )}

        {gameStatus === 'failed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2a2a3e] border border-[#ff4444] rounded-lg p-6 text-center"
          >
            <h2 className="text-2xl font-bold text-[#ff4444] mb-2">撤离失败</h2>
            <p className="text-gray-300 mb-4">你未能及时撤离，失去了部分物品</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-[#00d4ff] text-[#1a1a2e] font-medium rounded-lg hover:shadow-[0_0_10px_rgba(0,212,255,0.5)] transition-all duration-300"
            >
              返回主菜单
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DungeonExploration;
