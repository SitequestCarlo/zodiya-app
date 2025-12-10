import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer, TextureLoader, loadAsync } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';

interface PageProps {
  title: string;
}

// Animated loading moon component
const LoadingMoon = ({ size = 48 }: { size?: number }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Svg width={size} height={size} viewBox="0 0 128 128">
        <Path
          d="M64 16.5A66.53 66.53 0 0 0 .26 64a63.75 63.75 0 0 1 127.5 0h-.02A66.53 66.53 0 0 0 64 16.5z"
          fill="#000000"
        />
      </Svg>
    </Animated.View>
  );
};

interface Crystal {
  id: string;
  name: string;
  zodiac: string;
  model: any;
  texture: any;
}

const crystals: Crystal[] = [
  { id: 'widder', name: 'Granat', zodiac: 'Widder', model: require('../assets/models/widder-granat.glb'), texture: require('../assets/models/widder-granat/baseColor.jpg') },
  { id: 'stier', name: 'Rosenquarz', zodiac: 'Stier', model: require('../assets/models/stier-rosenquarz.glb'), texture: require('../assets/models/stier-rosenquarz/baseColor.jpg') },
  { id: 'zwilling', name: 'Citrin', zodiac: 'Zwilling', model: require('../assets/models/zwilling-citrine-crystal.glb'), texture: require('../assets/models/zwilling-citrine-crystal/baseColor.jpg') },
  { id: 'krebs', name: 'Adularia', zodiac: 'Krebs', model: require('../assets/models/krebs-adularia.glb'), texture: require('../assets/models/krebs-adularia/baseColor.jpg') },
  { id: 'loewe', name: 'Bernstein', zodiac: 'Löwe', model: require('../assets/models/loewe-bernstein.glb'), texture: require('../assets/models/loewe-bernstein/baseColor_1.jpg') },
  { id: 'jungfrau', name: 'Amazonit', zodiac: 'Jungfrau', model: require('../assets/models/jungfrau-amazonite.glb'), texture: require('../assets/models/jungfrau-amazonite/baseColor.jpg') },
  { id: 'waage', name: 'Lapislazuli', zodiac: 'Waage', model: require('../assets/models/waage-lapislazuli.glb'), texture: require('../assets/models/waage-lapislazuli/baseColor_1.jpg') },
  { id: 'skorpion', name: 'Obsidian', zodiac: 'Skorpion', model: require('../assets/models/skorpion-obsidian.glb'), texture: require('../assets/models/skorpion-obsidian/baseColor_1.jpg') },
  { id: 'schuetze', name: 'Türkis', zodiac: 'Schütze', model: require('../assets/models/schuetze-tuerkis.glb'), texture: require('../assets/models/schuetze-tuerkis/baseColor.jpg') },
  { id: 'steinbock', name: 'Onyx', zodiac: 'Steinbock', model: require('../assets/models/steinbock-onyx.glb'), texture: require('../assets/models/steinbock-onyx/baseColor.jpg') },
  { id: 'wassermann', name: 'Amethyst', zodiac: 'Wassermann', model: require('../assets/models/wassermann-amethyst.glb'), texture: require('../assets/models/wassermann-amethyst/baseColor.jpg') },
  { id: 'fische', name: 'Aquamarin', zodiac: 'Fische', model: require('../assets/models/fische-aquamarine.glb'), texture: require('../assets/models/fische-aquamarine/baseColor_1.jpg') },
];

