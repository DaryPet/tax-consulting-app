import React, { useState, useEffect } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const AnimatedBackground: React.FC = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          // style={{
          //   position: "absolute", // Фиксируем частицы на фоне
          //   top: 0,
          //   left: 0,
          //   right: 0,
          //   bottom: 0,
          //   zIndex: -1,
          // }}
          style={{
            position: "absolute", // Фиксируем частицы на фоне
            top: 0,
            left: 0,
            width: "100%", // Устанавливаем ширину 100%
            height: "100%", // Устанавливаем высоту 100%
            zIndex: -100, // Частицы на заднем фоне
            pointerEvents: "none", // Убираем блокировку кликов
          }}
          // style={{
          //   position: "fixed", // Используем fixed, чтобы частицы фиксировались в окне
          //   top: 0,
          //   left: 0,
          //   width: "100vw", // Ограничиваем ширину до 100% от экрана
          //   height: "100vh", // Ограничиваем высоту до 100% от экрана
          //   zIndex: -10, // Частицы на заднем фоне
          //   pointerEvents: "none", // Частицы не блокируют клики
          // }}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: {
                  enable: true,
                },
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 3,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </>
  );
};

export default AnimatedBackground;
