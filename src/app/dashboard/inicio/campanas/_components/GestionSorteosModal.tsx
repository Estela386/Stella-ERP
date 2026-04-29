"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Download, RefreshCw, AlertCircle, Maximize2, Minimize2, Sparkles, Users, Video } from "lucide-react";
import { ISorteoParticipante, ISorteo } from "@lib/models/Sorteo";

interface Props { bannerId?: number; sorteoId?: number; onClose: () => void; }

// ── Confetti ──
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ["#b76e79","#f0c5cb","#708090","#e8d5b7","#d4a4b0","#9bb5c0"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {Array.from({length: 60}, (_, i) => (
        <motion.div key={i}
          className="absolute w-2 h-3 rounded-sm top-0"
          style={{ left: `${Math.random()*100}%`, backgroundColor: colors[i%colors.length] }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: "100vh", rotate: 720, opacity: 0 }}
          transition={{ duration: 2+Math.random()*1.5, delay: Math.random()*0.8, ease:"easeIn" }}
        />
      ))}
    </div>
  );
}

// ── Rolling name slot machine ──
function RollingName({ names, rolling }: { names: string[]; rolling: boolean }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!rolling || names.length === 0) return;
    const iv = setInterval(() => setIdx(Math.floor(Math.random()*names.length)), 80);
    return () => clearInterval(iv);
  }, [rolling, names]);
  if (!names.length) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.span key={idx}
        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.05 }} className="block truncate max-w-[220px]">
        {names[idx]}
      </motion.span>
    </AnimatePresence>
  );
}