function CrystalViewer({ crystal }: { crystal: Crystal }) {
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Touch/orbit control state
  const touchRef = useRef({ 
    isActive: false, 
    lastX: 0, 
    lastY: 0,
    rotationX: 0,
    rotationY: 0,
    autoRotate: true 
  });

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

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    const renderer = new Renderer({ gl, antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xf5f5f5, 1); // Light grey background
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3); // Closer to model
    cameraRef.current = camera;

    // Lighting - comprehensive setup for all models
    // Strong ambient light to ensure all surfaces are visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Main key light from front-top-right
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    // Fill light from front-top-left
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-5, 5, 5);
    scene.add(fillLight);

    // Back light for rim lighting
    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    // Bottom fill to illuminate underside
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.6);
    bottomLight.position.set(0, -5, 0);
    scene.add(bottomLight);

    // Side lights for full coverage
    const leftLight = new THREE.DirectionalLight(0xffffff, 0.5);
    leftLight.position.set(-5, 0, 0);
    scene.add(leftLight);

    const rightLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rightLight.position.set(5, 0, 0);
    scene.add(rightLight);

    // Load GLB model using expo-three's loadAsync
    console.log('[CrystalViewer] Starting to load model for:', crystal.name);
    try {
      const asset = Asset.fromModule(crystal.model);
      console.log('[CrystalViewer] Asset created:', asset);
      
      await asset.downloadAsync();
      console.log('[CrystalViewer] Asset downloaded');
      
      // Use expo-three's loadAsync
      const gltf: any = await loadAsync(asset);
      console.log('[CrystalViewer] GLTF loaded');
      
      // The scene property contains a THREE.js JSON format that we can parse
      let model: THREE.Object3D | null = null;
      
      if (gltf.scene && gltf.scene.object) {
        // Parse the JSON scene data using ObjectLoader
        const loader = new THREE.ObjectLoader();
        model = loader.parse(gltf.scene);
        console.log('[CrystalViewer] Parsed scene from JSON');
      } else if (gltf.scene && typeof gltf.scene.updateWorldMatrix === 'function') {
        // It's already a proper Object3D
        model = gltf.scene;
        console.log('[CrystalViewer] Using scene directly');
      } else if (gltf.scenes && gltf.scenes[0] && gltf.scenes[0].object) {
        const loader = new THREE.ObjectLoader();
        model = loader.parse(gltf.scenes[0]);
        console.log('[CrystalViewer] Parsed from scenes array');
      }
      
      if (!model) {
        console.error('[CrystalViewer] Could not extract model from GLTF');
        setIsLoading(false);
        return;
      }
      
      // Load texture separately using expo-three's loadAsync
      console.log('[CrystalViewer] Loading texture...');
      let texture: THREE.Texture | null = null;
      try {
        const textureAsset = Asset.fromModule(crystal.texture);
        await textureAsset.downloadAsync();
        texture = await loadAsync(textureAsset) as THREE.Texture;
        texture.flipY = false; // GLTF textures don't need flip
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        console.log('[CrystalViewer] Texture loaded successfully');
      } catch (texError) {
        console.log('[CrystalViewer] Could not load texture:', texError);
      }
      
      // Apply texture or fallback materials with double-sided rendering
      console.log('[CrystalViewer] Applying materials to model');
      
      model.traverse((child: any) => {
        if (child.isMesh) {
          if (texture) {
            child.material = new THREE.MeshStandardMaterial({
              map: texture,
              metalness: 0.2,
              roughness: 0.5,
              side: THREE.DoubleSide, // Render both sides to prevent holes
            });
            console.log('[CrystalViewer] Applied texture to mesh');
          } else {
            const mat = child.material;
            const originalColor = mat && mat.color ? mat.color.clone() : new THREE.Color(0xffaacc);
            child.material = new THREE.MeshStandardMaterial({
              color: originalColor,
              metalness: 0.3,
              roughness: 0.4,
              transparent: true,
              opacity: 0.9,
              side: THREE.DoubleSide, // Render both sides to prevent holes
            });
            console.log('[CrystalViewer] Applied fallback material');
          }
        }
      });
      
      // Center and scale the model
      // First, get initial bounding box
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      console.log('[CrystalViewer] Model size:', size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 2 / maxDim : 1;
      console.log('[CrystalViewer] Scale:', scale);
      
      // Apply scale first
      model.scale.setScalar(scale);
      model.updateMatrixWorld(true);
      
      // Recalculate bounding box after scaling
      const scaledBox = new THREE.Box3().setFromObject(model);
      const center = scaledBox.getCenter(new THREE.Vector3());
      console.log('[CrystalViewer] Center after scale:', center);
      
      // Create a pivot group for proper rotation around center
      const pivot = new THREE.Group();
      
      // Move model so its center is at the pivot's origin
      model.position.set(-center.x, -center.y, -center.z);
      
      // Add model to pivot, then pivot to scene
      pivot.add(model);
      scene.add(pivot);
      modelRef.current = pivot; // Rotate the pivot, not the model
      console.log('[CrystalViewer] Model added to scene!');
      setIsLoading(false);
    } catch (error) {
      console.error('[CrystalViewer] Error loading model:', error);
      setIsLoading(false);
    }

    // Animation loop with orbit rotation
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (modelRef.current) {
        // Apply rotation from touch or auto-rotate
        if (touchRef.current.autoRotate && !touchRef.current.isActive) {
          touchRef.current.rotationY += 0.005;
        }
        modelRef.current.rotation.x = touchRef.current.rotationX;
        modelRef.current.rotation.y = touchRef.current.rotationY;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        gl.endFrameEXP();
      }
    };
    animate();
  };

  // Touch handlers for orbit control
  const handleTouchStart = (e: any) => {
    const touch = e.nativeEvent.touches[0];
    if (touch) {
      touchRef.current.isActive = true;
      touchRef.current.lastX = touch.pageX;
      touchRef.current.lastY = touch.pageY;
      touchRef.current.autoRotate = false;
    }
  };

  const handleTouchMove = (e: any) => {
    if (!touchRef.current.isActive) return;
    const touch = e.nativeEvent.touches[0];
    if (touch) {
      const deltaX = touch.pageX - touchRef.current.lastX;
      const deltaY = touch.pageY - touchRef.current.lastY;
      
      touchRef.current.rotationY += deltaX * 0.01;
      touchRef.current.rotationX += deltaY * 0.01;
      
      // Clamp vertical rotation
      touchRef.current.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, touchRef.current.rotationX));
      
      touchRef.current.lastX = touch.pageX;
      touchRef.current.lastY = touch.pageY;
    }
  };

  const handleTouchEnd = () => {
    touchRef.current.isActive = false;
    // Resume auto-rotate after 3 seconds of no interaction
    setTimeout(() => {
      if (!touchRef.current.isActive) {
        touchRef.current.autoRotate = true;
      }
    }, 3000);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.viewerContainer}>
        <View style={styles.webPlaceholder}>
          <Text style={styles.placeholderText}>3D Preview</Text>
          <Text style={styles.placeholderSubtext}>{crystal.name}</Text>
        </View>
      </View>
    );
  }

  return (
    <View 
      style={styles.viewerContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingMoon size={48} />
        </View>
      )}
    </View>
  );
}

