/* eslint-disable */
// @ts-nocheck
"use client";

import React, { useRef, useEffect } from 'react';

const CanvasAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
        const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    // All browser-specific code is now safely inside useEffect.
    const E = {
      friction: 0.5,
      trails: 80,
      size: 50,
      dampening: 0.025,
      tension: 0.99,
    };

    let pos = { x: 0, y: 0 };

    class Node {
      x = 0;
      y = 0;
      vy = 0;
      vx = 0;
      constructor() {
        this.x = pos.x;
        this.y = pos.y;
      }
    }

    class Wave {
      phase = Math.random() * 2 * Math.PI;
      offset = 285;
      frequency = 0.0015;
      amplitude = 85;

      update() {
        this.phase += this.frequency;
        return this.offset + Math.sin(this.phase) * this.amplitude;
      }
    }

    class Line {
      spring;
      friction;
      nodes = [] as Node[];

      constructor(options) {
        this.spring = options.spring + 0.1 * Math.random() - 0.05;
        this.friction = E.friction + 0.01 * Math.random() - 0.005;
        for (let i = 0; i < E.size; i++) {
          this.nodes.push(new Node());
        }
      }

      update() {
        let spring = this.spring;
        for (const [i, node] of this.nodes.entries()) {
          if (i === 0) {
            node.vx += (pos.x - node.x) * spring;
            node.vy += (pos.y - node.y) * spring;
          } else {
            const prevNode = this.nodes[i - 1];
            node.vx += (prevNode.x - node.x) * spring;
            node.vy += (prevNode.y - node.y) * spring;
            node.vx += prevNode.vx * E.dampening;
            node.vy += prevNode.vy * E.dampening;
          }
          node.vx *= this.friction;
          node.vy *= this.friction;
          node.x += node.vx;
          node.y += node.vy;
          spring *= E.tension;
        }
      }

      draw() {
        let p1 = this.nodes[0];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);

        for (let i = 1, len = this.nodes.length; i < len - 1; i++) {
          const point = this.nodes[i];
          const nextPoint = this.nodes[i + 1];
          const xc = (point.x + nextPoint.x) / 2;
          const yc = (point.y + nextPoint.y) / 2;
          ctx.quadraticCurveTo(point.x, point.y, xc, yc);
        }
        ctx.quadraticCurveTo(this.nodes[this.nodes.length - 2].x, this.nodes[this.nodes.length - 2].y, this.nodes[this.nodes.length - 1].x, this.nodes[this.nodes.length - 1].y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    const f = new Wave();
    const lines = [] as Line[];

    const init = () => {
      lines.length = 0;
      for (let i = 0; i < E.trails; i++) {
        lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
      }
    }

    const render = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = `hsla(${Math.round(f.update())},100%,50%,0.025)`;
      ctx.lineWidth = 10;

      for (const line of lines) {
        line.update();
        line.draw();
      }
      animationFrameId = window.requestAnimationFrame(render);
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pos = { x: canvas.width / 2, y: canvas.height / 2 };
      init();
    }

    const handleMouseMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        pos.x = e.touches[0].clientX;
        pos.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);

    resizeCanvas();
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="canvas" className="bg-skin-base pointer-events-none absolute inset-0 mx-auto" />;
};

export default CanvasAnimation;