// ── Canvas video recorder for Instagram Story ──
async function recordStoryVideo(
  participantes: ISorteoParticipante[],
  ganador: ISorteoParticipante,
  durationMs = 8000
): Promise<Blob> {
  const W = 1080, H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const stream = canvas.captureStream(30);
  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

  const nombres = participantes.map(p => p.nombre);
  const startTime = performance.now();
  const rollDuration = durationMs * 0.65;

  function drawFrame(now: number) {
    const elapsed = now - startTime;
    const isRolling = elapsed < rollDuration;
    const progress = Math.min(elapsed / durationMs, 1);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#f6f4ef"); bg.addColorStop(1, "#faf8f3");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Decorative stars
    ctx.fillStyle = "rgba(183,110,121,0.12)";
    for (let i = 0; i < 30; i++) {
      const sx = ((i * 317) % W), sy = ((i * 193) % H);
      const sz = 8 + (i % 5) * 8;
      const rot = (elapsed / 4000 + i) % (Math.PI * 2);
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(rot);
      ctx.beginPath();
      for (let p = 0; p < 4; p++) {
        const a = (p/4)*Math.PI*2; const b = a+Math.PI/4;
        if (p===0) ctx.moveTo(Math.cos(a)*sz, Math.sin(a)*sz);
        else ctx.lineTo(Math.cos(a)*sz, Math.sin(a)*sz);
        ctx.lineTo(Math.cos(b)*(sz*0.4), Math.sin(b)*(sz*0.4));
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    // Logo / brand header
    ctx.fillStyle = "#b76e79";
    ctx.font = `bold 52px serif`; ctx.textAlign = "center";
    ctx.fillText("✦ STELLA JOYERÍA ✦", W/2, 200);
    ctx.font = `36px sans-serif`; ctx.fillStyle = "#708090";
    ctx.fillText("Sorteo en Vivo", W/2, 260);

    // Divider
    ctx.strokeStyle = "rgba(183,110,121,0.3)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(100, 300); ctx.lineTo(W-100, 300); ctx.stroke();

    // Center circle
    const cx = W/2, cy = H/2 - 80;
    const ringProgress = isRolling ? 1 : progress;
    ctx.save();
    // Glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220);
    grd.addColorStop(0, "rgba(183,110,121,0.3)"); grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd; ctx.fillRect(cx-220, cy-220, 440, 440);
    // Circle border
    ctx.beginPath(); ctx.arc(cx, cy, 200, 0, Math.PI*2);
    ctx.strokeStyle = isRolling ? "#b76e79" : "#b76e79";
    ctx.lineWidth = 6;
    if (isRolling) { ctx.setLineDash([20, 10]); ctx.lineDashOffset = -elapsed/50; }
    else ctx.setLineDash([]);
    ctx.stroke();
    // Circle fill
    ctx.beginPath(); ctx.arc(cx, cy, 196, 0, Math.PI*2);
    if (!isRolling && elapsed > rollDuration + 400) {
      const gf = ctx.createLinearGradient(cx-196, cy-196, cx+196, cy+196);
      gf.addColorStop(0, "#b76e79"); gf.addColorStop(1, "#d48b96");
      ctx.fillStyle = gf;
    } else { ctx.fillStyle = "rgba(246,244,239,0.9)"; }
    ctx.fill(); ctx.restore();

    // Trophy icon (simplified)
    if (!isRolling && elapsed > rollDuration + 300) {
      ctx.fillStyle = "white"; ctx.font = "bold 120px serif"; ctx.textAlign = "center";
      ctx.fillText("🏆", cx, cy + 40);
    } else {
      ctx.fillStyle = isRolling ? "#b76e79" : "#708090";
      ctx.font = "bold 100px serif"; ctx.textAlign = "center";
      ctx.fillText("✦", cx, cy + 35);
    }

    // Rolling name
    ctx.textAlign = "center";
    if (isRolling) {
      const rIdx = Math.floor((elapsed/80)) % nombres.length;
      const rName = nombres[rIdx] || "...";
      ctx.fillStyle = "#b76e79"; ctx.font = `bold 70px serif`;
      ctx.fillText(rName.slice(0, 18), W/2, cy + 310);
      ctx.fillStyle = "#708090"; ctx.font = `40px sans-serif`;
      ctx.fillText("Seleccionando...", W/2, cy + 380);
    } else if (elapsed > rollDuration + 400) {
      // Winner reveal — NO phone, NO email
      ctx.fillStyle = "#2d3748"; ctx.font = `bold 72px serif`;
      ctx.fillText(ganador.nombre, W/2, cy + 310);
      ctx.fillStyle = "#b76e79"; ctx.font = `bold 44px sans-serif`;
      ctx.fillText("¡GANADORA! 🎉", W/2, cy + 390);
    }

    // Bottom label
    ctx.fillStyle = "#708090"; ctx.font = `32px sans-serif`; ctx.textAlign = "center";
    ctx.fillText("@stellajoyeriar", W/2, H - 120);

    if (progress < 1) requestAnimationFrame(t => drawFrame(t));
  }

  return new Promise((resolve) => {
    recorder.start(100);
    requestAnimationFrame(t => drawFrame(t));
    setTimeout(() => {
      recorder.stop();
      recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
    }, durationMs + 200);
  });
}

export default function GestionSorteosModal({ bannerId, sorteoId: initialSorteoId, onClose }: Props) {
  const [sorteo, setSorteo] = useState<ISorteo | null>(null);
  const [participantes, setParticipantes] = useState<ISorteoParticipante[]>([]);
  const [loading, setLoading] = useState(true);
  const [ganador, setGanador] = useState<ISorteoParticipante | null>(null);
  const [rolling, setRolling] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);

  useEffect(() => { inicializar(); }, [bannerId, initialSorteoId]);

  const inicializar = async () => {
    setLoading(true); setError(null);
    try {
      let id = initialSorteoId;
      if (!id && bannerId) {
        const r = await fetch(`/api/sorteo/banner/${bannerId}`);
        const d = await r.json();
        if (d.sorteo) { setSorteo(d.sorteo); id = d.sorteo.id; }
        else { setError("No se encontró un sorteo vinculado."); setLoading(false); return; }
      }
      if (id) {
        const r2 = await fetch(`/api/sorteo/${id}/participantes`);
        const d2 = await r2.json();
        setParticipantes(d2.participantes || []);
      }
    } catch { setError("Error al conectar."); }
    finally { setLoading(false); }
  };

  const elegirGanador = async () => {
    const id = sorteo?.id || initialSorteoId;
    if (!id || participantes.length === 0) return;
    setRolling(true); setShowWinner(false); setGanador(null); setConfetti(false);
    await new Promise(r => setTimeout(r, 2200));
    setRolling(false);
    try {
      const res = await fetch(`/api/sorteo/${id}/winner`, { method:"POST", headers:{"Content-Type":"application/json"} });
      const data = await res.json();
      if (data.ganador) {
        setGanador(data.ganador);
        setTimeout(() => { setShowWinner(true); setConfetti(true); setTimeout(() => setConfetti(false), 3500); }, 500);
      }
    } catch(e) { console.error(e); }
  };

  const descargarVideo = async () => {
    if (!ganador || participantes.length === 0) return;
    setRecordingVideo(true);
    try {
      const blob = await recordStoryVideo(participantes, ganador, 9000);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "stella-sorteo-story.webm"; a.click();
      URL.revokeObjectURL(url);
    } catch(e) { console.error(e); }
    finally { setRecordingVideo(false); }
  };

  const nombres = participantes.map(p => p.nombre);

  return (
    <>
      <Confetti active={confetti} />
      <div className={`fixed inset-0 z-[100] flex items-center justify-center ${!fullscreen && "p-4"}`}>
        {/* Overlay */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          onClick={onClose}
          className="absolute inset-0 bg-[#2d3748]/50 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div
          initial={{scale:0.92, opacity:0, y:24}}
          animate={{scale:1, opacity:1, y:0}}
          exit={{scale:0.92, opacity:0, y:24}}
          transition={{type:"spring", damping:24, stiffness:300}}
          className={`relative flex flex-col bg-[#f6f4ef] overflow-hidden shadow-[0_32px_80px_rgba(45,55,72,0.25)] border border-[#b76e79]/15 transition-all duration-300 ${
            fullscreen ? "w-full h-full rounded-none" : "w-full max-w-5xl rounded-[2.5rem] max-h-[90vh]"
          }`}
        >
          {/* Estrellas fondo */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            {[...Array(16)].map((_,i) => (
              <motion.div key={i} className="absolute text-[#b76e79]"
                style={{ top:`${(i*61)%100}%`, left:`${(i*79)%100}%`, fontSize: `${8+i%4*6}px` }}
                animate={{ rotate:360 }} transition={{ duration:6+i*2, repeat:Infinity, ease:"linear" }}
              >✦</motion.div>
            ))}
          </div>

          {/* ── HEADER ── */}
          <div className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#b76e79]/12 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <motion.div animate={{rotate:[0,8,-8,0]}} transition={{duration:2.5, repeat:Infinity}}
                className="w-11 h-11 bg-[#b76e79] rounded-2xl flex items-center justify-center shadow-lg shadow-[#b76e79]/30">
                <Trophy size={20} className="text-white" fill="white"/>
              </motion.div>
              <div>
                <h3 className="text-[#2d3748] font-bold text-lg" style={{fontFamily:"var(--font-marcellus),serif"}}>
                  Sorteo en Vivo
                </h3>
                <p className="text-[#708090] text-xs">
                  {sorteo?.nombre || `ID #${initialSorteoId}`}
                  {participantes.length > 0 && <span className="ml-2 text-[#b76e79] font-bold">· {participantes.length} participantes</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFullscreen(f=>!f)}
                className="w-9 h-9 bg-[#708090]/10 hover:bg-[#708090]/20 rounded-xl flex items-center justify-center text-[#708090] hover:text-[#2d3748] transition-all"
                title={fullscreen ? "Salir" : "Pantalla completa"}>
                {fullscreen ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
              </button>
              <button onClick={onClose}
                className="w-9 h-9 bg-[#b76e79]/10 hover:bg-[#b76e79]/20 rounded-xl flex items-center justify-center text-[#b76e79] transition-all">
                <X size={16}/>
              </button>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="relative z-10 flex-1 overflow-y-auto">
            {error ? (
              <div className="py-24 text-center space-y-4">
                <AlertCircle size={48} className="mx-auto text-red-400"/>
                <p className="text-[#708090]">{error}</p>
              </div>
            ) : (
              <div className={`grid h-full ${fullscreen ? "grid-cols-[1fr_360px]" : "grid-cols-1 lg:grid-cols-[1fr_340px]"}`}>

                {/* Lista de participantes */}
                <div className="p-8 border-r border-[#b76e79]/10 overflow-y-auto">
                  <div className="flex justify-between items-center mb-5">
                    <h4 className="text-[#708090] text-xs font-bold uppercase tracking-widest">
                      Lista de Inscritos
                    </h4>
                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-[#b76e79] hover:text-[#a45f69] transition-colors uppercase tracking-widest">
                      <Download size={12}/> Exportar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {loading ? (
                      [...Array(5)].map((_,i) => (
                        <div key={i} className="h-14 rounded-2xl bg-[#708090]/8 animate-pulse"/>
                      ))
                    ) : participantes.length === 0 ? (
                      <div className="py-20 text-center text-[#708090] italic">
                        <Users size={40} className="mx-auto mb-3 opacity-30"/>
                        No hay participantes registrados.
                      </div>
                    ) : participantes.map((p, i) => (
                      <motion.div key={p.id}
                        initial={{opacity:0, x:-16}} animate={{opacity:1, x:0}}
                        transition={{delay: i*0.025}}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all ${
                          ganador?.id === p.id
                            ? "bg-[#b76e79]/10 border-[#b76e79]/40 shadow-md shadow-[#b76e79]/10"
                            : "bg-white/50 border-[#b76e79]/8 hover:bg-white/80"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#b76e79]/15 flex items-center justify-center text-[10px] font-black text-[#b76e79] shrink-0">
                          {i+1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${ganador?.id===p.id ? "text-[#b76e79]" : "text-[#2d3748]"}`}>
                            {p.nombre}
                          </p>
                          <p className="text-[10px] text-[#708090] truncate">{p.correo}</p>
                        </div>
                        {p.preferencia && (
                          <span className="text-[9px] font-bold uppercase tracking-widest bg-[#708090]/10 text-[#708090] px-2 py-1 rounded-full shrink-0">
                            {p.preferencia}
                          </span>
                        )}
                        {ganador?.id===p.id && (
                          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring"}}>
                            <Trophy size={16} className="text-[#b76e79]" fill="#b76e79"/>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Sidebar: ruleta + resultado */}
                <div className="p-8 bg-white/30 flex flex-col items-center justify-between gap-6">

                  {/* Círculo animado */}
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
                    <div className="relative">
                      <AnimatePresence>
                        {(rolling||showWinner) && (
                          <motion.div key="glow"
                            initial={{opacity:0, scale:0.8}} animate={{scale:[1,1.15,1], opacity:[0.4,0.7,0.4]}}
                            exit={{opacity:0}} transition={{duration:1.5, repeat:Infinity}}
                            className="absolute inset-0 rounded-full bg-[#b76e79]/25 blur-xl"
                          />
                        )}
                      </AnimatePresence>

                      <motion.div
                        animate={rolling ? {rotate:360} : {}}
                        transition={{duration:0.5, repeat:Infinity, ease:"linear"}}
                        className={`w-36 h-36 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-500 ${
                          showWinner
                            ? "border-[#b76e79] bg-gradient-to-br from-[#b76e79] to-[#d48b96]"
                            : rolling
                            ? "border-[#b76e79]/60 bg-white border-dashed"
                            : "border-[#b76e79]/20 bg-white"
                        }`}
                      >
                        {showWinner ? (
                          <motion.div initial={{scale:0, rotate:-180}} animate={{scale:1, rotate:0}}
                            transition={{type:"spring", damping:10, stiffness:200}}>
                            <Trophy size={52} className="text-white" fill="white"/>
                          </motion.div>
                        ) : rolling ? (
                          <RefreshCw size={40} className="text-[#b76e79]"/>
                        ) : (
                          <Trophy size={40} className="text-[#b76e79]/30"/>
                        )}
                      </motion.div>
                    </div>

                    {/* Nombre */}
                    <div className="text-center min-h-[90px] flex flex-col justify-center gap-2 w-full">
                      {rolling ? (
                        <div className="text-[#b76e79] font-black text-xl overflow-hidden h-8 text-center"
                          style={{fontFamily:"var(--font-marcellus),serif"}}>
                          <RollingName names={nombres} rolling={rolling}/>
                        </div>
                      ) : showWinner && ganador ? (
                        <motion.div initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} className="space-y-1.5">
                          <div className="flex items-center justify-center gap-2">
                            <Sparkles size={13} className="text-[#b76e79]"/>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#b76e79]">¡Ganadora!</span>
                            <Sparkles size={13} className="text-[#b76e79]"/>
                          </div>
                          <p className="text-[#2d3748] font-black text-2xl" style={{fontFamily:"var(--font-marcellus),serif"}}>
                            {ganador.nombre}
                          </p>
                          <p className="text-[#708090] text-xs">{ganador.correo}</p>
                        </motion.div>
                      ) : (
                        <p className="text-[#708090]/40 text-sm italic">
                          {participantes.length===0 ? "Sin participantes" : "Presiona para sortear"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botón sortear */}
                  <div className="w-full space-y-3">
                    <motion.button
                      disabled={rolling||participantes.length===0}
                      onClick={elegirGanador}
                      whileHover={{scale: rolling||participantes.length===0 ? 1 : 1.03}}
                      whileTap={{scale: rolling||participantes.length===0 ? 1 : 0.97}}
                      className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg ${
                        rolling||participantes.length===0
                          ? "bg-[#708090]/20 text-[#708090]/40 cursor-not-allowed"
                          : "bg-[#b76e79] text-white shadow-[#b76e79]/30 hover:bg-[#a45f69] hover:shadow-[#b76e79]/50"
                      }`}
                    >
                      {rolling ? <><RefreshCw size={16} className="animate-spin"/> Sorteando...</>
                        : ganador ? <><RefreshCw size={16}/> Sortear de nuevo</>
                        : <><Trophy size={16} fill="white"/> Realizar Sorteo</>}
                    </motion.button>

                    {/* Botón descargar video historia */}
                    {ganador && !rolling && (
                      <motion.button
                        initial={{opacity:0, y:8}} animate={{opacity:1, y:0}}
                        disabled={recordingVideo}
                        onClick={descargarVideo}
                        className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-2 transition-all ${
                          recordingVideo
                            ? "border-[#708090]/20 text-[#708090]/40 cursor-not-allowed bg-transparent"
                            : "border-[#b76e79]/30 text-[#b76e79] hover:bg-[#b76e79]/8 bg-transparent"
                        }`}
                      >
                        {recordingVideo
                          ? <><Video size={14} className="animate-pulse"/> Generando video...</>
                          : <><Video size={14}/> Descargar Historia de Instagram</>}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