function CrystalCard({ crystal, onPress, isSelected }: { crystal: Crystal; onPress: () => void; isSelected: boolean }) {
  return (
    <TouchableOpacity 
      style={[styles.card, isSelected && styles.cardSelected]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.zodiacText, isSelected && styles.textSelected]}>{crystal.zodiac}</Text>
      <Text style={[styles.crystalName, isSelected && styles.textSelected]}>{crystal.name}</Text>
    </TouchableOpacity>
  );
}

export default function CrystalPage({ title }: PageProps) {
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal>(crystals[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      
      <View style={styles.viewerSection}>
        <CrystalViewer key={selectedCrystal.id} crystal={selectedCrystal} />
        <Text style={styles.selectedTitle}>{selectedCrystal.zodiac} - {selectedCrystal.name}</Text>
      </View>

      <View style={styles.listSection}>
        <FlatList
          data={crystals}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CrystalCard
              crystal={item}
              isSelected={selectedCrystal.id === item.id}
              onPress={() => setSelectedCrystal(item)}
            />
          )}
        />
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  viewerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerContainer: {
    width: width - 40,
    height: width - 40,
    maxWidth: 350,
    maxHeight: 350,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  glView: {
    flex: 1,
  },
  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 245, 245, 0.9)',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  selectedTitle: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    marginTop: 16,
  },
  listSection: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  cardSelected: {
    backgroundColor: '#000',
  },
  textSelected: {
    color: '#fff',
  },
  zodiacText: {
    fontFamily: Platform.select({
      web: 'Georgia, serif',
      default: 'Lancelot_400Regular',
    }),
    fontSize: 14,
    color: '#666',
  },
  crystalName: {
    fontFamily: Platform.select({
      web: 'system-ui, sans-serif',
      default: undefined,
    }),
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
});
