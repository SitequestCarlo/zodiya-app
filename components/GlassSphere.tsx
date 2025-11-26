import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import * as THREE from 'three';
import { Accelerometer } from 'expo-sensors';

const horoscopeQuotes = [
  "The stars align in your favor today",
  "A mysterious opportunity awaits you",
  "Trust your intuition, it guides you well",
  "Change is coming, embrace it",
  "Your creativity will shine brightly",
  "Love finds you when you least expect it",
  "Fortune favors the bold today",
  "A journey of discovery begins soon",
  "Your patience will be rewarded",
  "The universe conspires in your favor",
  "Hidden talents will soon emerge",
  "A new friendship brings joy",
  "Financial abundance is near",
  "Your dreams hold important messages",
  "Adventure calls, answer it",
  "Inner peace is within reach",
  "A challenge becomes a blessing",
  "Wisdom comes from unexpected sources",
  "Your kindness creates ripples",
  "The moon illuminates your path"
];

export default function GlassSphere() {
  const [currentQuote, setCurrentQuote] = useState(horoscopeQuotes[0]);
  const [isShaking, setIsShaking] = useState(false);
  const [smokeOpacity, setSmokeOpacity] = useState(0);
  const [sparkleOpacity, setSparkleOpacity] = useState(0);
  const [bounceOffset, setBounceOffset] = useState(0);
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const textSpriteRef = useRef<THREE.Sprite | null>(null);
  const smokeParticlesRef = useRef<THREE.Points[]>([]);
  const sparkleParticlesRef = useRef<THREE.Points[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const bounceTimeRef = useRef<number>(-10000); // Initialize to far in the past so no bounce initially
  const sparkleTimeRef = useRef<number>(-10000);

  const triggerBounce = () => {
    console.log('Bounce triggered!');
    bounceTimeRef.current = Date.now();
    sparkleTimeRef.current = Date.now();
  };

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * horoscopeQuotes.length);
    setCurrentQuote(horoscopeQuotes[randomIndex]);
    
    // Trigger bounce, smoke, and sparkle animations
    triggerBounce();
    setSmokeOpacity(1);
    setSparkleOpacity(1);
    setTimeout(() => {
      setSmokeOpacity(0);
      setSparkleOpacity(0);
    }, 2000);
  };

  useEffect(() => {
    let subscription: any;

    if (Platform.OS !== 'web') {
      // Set up shake detection for mobile
      Accelerometer.setUpdateInterval(100);
      
      subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        
        // Detect shake (acceleration threshold)
        if (acceleration > 2.5 && !isShaking) {
          setIsShaking(true);
          getRandomQuote();
          
          // Prevent rapid consecutive shakes
          setTimeout(() => {
            setIsShaking(false);
          }, 1000);
        }
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isShaking]);

  const createTextTexture = (text: string) => {
    // Only works on web platform
    if (Platform.OS !== 'web') return null;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.width = 512;
    canvas.height = 256;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Set text style
    context.fillStyle = '#000000'; // Monochrome text
    context.font = 'bold 28px Lancelot, serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Word wrap
    const maxWidth = canvas.width - 40;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    // Draw text lines
    const lineHeight = 36;
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      context.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });

    return canvas;
  };

  useEffect(() => {
    if (textSpriteRef.current && sceneRef.current) {
      // Trigger smoke and sparkle animations
      setSmokeOpacity(1);
      setSparkleOpacity(1);
      sparkleTimeRef.current = Date.now();
      
      // Update text texture when quote changes (works on all platforms)
      const canvas = createTextTexture(currentQuote);
      if (canvas) {
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        
        if (textSpriteRef.current) {
          textSpriteRef.current.material.dispose();
          (textSpriteRef.current.material as THREE.SpriteMaterial).map?.dispose();
          textSpriteRef.current.material = material;
        }
      }
      
      // Fade out smoke and sparkles after 2 seconds
      setTimeout(() => {
        setSmokeOpacity(0);
        setSparkleOpacity(0);
      }, 2000);
    }
  }, [currentQuote]);

  const onContextCreate = async (gl: WebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Create renderer with antialias disabled for iOS compatibility
    const renderer = new Renderer({ 
      gl,
      antialias: false, // Disable multisampling for iOS
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6); // Center the camera
    camera.lookAt(0, 0, 0); // Look at center of scene
    cameraRef.current = camera;

    // Create glass sphere - made bigger
    const geometry = new THREE.SphereGeometry(2.5, 64, 64);
    
    // Simplified glass material for iOS compatibility
    const material = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphereRef.current = sphere;
    scene.add(sphere);

    // Create smoke texture
    const createSmokeTexture = () => {
      // Only works on web
      if (Platform.OS !== 'web') return null;
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;

      canvas.width = 128;
      canvas.height = 128;

      // Create radial gradient for soft smoke particle
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.3, 'rgba(200, 200, 200, 0.4)');
      gradient.addColorStop(0.6, 'rgba(150, 150, 150, 0.2)');
      gradient.addColorStop(1, 'rgba(100, 100, 100, 0)');

      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);

      return new THREE.CanvasTexture(canvas);
    };

    const smokeTexture = Platform.OS === 'web' ? createSmokeTexture() : null;

    // Create smoke particles inside the sphere
    const createSmokeParticles = () => {
      const particleCount = 100; // Fewer but larger particles
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        // Create particles within sphere radius (2.0 to stay inside)
        const radius = Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[index] = radius * Math.sin(phi) * Math.cos(theta);
        positions[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[index + 2] = radius * Math.cos(phi);
        
        // Random sizes for more organic look
        sizes[i] = Math.random() * 0.5 + 0.3;
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xbfbfbf,
        size: 0.6,
        map: smokeTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.NormalBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      
      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
      smokeParticlesRef.current.push(particleSystem);
      
      return particleSystem;
    };
    
    // Create multiple smoke layers
    for (let i = 0; i < 5; i++) {
      createSmokeParticles();
    }

    // Create star texture for sparkles
    const createStarTexture = () => {
      // Only works on web
      if (Platform.OS !== 'web') return null;
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;

      canvas.width = 128;
      canvas.height = 128;
      const centerX = 64;
      const centerY = 64;

      // Clear canvas
      context.clearRect(0, 0, 128, 128);

      // Draw 4-pointed star with gradients for glow
      context.save();
      context.translate(centerX, centerY);

      // Create multiple layers for a glowing star effect
      for (let layer = 0; layer < 3; layer++) {
        const layerSize = 1 - (layer * 0.2);
        const layerAlpha = 1 - (layer * 0.3);
        
        context.beginPath();
        const points = 4;
        const outerRadius = 50 * layerSize;
        const innerRadius = 15 * layerSize;
        
        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / points;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }
        context.closePath();
        
        // Create gradient for this layer
        const gradient = context.createRadialGradient(0, 0, 0, 0, 0, outerRadius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${layerAlpha})`);
        gradient.addColorStop(0.3, `rgba(200, 200, 200, ${layerAlpha * 0.9})`);
        gradient.addColorStop(0.6, `rgba(150, 150, 150, ${layerAlpha * 0.5})`);
        gradient.addColorStop(1, `rgba(120, 120, 120, 0)`);
        
        context.fillStyle = gradient;
        context.fill();
      }
      
      context.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const starTexture = createStarTexture();

    // Create golden sparkle particles
    const createSparkleParticles = () => {
      const particleCount = 200; // More particles!
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        // Start near the sphere surface
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 4;
        const radius = 2.5 + Math.random() * 0.5;
        
        positions[index] = Math.cos(angle) * radius;
        positions[index + 1] = height;
        positions[index + 2] = Math.sin(angle) * radius;
        
        // Outward velocity
        velocities[index] = Math.cos(angle) * 0.02;
        velocities[index + 1] = (Math.random() - 0.5) * 0.04;
        velocities[index + 2] = Math.sin(angle) * 0.02;
        
        sizes[i] = Math.random() * 0.03 + 0.02; // Even smaller size range
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF, // White to show star texture color
        size: 0.08, // Much tinier particles
        map: starTexture, // Apply star texture
        transparent: true,
        opacity: 1, // Start with full opacity for testing
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      
      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
      sparkleParticlesRef.current.push(particleSystem);
      
      return particleSystem;
    };
    
    // Create sparkle layers
    for (let i = 0; i < 5; i++) { // More layers for more particles
      createSparkleParticles();
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Create text sprite (works on all platforms)
    const canvas = createTextTexture(currentQuote);
    if (canvas) {
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(4.5, 2.25, 1); // Bigger text to match bigger sphere
      sprite.position.set(0, -0.2, -0.5); // Adjusted up (y: -0.2) and behind sphere (z: -0.5)
      sprite.center.set(0.5, 0.5); // Center the sprite
      textSpriteRef.current = sprite;
      scene.add(sprite);
    }

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Calculate bounce effect - STRONGER!
      const timeSinceBounce = Date.now() - bounceTimeRef.current;
      const bounceDuration = 1200; // 1.2 seconds bounce
      let bounceY = 0;
      
      if (timeSinceBounce < bounceDuration && timeSinceBounce >= 0) {
        // Bounce animation using sine wave with decay
        const progress = timeSinceBounce / bounceDuration;
        const decay = 1 - progress; // Decreases from 1 to 0
        bounceY = Math.sin(progress * Math.PI * 5) * 0.8 * decay; // 5 bounces with MUCH stronger amplitude (0.8)
      }

      // Apply bounce to sphere and rotate
      if (sphereRef.current) {
        sphereRef.current.rotation.y += 0.005;
        sphereRef.current.rotation.x += 0.002;
        sphereRef.current.position.y = bounceY;
      }

      // Apply stronger bounce to text sprite - ensure it moves with sphere
      if (textSpriteRef.current) {
        textSpriteRef.current.position.y = -0.2 + bounceY; // Text bounces with sphere
      }

      // Animate smoke particles with swirling motion and bounce
      smokeParticlesRef.current.forEach((particleSystem, index) => {
        const material = particleSystem.material as THREE.PointsMaterial;
        material.opacity = smokeOpacity * 0.5; // Max 0.5 opacity for subtle, wispy effect
        
        // Apply bounce to smoke
        particleSystem.position.y = bounceY;
        
        // Counter-rotating layers for swirling effect
        const direction = index % 2 === 0 ? 1 : -1;
        particleSystem.rotation.y += 0.003 * direction * (index * 0.5 + 1);
        particleSystem.rotation.x += 0.0015 * direction;
        particleSystem.rotation.z += 0.001 * direction;
        
        // Gentle floating drift with different patterns per layer
        const positions = particleSystem.geometry.attributes.position.array as Float32Array;
        const time = Date.now() * 0.0003;
        for (let i = 0; i < positions.length; i += 3) {
          const particleIndex = i / 3;
          positions[i] += Math.sin(time + particleIndex + index) * 0.0008;
          positions[i + 1] += Math.cos(time * 0.7 + particleIndex + index) * 0.0012;
          positions[i + 2] += Math.sin(time * 1.3 + particleIndex + index) * 0.0008;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      });

      // Animate golden sparkle particles
      const timeSinceSparkle = Date.now() - sparkleTimeRef.current;
      const sparkleDuration = 2000; // 2 seconds
      
      sparkleParticlesRef.current.forEach((particleSystem, index) => {
        const material = particleSystem.material as THREE.PointsMaterial;
        const positions = particleSystem.geometry.attributes.position.array as Float32Array;
        const velocities = particleSystem.geometry.attributes.velocity?.array as Float32Array;
        
        if (timeSinceSparkle < sparkleDuration && timeSinceSparkle >= 0) {
          const progress = timeSinceSparkle / sparkleDuration;
          // Fade in then out with stronger opacity
          const fadeOpacity = Math.sin(progress * Math.PI);
          material.opacity = fadeOpacity * 1.0; // Full brightness
          
          // Move particles outward and upward
          if (velocities) {
            for (let i = 0; i < positions.length; i += 3) {
              positions[i] += velocities[i];
              positions[i + 1] += velocities[i + 1];
              positions[i + 2] += velocities[i + 2];
              
              // Add sparkle effect (twinkling)
              const particleIndex = i / 3;
              const twinkle = Math.sin(Date.now() * 0.01 + particleIndex) * 0.5 + 0.5;
              velocities[i + 1] += 0.001; // Gravity effect
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
          }
        } else {
          material.opacity = 0;
          
          // Reset positions when animation completes
          if (timeSinceSparkle >= sparkleDuration && timeSinceSparkle < sparkleDuration + 100) {
            for (let i = 0; i < positions.length / 3; i++) {
              const index = i * 3;
              const angle = Math.random() * Math.PI * 2;
              const height = (Math.random() - 0.5) * 4;
              const radius = 2.5 + Math.random() * 0.5;
              
              positions[index] = Math.cos(angle) * radius;
              positions[index + 1] = height;
              positions[index + 2] = Math.sin(angle) * radius;
              
              if (velocities) {
                velocities[index] = Math.cos(angle) * 0.02;
                velocities[index + 1] = (Math.random() - 0.5) * 0.04;
                velocities[index + 2] = Math.sin(angle) * 0.02;
              }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
          }
        }
      });

      renderer.render(scene, camera);
      (gl as any).endFrameEXP();
    };

    animate();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
      
      {/* Quote text for mobile (non-WebGL text rendering) */}
      {Platform.OS !== 'web' && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>{currentQuote}</Text>
        </View>
      )}
      
      {/* Refresh button for desktop */}
      {Platform.OS === 'web' && (
        <TouchableOpacity style={styles.refreshButton} onPress={getRandomQuote}>
          <Text style={styles.refreshButtonText}>Neues Orakel anzeigen</Text>
        </TouchableOpacity>
      )}

      {/* Shake instruction for mobile */}
      {Platform.OS !== 'web' && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>Shake your device for a new fortune</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  glView: {
    width: '100%',
    height: 500,
  },
  quoteContainer: {
    position: 'absolute',
    top: 240, // Moved down for mobile
    left: 0,
    right: 0,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  quoteText: {
    fontFamily: 'Lancelot_400Regular',
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
  },
  refreshButtonText: {
    fontFamily: 'Lancelot_400Regular',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
  instructionContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontFamily: 'Lancelot_400Regular',
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    opacity: 0.8,
  },
});
