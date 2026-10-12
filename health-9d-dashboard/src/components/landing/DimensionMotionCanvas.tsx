'use client';

import React, { useRef, useEffect } from 'react';
import { DimensionKey } from '@/types/health';

interface DimensionMotionCanvasProps {
  dimensionKey: DimensionKey;
  isPlaying?: boolean;
  className?: string;
}

export const DimensionMotionCanvas: React.FC<DimensionMotionCanvasProps> = ({
  dimensionKey,
  isPlaying = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particles for brain / neurons / nutrients
    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2.5 + 1.2,
      phase: Math.random() * Math.PI * 2
    }));

    // Neural nodes
    const neuralNodes = Array.from({ length: 18 }, (_, i) => ({
      x: width * 0.5 + Math.cos((i / 18) * Math.PI * 2) * (width * 0.28 + (i % 3) * 15),
      y: height * 0.46 + Math.sin((i / 18) * Math.PI * 2) * (height * 0.22 + (i % 2) * 12),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * Math.PI * 2
    }));

    const render = () => {
      if (!isPlaying) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      timeRef.current += 0.025;
      const t = timeRef.current;

      // 1. Clear with deep cinematic medical blue-black gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.45, 20,
        width * 0.5, height * 0.45, width * 0.75
      );
      bgGrad.addColorStop(0, '#0a1626');
      bgGrad.addColorStop(0.5, '#040b15');
      bgGrad.addColorStop(1, '#020509');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle medical scanner grid
      ctx.strokeStyle = 'rgba(0, 153, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Render specific thematic animation
      switch (dimensionKey) {
        /* ================= 1. VISION: EYE & CATARACT SCANNER ================= */
        case 'vision': {
          const cx = width * 0.5;
          const cy = height * 0.46;
          const r = Math.min(width, height) * 0.26;

          // Scanning sweep beam
          const sweepAngle = (t * 1.5) % (Math.PI * 2);
          const sweepGrad = ctx.createConicGradient(sweepAngle, cx, cy);
          sweepGrad.addColorStop(0, 'rgba(0, 140, 255, 0.28)');
          sweepGrad.addColorStop(0.18, 'rgba(0, 200, 255, 0.02)');
          sweepGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = sweepGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
          ctx.fill();

          // Outer reticle rings
          ctx.strokeStyle = 'rgba(0, 160, 255, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
          ctx.stroke();

          // Tick marks around eye perimeter
          const ticks = 48;
          for (let i = 0; i < ticks; i++) {
            const angle = (i / ticks) * Math.PI * 2;
            const innerR = r * 1.2;
            const outerR = i % 4 === 0 ? r * 1.28 : r * 1.23;
            ctx.strokeStyle = i % 4 === 0 ? 'rgba(0, 220, 255, 0.7)' : 'rgba(0, 140, 255, 0.25)';
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
            ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
            ctx.stroke();
          }

          // Iris shape (curved eyelids & circular iris)
          ctx.save();
          ctx.strokeStyle = 'rgba(0, 220, 255, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, r * 1.1, r * 0.75, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Dilating pupil with lens opacity simulation
          const pupilR = r * 0.45 + Math.sin(t * 2) * (r * 0.06);
          const pupilGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, pupilR);
          pupilGrad.addColorStop(0, 'rgba(255, 200, 100, 0.85)'); // Cataract lens reflection
          pupilGrad.addColorStop(0.4, 'rgba(0, 180, 255, 0.6)');
          pupilGrad.addColorStop(1, 'rgba(0, 40, 80, 0.9)');
          ctx.fillStyle = pupilGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, pupilR, 0, Math.PI * 2);
          ctx.fill();

          // Retinal vessel branches
          ctx.strokeStyle = 'rgba(255, 120, 80, 0.35)';
          ctx.lineWidth = 1;
          for (let b = 0; b < 6; b++) {
            const bAngle = (b / 6) * Math.PI * 2 + 0.3;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            const midX = cx + Math.cos(bAngle) * (r * 0.65) + Math.sin(t + b) * 8;
            const midY = cy + Math.sin(bAngle) * (r * 0.65) + Math.cos(t + b) * 8;
            ctx.lineTo(midX, midY);
            ctx.lineTo(cx + Math.cos(bAngle + 0.2) * (r * 0.9), cy + Math.sin(bAngle + 0.2) * (r * 0.9));
            ctx.stroke();
          }

          // Laser crosshair scanning line
          const laserY = cy + Math.sin(t * 2.2) * (r * 0.7);
          const laserGrad = ctx.createLinearGradient(cx - r, laserY, cx + r, laserY);
          laserGrad.addColorStop(0, 'transparent');
          laserGrad.addColorStop(0.5, 'rgba(0, 255, 200, 0.9)');
          laserGrad.addColorStop(1, 'transparent');
          ctx.strokeStyle = laserGrad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - r * 1.15, laserY);
          ctx.lineTo(cx + r * 1.15, laserY);
          ctx.stroke();

          // Telemetry readout
          ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
          ctx.font = '10px monospace';
          ctx.fillText(`OPTICAL SCAN: CATARACT RISK 14.96%`, cx - 110, cy + r * 1.45);
          ctx.fillText(`FOVEA DENSITY: ${(85 + Math.sin(t) * 5).toFixed(1)}% | ACUITY: 20/70`, cx - 110, cy + r * 1.45 + 14);
          ctx.restore();
          break;
        }

        /* ================= 2. ORAL: DENTAL ARCH & MASTICATION ================= */
        case 'oral': {
          const cx = width * 0.5;
          const cy = height * 0.46;
          const archR = Math.min(width, height) * 0.28;

          // Dental arch horseshoe curve
          ctx.save();
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, archR * 0.95, archR * 1.15, 0, Math.PI * 0.15, Math.PI * 0.85);
          ctx.stroke();

          // 20+ Teeth nodes
          const teethCount = 14;
          for (let i = 0; i < teethCount; i++) {
            const angle = Math.PI * 0.15 + (i / (teethCount - 1)) * Math.PI * 0.7;
            const tx = cx + Math.cos(angle) * (archR * 0.95);
            const ty = cy + Math.sin(angle) * (archR * 1.15);

            // Biting pressure pulse
            const pressure = (Math.sin(t * 3 + i * 0.5) + 1) * 0.5;
            const toothR = 5 + pressure * 3.5;

            ctx.fillStyle = pressure > 0.75 ? 'rgba(251, 191, 36, 0.9)' : 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.arc(tx, ty, toothR, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Mastication pressure waves radiating
          const waveR = ((t * 40) % (archR * 1.2)) + 10;
          ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - waveR / (archR * 1.2)) * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy + 20, waveR, 0, Math.PI * 2);
          ctx.stroke();

          // Telemetry
          ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
          ctx.font = '10px monospace';
          ctx.fillText(`DENTAL ARCH DETECTION: 20+ TEETH ACTIVE`, cx - 110, cy + archR * 1.35);
          ctx.fillText(`MASTICATION FORCE: ${(62 + Math.sin(t * 3) * 12).toFixed(1)} N | RISK 11.96%`, cx - 110, cy + archR * 1.35 + 14);
          ctx.restore();
          break;
        }

        /* ================= 3. MOBILITY: GAIT ANALYSIS & FALL PREVENTION ================= */
        case 'mobility': {
          const cx = width * 0.5;
          const cy = height * 0.46;

          // Concentric balance gyroscopes
          ctx.save();
          for (let i = 1; i <= 3; i++) {
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 * i})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, i * 45, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Center-of-gravity stabilization vector
          const cogX = cx + Math.sin(t * 2.5) * 28;
          const cogY = cy + Math.cos(t * 1.8) * 22;

          ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
          ctx.beginPath();
          ctx.arc(cogX, cogY, 6, 0, Math.PI * 2);
          ctx.fill();

          // Dynamic velocity vectors
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cogX, cogY);
          ctx.stroke();

          // Biomechanical joint stick-figure walking cycle
          const hipY = cy - 40;
          const kneeAngle1 = Math.sin(t * 3) * 0.6;
          const kneeAngle2 = Math.sin(t * 3 + Math.PI) * 0.6;

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';

          // Torso & head
          ctx.beginPath();
          ctx.arc(cx, hipY - 35, 10, 0, Math.PI * 2); // Head
          ctx.moveTo(cx, hipY - 25);
          ctx.lineTo(cx, hipY); // Spine
          ctx.stroke();

          // Leg 1
          const knee1X = cx + Math.sin(kneeAngle1) * 26;
          const knee1Y = hipY + 28;
          const foot1X = knee1X + Math.sin(kneeAngle1 + 0.4) * 26;
          const foot1Y = knee1Y + 28;
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.9)';
          ctx.beginPath();
          ctx.moveTo(cx, hipY);
          ctx.lineTo(knee1X, knee1Y);
          ctx.lineTo(foot1X, foot1Y);
          ctx.stroke();

          // Leg 2
          const knee2X = cx + Math.sin(kneeAngle2) * 26;
          const knee2Y = hipY + 28;
          const foot2X = knee2X + Math.sin(kneeAngle2 + 0.4) * 26;
          const foot2Y = knee2Y + 28;
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
          ctx.beginPath();
          ctx.moveTo(cx, hipY);
          ctx.lineTo(knee2X, knee2Y);
          ctx.lineTo(foot2X, foot2Y);
          ctx.stroke();

          // Telemetry
          ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
          ctx.font = '10px monospace';
          ctx.fillText(`TUG GAIT SPEED: ${(12.4 + Math.sin(t) * 1.5).toFixed(1)}s (FALL RISK)`, cx - 110, cy + 90);
          ctx.fillText(`BALANCE INDEX: ${(74 + Math.cos(t * 2) * 8).toFixed(0)}/100 | RISK 8.90%`, cx - 110, cy + 104);
          ctx.restore();
          break;
        }

        /* ================= 4. ADL: BARTHEL INDEX RADAR ================= */
        case 'adl': {
          const cx = width * 0.5;
          const cy = height * 0.46;
          const radarR = Math.min(width, height) * 0.28;

          ctx.save();
          // Hexagonal spider web grid
          const sides = 6;
          for (let step = 1; step <= 4; step++) {
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
              const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
              const rCur = (radarR * step) / 4;
              const px = cx + Math.cos(a) * rCur;
              const py = cy + Math.sin(a) * rCur;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
          }

          // Dynamic ADL functional polygon
          ctx.beginPath();
          const adlScores = [0.85, 0.92, 0.78, 0.88, 0.72, 0.95];
          for (let i = 0; i < sides; i++) {
            const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
            const score = adlScores[i] + Math.sin(t * 2 + i) * 0.05;
            const px = cx + Math.cos(a) * radarR * score;
            const py = cy + Math.sin(a) * radarR * score;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = 'rgba(34, 197, 94, 0.22)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.85)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Nodes & labels
          const labels = ['BATH', 'FEED', 'DRESS', 'WALK', 'STAIR', 'TOILET'];
          for (let i = 0; i < sides; i++) {
            const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
            const px = cx + Math.cos(a) * (radarR * 1.15);
            const py = cy + Math.sin(a) * (radarR * 1.15);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], px, py);
          }

          // Telemetry
          ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
          ctx.font = '10px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`BARTHEL ADL INDEX: 88.5/100 (COMMUNITY)`, cx - 110, cy + radarR * 1.35);
          ctx.fillText(`INDEPENDENCE: HIGH | BED-BOUND RISK 6.27%`, cx - 110, cy + radarR * 1.35 + 14);
          ctx.restore();
          break;
        }

        /* ================= 5. HEARING: AUDIOGRAM & ACOUSTIC RIPPLES ================= */
        case 'hearing': {
          const cx = width * 0.5;
          const cy = height * 0.44;

          ctx.save();
          // Expanding acoustic sound waves
          const waveCount = 5;
          for (let i = 0; i < waveCount; i++) {
            const waveR = ((t * 45 + i * 32) % 150) + 10;
            const alpha = Math.max(0, 1 - waveR / 150) * 0.6;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, waveR, -Math.PI * 0.6, Math.PI * 0.6);
            ctx.stroke();
          }

          // Live multi-frequency audiogram spectrum equalizer
          const barCount = 18;
          const barW = 6;
          const barGap = 4;
          const startX = cx - (barCount * (barW + barGap)) / 2;
          const baseY = cy + 85;

          for (let i = 0; i < barCount; i++) {
            const freq = i * 0.8 + t * 4;
            const barH = Math.abs(Math.sin(freq)) * 48 + 8;
            const bx = startX + i * (barW + barGap);

            const barGrad = ctx.createLinearGradient(bx, baseY - barH, bx, baseY);
            barGrad.addColorStop(0, 'rgba(192, 132, 252, 0.95)');
            barGrad.addColorStop(1, 'rgba(126, 34, 206, 0.4)');

            ctx.fillStyle = barGrad;
            ctx.fillRect(bx, baseY - barH, barW, barH);
          }

          // Cochlea spiral icon representation in center
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx - 30, cy, 14, 0, Math.PI * 2);
          ctx.stroke();

          // Telemetry
          ctx.fillStyle = 'rgba(192, 132, 252, 0.9)';
          ctx.font = '10px monospace';
          ctx.fillText(`AUDIOGRAM SWEEP: 125Hz - 8000Hz`, cx - 110, baseY + 24);
          ctx.fillText(`HEARING THRESHOLD: 38 dB HL | RISK 5.23%`, cx - 110, baseY + 38);
          ctx.restore();
          break;
        }

        /* ================= 6. COGNITION: NEURAL SYNAPSE NETWORK ================= */
        case 'cognition': {
          ctx.save();
          // Animate neural nodes
          neuralNodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            node.pulse += 0.05;
          });

          // Draw synaptic connection axon lines
          ctx.lineWidth = 1;
          for (let i = 0; i < neuralNodes.length; i++) {
            for (let j = i + 1; j < neuralNodes.length; j++) {
              const dx = neuralNodes[i].x - neuralNodes[j].x;
              const dy = neuralNodes[i].y - neuralNodes[j].y;
              const dist = Math.hypot(dx, dy);

              if (dist < 110) {
                const alpha = (1 - dist / 110) * 0.45;
                ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(neuralNodes[i].x, neuralNodes[i].y);
                ctx.lineTo(neuralNodes[j].x, neuralNodes[j].y);
                ctx.stroke();

                // Synaptic action potential spark shooting along axon
                if (Math.sin(t * 3 + i * 2) > 0.8) {
                  const sparkRatio = (Math.sin(t * 6 + i) + 1) * 0.5;
                  const sx = neuralNodes[i].x + (neuralNodes[j].x - neuralNodes[i].x) * sparkRatio;
                  const sy = neuralNodes[i].y + (neuralNodes[j].y - neuralNodes[i].y) * sparkRatio;

                  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                  ctx.beginPath();
                  ctx.arc(sx, sy, 2, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }
          }

          // Draw neuron soma nodes
          neuralNodes.forEach((node, idx) => {
            const r = 3.5 + Math.sin(node.pulse) * 1.5;
            ctx.fillStyle = idx % 3 === 0 ? 'rgba(244, 114, 182, 0.95)' : 'rgba(236, 72, 153, 0.8)';
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
            ctx.fill();

            // Glowing aura around nodes
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.stroke();
          });

          // Telemetry
          ctx.fillStyle = 'rgba(244, 114, 182, 0.9)';
          ctx.font = '10px monospace';
          ctx.fillText(`SYNAPTIC NETWORK: MINI-COG ASSESS`, width * 0.5 - 110, height * 0.84);
          ctx.fillText(`COGNITIVE FLUX: ${(78 + Math.sin(t) * 8).toFixed(1)}% | RISK 5.07%`, width * 0.5 - 110, height * 0.84 + 14);
          ctx.restore();
          break;
        }

        /* ================= 7. INCONTINENCE: URODYNAMIC BIO-FEEDBACK ================= */
        case 'incontinence': {
          const cx = width * 0.5;
          const cy = height * 0.46;

          ctx.save();
          // Pelvic contraction oscillation radar
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, 75, 0, Math.PI * 2);
          ctx.stroke();

          // Continuous Urodynamic pressure waveform
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.95)';
          ctx.lineWidth = 2.5;
          for (let x = cx - 120; x <= cx + 120; x += 4) {
            const relX = (x - (cx - 120)) / 240;
            const waveY = cy + Math.sin(relX * Math.PI * 5 + t * 4) * 26 * Math.sin(relX * Math.PI);
            if (x === cx - 120) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
          }
          ctx.stroke();

          // Secondary bio-metric sine wave
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
          ctx.lineWidth = 1.2;
          for (let x = cx - 120; x <= cx + 120; x += 4) {
            const relX = (x - (cx - 120)) / 240;
            const waveY = cy + Math.cos(relX * Math.PI * 8 + t * 5) * 14;
            if (x === cx - 120) ctx.moveTo(x, waveY);
            else ctx.lineTo(x, waveY);
          }
          ctx.stroke();

          // Telemetry
          ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
          ctx.font = '10px monospace';
          ctx.fillText(`URODYNAMIC PRESSURE: ${(28 + Math.sin(t * 3) * 6).toFixed(1)} cmH2O`, cx - 110, cy + 90);
          ctx.fillText(`PELVIC TONE: STABLE | RISK 4.51%`, cx - 110, cy + 104);
          ctx.restore();
          break;
        }

        /* ================= 8. NUTRITION: METABOLIC HELIX & MUSCLE GAUGE ================= */
        case 'nutrition': {
          const cx = width * 0.5;
          const cy = height * 0.46;

          ctx.save();
          // Spinning DNA/Nutrient helix
          const helixHeight = 160;
          const baseHelixY = cy - helixHeight / 2;
          const points = 24;

          for (let i = 0; i < points; i++) {
            const y = baseHelixY + (i / points) * helixHeight;
            const phase = (i / points) * Math.PI * 4 + t * 2.5;

            const x1 = cx + Math.sin(phase) * 55;
            const x2 = cx - Math.sin(phase) * 55;

            // Rung connecting strands
            if (i % 2 === 0) {
              ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(x1, y);
              ctx.lineTo(x2, y);
              ctx.stroke();
            }

            // Strand 1 node
            ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
            ctx.beginPath();
            ctx.arc(x1, y, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Strand 2 node
            ctx.fillStyle = 'rgba(251, 113, 133, 0.9)';
            ctx.beginPath();
            ctx.arc(x2, y, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Telemetry
          ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
          ctx.font = '10px monospace';
          ctx.fillText(`MNA METABOLIC: SARCOPENIA INDEX`, cx - 110, cy + 100);
          ctx.fillText(`MUSCLE MASS DENSITY: ${(82 + Math.sin(t) * 4).toFixed(1)}% | RISK 4.16%`, cx - 110, cy + 114);
          ctx.restore();
          break;
        }

        /* ================= 9. DEPRESSION: CARDIAC ECG & WELLNESS WAVE ================= */
        case 'depression':
        default: {
          const cx = width * 0.5;
          const cy = height * 0.46;

          ctx.save();
          // Radiating warm wellness aura
          const pulseR = 40 + Math.sin(t * 3.5) * 12;
          const pulseGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, pulseR);
          pulseGrad.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
          pulseGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = pulseGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
          ctx.fill();

          // Live ECG cardiac trace sweep
          ctx.strokeStyle = 'rgba(129, 140, 248, 0.95)';
          ctx.lineWidth = 2.2;
          ctx.lineCap = 'round';
          ctx.beginPath();

          const ecgWidth = 240;
          const startX = cx - ecgWidth / 2;
          const sweepX = ((t * 90) % ecgWidth) + startX;

          for (let x = startX; x <= startX + ecgWidth; x += 3) {
            const relX = (x - startX) / ecgWidth;
            let yOffset = 0;

            // QRS wave complex repeat
            const cycleX = (x * 0.05 + t * 1.5) % 3;
            if (cycleX > 1.2 && cycleX < 1.3) yOffset = -8; // P wave
            else if (cycleX >= 1.3 && cycleX < 1.35) yOffset = 4; // Q wave
            else if (cycleX >= 1.35 && cycleX < 1.45) yOffset = -36; // R wave peak
            else if (cycleX >= 1.45 && cycleX < 1.52) yOffset = 12; // S wave
            else if (cycleX >= 1.6 && cycleX < 1.8) yOffset = -10; // T wave

            const drawY = cy + yOffset;
            if (x === startX) ctx.moveTo(x, drawY);
            else ctx.lineTo(x, drawY);
          }
          ctx.stroke();

          // Leading cardiac pulse point
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.arc(sweepX, cy, 4, 0, Math.PI * 2);
          ctx.fill();

          // Telemetry
          ctx.fillStyle = 'rgba(129, 140, 248, 0.9)';
          ctx.font = '10px monospace';
          ctx.fillText(`2Q MENTAL HEALTH: HRV SYNCHRONY 68ms`, cx - 110, cy + 90);
          ctx.fillText(`EMOTIONAL HOMEOSTASIS: GOOD | RISK 1.43%`, cx - 110, cy + 104);
          ctx.restore();
          break;
        }
      }

      // 4. Floating atmospheric ambient particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(p.phase + t) * 0.25 + 0.35})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Medical UI Crosshair corner brackets
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
      const pad = 16;
      const bracketLen = 14;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(pad, pad + bracketLen);
      ctx.lineTo(pad, pad);
      ctx.lineTo(pad + bracketLen, pad);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(width - pad - bracketLen, pad);
      ctx.lineTo(width - pad, pad);
      ctx.lineTo(width - pad, pad + bracketLen);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(pad, height - pad - bracketLen);
      ctx.lineTo(pad, height - pad);
      ctx.lineTo(pad + bracketLen, height - pad);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(width - pad - bracketLen, height - pad);
      ctx.lineTo(width - pad, height - pad);
      ctx.lineTo(width - pad, height - pad - bracketLen);
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [dimensionKey, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full block ${className}`}
    />
  );
};
