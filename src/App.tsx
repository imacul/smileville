import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, useProgress } from '@react-three/drei';
import { FiCheck, FiInfo, FiMoon, FiSun, FiUser, FiX } from 'react-icons/fi';
import { DentalModel } from './components/DentalModel';
import * as THREE from 'three';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem('smileville-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function LoadingOverlay({ isDark }: { isDark: boolean }) {
  const { active, progress, loaded, total } = useProgress();

  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div
        className={`w-[min(340px,85vw)] rounded-xl border p-4 shadow-xl backdrop-blur-md ${
          isDark ? 'bg-slate-950/84 border-slate-700/70' : 'bg-white/86 border-slate-300/70'
        }`}
      >
        <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Loading 3D model...</p>
        <div className={`mt-3 h-2 w-full overflow-hidden rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div
            className={`h-full rounded-full transition-all duration-300 ${isDark ? 'bg-teal-400' : 'bg-teal-600'}`}
            style={{ width: `${Math.min(100, Math.max(2, progress))}%` }}
          />
        </div>
        <p className={`mt-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {Math.round(progress)}% ({loaded}/{total})
        </p>
      </div>
    </div>
  );
}

function App() {
  const [isPatientInfoOpen, setIsPatientInfoOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [isApproved, setIsApproved] = useState(false);
  const [isApproveAnimating, setIsApproveAnimating] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    window.localStorage.setItem('smileville-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!isApproveAnimating) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsApproveAnimating(false);
    }, 480);

    return () => window.clearTimeout(timeoutId);
  }, [isApproveAnimating]);

  const handleApprove = () => {
    setIsApproved(true);
    setIsApproveAnimating(true);
  };

  const handleRequestChanges = () => {
    setIsApproved(false);
  };

  const PatientInfoCard = () => (
    <div
      className={`rounded-xl p-5 backdrop-blur-md border shadow-lg ${
        isDark
          ? 'bg-slate-900/78 border-slate-700/70 shadow-black/40'
          : 'bg-white/76 border-slate-300/55 shadow-slate-600/10'
      }`}
    >
      <div className="space-y-3">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Patient</p>
          <p className={`text-lg font-medium ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>John Doe</p>
        </div>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Clinic</p>
          <p className={`text-base ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Zoom Exclusive Dental</p>
        </div>
        <div className={`pt-2 border-t flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-gray-200/50'}`}>
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Order #4421</span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isDark ? 'bg-blue-500/25 text-blue-200' : 'bg-blue-100 text-blue-700'
            }`}
          >
            Upper Arch
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans ${isDark ? 'bg-slate-950' : 'bg-slate-200'}`}>
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 5, 10], fov: 45 }}
          className="w-full h-full"
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.7;
          }}
        >
          <color attach="background" args={['#0f1a27']} />
          <ambientLight intensity={0.14} />
          <hemisphereLight args={['#8ea0b6', '#182434', 0.28]} />
          <directionalLight
            position={[7, 10, 2]}
            intensity={1.05}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0003}
          />
          <directionalLight position={[-6, 4, -5]} intensity={0.35} color="#8fa6c2" />
          <directionalLight position={[0, 3, -8]} intensity={0.34} color="#738eaa" />
          <Suspense fallback={null}>
            <DentalModel />
          </Suspense>
          <Suspense fallback={null}>
            <Environment preset="night" blur={0.5} />
          </Suspense>
          <ContactShadows position={[0, -2.6, 0]} opacity={0.55} scale={17} blur={2.6} far={8} />
          <OrbitControls enableDamping={true} autoRotate={false} />
        </Canvas>
      </div>

      <LoadingOverlay isDark={isDark} />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_44%,rgba(2,8,18,0.62)_100%)]"
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
        {/* Top Navbar */}
        <header
          className={`pointer-events-auto backdrop-blur-md border-b shadow-sm px-6 py-4 flex justify-between items-center ${
            isDark ? 'bg-slate-950/80 border-slate-700/70' : 'bg-white/88 border-slate-300/60'
          }`}
        >
          <img src="/smileville-logo.svg" alt="SmileVille Ortho-Dental Limited" className="h-14 w-auto" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
              className={`pointer-events-auto cursor-pointer w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-amber-200 hover:bg-slate-700'
                  : 'bg-white/90 border-slate-300 text-slate-700 hover:bg-white'
              }`}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button
              type="button"
              aria-label={isPatientInfoOpen ? 'Hide patient info' : 'Show patient info'}
              aria-expanded={isPatientInfoOpen}
              aria-controls="patient-info-panel"
              onClick={() => setIsPatientInfoOpen((open) => !open)}
              className={`md:hidden cursor-pointer w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                  : 'bg-white/90 border-slate-300 text-gray-600 hover:bg-white'
              }`}
            >
              {isPatientInfoOpen ? <FiX size={18} /> : <FiInfo size={18} />}
            </button>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-gray-500'
              }`}
            >
              <FiUser size={20} />
            </div>
          </div>
        </header>

        {/* Mobile Info Panel: toggled by icon */}
        <div
          id="patient-info-panel"
          className={`pointer-events-auto absolute top-20 left-1/2 -translate-x-1/2 w-[90%] md:hidden transition-all duration-200 ${
            isPatientInfoOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <PatientInfoCard />
        </div>

        {/* Desktop Info Panel: always visible */}
        <div className="pointer-events-auto absolute top-20 right-6 w-80 hidden md:block">
          <PatientInfoCard />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 backdrop-blur-md border-t p-4 pb-6 md:pb-4 ${
          isDark ? 'bg-slate-950/80 border-slate-700/70' : 'bg-white/88 border-slate-300/60'
        }`}
      >
        <div className="flex gap-4 max-w-lg mx-auto md:max-w-none md:justify-end md:px-6">
          <button
            type="button"
            onClick={handleRequestChanges}
            className={`flex-1 md:flex-none md:w-48 py-3 px-4 border rounded-lg font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.99] ${
              isDark
                ? 'bg-slate-900 border-slate-600 text-slate-100 hover:bg-slate-800 hover:border-slate-500'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            Request Changes
          </button>
          <button
            type="button"
            onClick={handleApprove}
            aria-live="polite"
            className={`flex-1 md:flex-none md:w-48 py-3 px-4 text-white font-bold rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.99] ${
              isApproved
                ? isDark
                  ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-900/40'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/25'
                : isDark
                  ? 'bg-teal-500 hover:bg-teal-400 shadow-teal-900/30'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-teal-900/20'
            }`}
          >
            <span className={`inline-flex items-center justify-center gap-2 ${isApproveAnimating ? 'approve-pop' : ''}`}>
              {isApproved && <FiCheck className={isApproveAnimating ? 'approve-check' : ''} size={18} />}
              {isApproved ? 'Approved' : 'Approve Design'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
