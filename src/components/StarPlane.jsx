import { useEffect, useRef } from "react";
import * as THREE from "three";

const StarPlane = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) {
      console.error("Mount point not found");
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060c30);

    //camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const spaceship = createSpaceship();
    spaceship.position.set(0, 0, 0);
    scene.add(spaceship);

    // gestion rotation de drop a la souris
    let isDragging = false;
    let previousMousePosition = { x: -10, y: -10 };

    const handleMouseDown = (event) => {
      event.preventDefault();
      isDragging = true;
      previousMousePosition = {
        x: event.ClientX,
        y: event.ClientY,
      };
    };

    const handleMouseMove = (event) => {
      if (!isDragging) return;
      const deltaMove = {
        x: event.clientX,
        y: event.clientY,
      };

      spaceship.rotation.y += deltaMove.x * 0.01;
      spaceship.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Ajout des écouteurs d'événements
    currentMount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Ajoutez une lumière pour voir le vaisseau correctement
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement); // C majuscule ici

    // Ajout d'étoiles
    const starGeometry = new THREE.SphereGeometry(0.1, 24, 24);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 200; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(100));
      star.position.set(x, y, z);
      scene.add(star);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      if (isDragging) {
        renderer.render(scene, camera);
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      currentMount.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-screen bg-black" />;
};

//creation vaisseau
const createSpaceship = () => {
  const shipGroup = new THREE.Group();

  const cockpitGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI / 1.5);
  const cockpitMaterial = new THREE.MeshPhongMaterial({
    color: 0x4444ff,
    transparent: true,
    opacity: 0.6,
    shininess: 100,
  });
  const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
  shipGroup.add(cockpit);

  //Ailes
  const wingGeometry = new THREE.BoxGeometry(2, 0.2, 1);
  const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });

  //Aile Gauche
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.position.set(-1.2, -1.3, 0);
  leftWing.rotation.z = Math.PI * 0.1;
  shipGroup.add(leftWing);
  // Aile droite
  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.position.set(1.2, -0.3, 0);
  rightWing.rotation.z = -Math.PI * 0.1;
  shipGroup.add(rightWing);

  // Aileron
  const finGeometry = new THREE.BoxGeometry(0.2, 1, 0.8);
  const fin = new THREE.Mesh(finGeometry, wingMaterial);
  fin.position.set(0, 0.5, -1);
  shipGroup.add(fin);

  // Réacteurs
  const engineGeometry = new THREE.CylinderGeometry(0.3, 0.5, 1, 16);
  const engineMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });

  // Réacteur gauche
  const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
  leftEngine.position.set(-0.5, -0.2, -1);
  leftEngine.rotation.x = Math.PI * 0.5;
  shipGroup.add(leftEngine);

  // Réacteur droit
  const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
  rightEngine.position.set(0.5, -0.2, -1);
  rightEngine.rotation.x = Math.PI * 0.5;
  shipGroup.add(rightEngine);

  return shipGroup;
};

export default StarPlane;
