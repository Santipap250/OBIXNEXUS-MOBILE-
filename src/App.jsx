import React, { lazy, Suspense, useState } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";

import { BottomNav } from "./components/ui.jsx";
import { usePersistentState } from "./lib/usePersistentState.js";
import { STORAGE_KEYS, resetAllLocalData } from "./lib/storage.js";
import { defaultDrones, defaultProfile } from "./data/seed.js";
import { useDroneFleet } from "./features/fleet/storage/useDroneFleet.js";
import { loadDrones } from "./features/fleet/storage/droneStorage.js";
import { attachBlackboxResult } from "./features/fleet/services/fleetService.js";

import ToolLoadingFallback from "./features/tools/components/ToolLoadingFallback.jsx";

const Splash = lazy(() => import("./pages/Splash.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Fleet = lazy(() => import("./pages/Fleet.jsx"));
const DroneDetail = lazy(() => import("./pages/DroneDetail.jsx"));
const DigitalTwin = lazy(() => import("./pages/DigitalTwin.jsx"));
const Tools = lazy(() => import("./pages/Tools.jsx"));
const AIAssistant = lazy(() => import("./pages/AIAssistant.jsx"));
const Community = lazy(() => import("./pages/Community.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));

function DroneDetailRoute({ drones, onBack }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const drone = drones.find((d) => d.id === id);
  if (!drone) return <div className="p-6 text-white/40 text-sm">ไม่พบโดรนนี้</div>;
  return <DroneDetail drone={drone} onBack={onBack} goTwin={(d) => navigate(`/app/fleet/${d.id}/digital-twin`)} />;
}

function DigitalTwinRoute({ drones, onBack }) {
  const { id } = useParams();
  const drone = drones.find((d) => d.id === id);
  if (!drone) return <div className="p-6 text-white/40 text-sm">ไม่พบโดรนนี้</div>;
  return <DigitalTwin drone={drone} onBack={onBack} />;
}

function AppShell({ drones, setDrones, profile, setProfile, lang, setLang, favorites, toggleFavorite, onReset }) {
  const navigate = useNavigate();

  return (
    <div className="obix-screen-scroll" style={{ WebkitOverflowScrolling: "touch" }}>
      <Suspense fallback={<ToolLoadingFallback label="กำลังโหลดหน้าจอ..." />}>
        <Routes>
          <Route path="home" element={<Home drones={drones} profile={profile} go={(s) => navigate(`/app/${s}`)} openDrone={(d) => navigate(`/app/fleet/${d.id}`)} />} />
        <Route path="fleet" element={<Fleet drones={drones} setDrones={setDrones} openDrone={(d) => navigate(`/app/fleet/${d.id}`)} />} />
        <Route path="fleet/:id" element={<DroneDetailRoute drones={drones} onBack={() => navigate("/app/fleet")} />} />
        <Route path="fleet/:id/digital-twin" element={<DigitalTwinRoute drones={drones} onBack={() => navigate(-1)} />} />
        <Route path="tools" element={<Tools favorites={favorites} toggleFavorite={toggleFavorite} drones={drones} onAttachBlackbox={(droneId, result, meta) => setDrones((prev) => attachBlackboxResult(prev, droneId, result, meta))} />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="community" element={<Community />} />
        <Route
          path="settings"
          element={
            <Settings
              profile={profile}
              lang={lang}
              setLang={setLang}
              onEditProfile={() => navigate("/app/profile")}
              onResetData={onReset}
            />
          }
        />
        <Route path="profile" element={<Profile profile={profile} setProfile={setProfile} onBack={() => navigate("/app/settings")} />} />
          <Route path="*" element={<Navigate to="/app/home" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function ObixNexus() {
  const [splashDone, setSplashDone] = useState(false);
  const [drones, setDrones] = useDroneFleet(defaultDrones);
  const [profile, setProfile] = usePersistentState(STORAGE_KEYS.profile, defaultProfile);
  const [lang, setLang] = usePersistentState(STORAGE_KEYS.lang, "th");
  const [favorites, setFavorites] = usePersistentState(STORAGE_KEYS.favoriteTools, []);

  const navigate = useNavigate();
  const location = useLocation();
  const inApp = location.pathname.startsWith("/app");

  function toggleFavorite(id) {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  function handleReset() {
    resetAllLocalData();
    // Nothing is persisted anymore — loadDrones falls back to the seed
    // fleet, normalized and tagged as seeded demo data.
    setDrones(loadDrones(defaultDrones));
    setProfile(defaultProfile);
    setLang("th");
    setFavorites([]);
    navigate("/app/home");
  }

  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-[#030811] md:items-center" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="obix-app-frame">
        <Suspense fallback={<ToolLoadingFallback label="กำลังเปิด OBIX NEXUS..." />}>
          <Routes>
          {/* No login/register/forgot-password gate — Phase 2 is free and public.
              Splash goes straight into the app. */}
          <Route
            path="/"
            element={
              splashDone ? (
                <Navigate to="/app/home" replace />
              ) : (
                <Splash onDone={() => { setSplashDone(true); navigate("/app/home"); }} />
              )
            }
          />
          <Route
            path="/app/*"
            element={
              <AppShell
                drones={drones}
                setDrones={setDrones}
                profile={profile}
                setProfile={setProfile}
                lang={lang}
                setLang={setLang}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onReset={handleReset}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        {inApp && (
          <BottomNav
            screen={location.pathname.split("/")[2] || "home"}
            go={(s) => navigate(`/app/${s}`)}
          />
        )}
      </div>
    </div>
  );
}
