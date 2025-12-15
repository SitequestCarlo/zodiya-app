import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity, Dimensions, Animated, Easing, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer, loadAsync } from 'expo-three';
import * as THREE from 'three';
import { Asset } from 'expo-asset';
import { GLTFLoader } from 'three-stdlib';

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
  dateRange: string;
  description: string;
  origin: string;
}

const crystals: Crystal[] = [
  { 
    id: 'widder', 
    name: 'Granat', 
    zodiac: 'Widder', 
    model: require('../assets/models/original/widder_granat.glb'), 
    texture: require('../assets/models/widder-granat/baseColor.jpg'),
    dateRange: '21. März – 20. April',
    description: 'Der Granat steht für Energie, Leidenschaft und Mut – Eigenschaften, die den Widder perfekt beschreiben. Er stärkt Tatkraft und Entschlossenheit, besonders in neuen Lebensphasen.',
    origin: 'Granat ist ein Sammelbegriff für verschiedene Mineralgruppen, meist tiefrot oder weinrot. Vorkommen finden sich in Indien, Madagaskar und den USA. Der Stein ist hart, glänzend und symbolisiert seit Jahrhunderten Lebenskraft.'
  },
  { 
    id: 'stier', 
    name: 'Rosenquarz', 
    zodiac: 'Stier', 
    model: require('../assets/models/original/Stier_Rosenquarz.glb'), 
    texture: require('../assets/models/stier-rosenquarz/baseColor.jpg'),
    dateRange: '21. April – 20. Mai',
    description: 'Der Rosenquarz harmoniert mit der sinnlichen, erdverbundenen Natur des Stiers. Er symbolisiert Liebe, Selbstfürsorge und innere Ruhe – Werte, die Stiere besonders schätzen.',
    origin: 'Rosenquarz zeigt zarte Rosa-Töne und wird vor allem in Brasilien, Madagaskar und Mosambik gefunden. Er zählt zu den Quarzen und gilt als Symbol für Herzenskraft und Mitgefühl.'
  },
  { 
    id: 'zwilling', 
    name: 'Citrin', 
    zodiac: 'Zwilling', 
    model: require('../assets/models/original/Zwilling_Citrine_Crystal.glb'), 
    texture: require('../assets/models/zwilling-citrine-crystal/baseColor.jpg'),
    dateRange: '21. Mai – 21. Juni',
    description: 'Der Citrin fördert Kreativität, Leichtigkeit und geistige Beweglichkeit. Er unterstützt Zwillinge dabei, ihre Vielseitigkeit und kommunikative Stärke mit Optimismus zu verbinden.',
    origin: 'Citrin ist ein goldgelber Quarz, der in Brasilien, Madagaskar und Spanien vorkommt. Sein Name leitet sich vom französischen „citron" (Zitrone) ab – passend zu seiner warmen, sonnigen Farbe.'
  },
  { 
    id: 'krebs', 
    name: 'Mondstein', 
    zodiac: 'Krebs', 
    model: require('../assets/models/original/Krebs_adularia.glb'), 
    texture: require('../assets/models/krebs-adularia/baseColor.jpg'),
    dateRange: '22. Juni – 22. Juli',
    description: 'Der Mondstein spiegelt die emotionale Tiefe und Intuition des Krebses wider. Er stärkt Empathie und hilft, Gefühle im Gleichgewicht zu halten.',
    origin: 'Typisch ist der schimmernde, fast milchige Glanz (Adulareszenz). Fundorte liegen in Sri Lanka, Indien und Myanmar. Der Stein gilt als Symbol für Weiblichkeit und den natürlichen Zyklus.'
  },
  { 
    id: 'loewe', 
    name: 'Bernstein', 
    zodiac: 'Löwe', 
    model: require('../assets/models/original/Loewe_Bernstein.glb'), 
    texture: require('../assets/models/loewe-bernstein/baseColor_1.jpg'),
    dateRange: '23. Juli – 23. August',
    description: 'Bernstein steht für Lebensfreude, Wärme und Selbstvertrauen – genau die Eigenschaften, die den Löwen auszeichnen. Er unterstreicht Ausstrahlung und positive Energie.',
    origin: 'Bernstein ist kein Mineral, sondern fossiles Baumharz. Er stammt vor allem aus dem Ostseeraum, Polen und der Dominikanischen Republik. Die goldgelbe Farbe erinnert an Sonnenlicht und Energie.'
  },
  { 
    id: 'jungfrau', 
    name: 'Amazonit', 
    zodiac: 'Jungfrau', 
    model: require('../assets/models/original/Jungfrau_amazonite.glb'), 
    texture: require('../assets/models/jungfrau-amazonite/baseColor.jpg'),
    dateRange: '24. August – 23. September',
    description: 'Der Amazonit bringt Ruhe und Ausgeglichenheit in den analytischen Geist der Jungfrau. Er hilft, Perfektionismus zu mildern und Intuition stärker wahrzunehmen.',
    origin: 'Der türkisgrüne Feldspat wird in Russland, Brasilien und den USA gefunden. Sein dezenter Schimmer verleiht ihm eine elegante, beruhigende Ausstrahlung.'
  },
  { 
    id: 'waage', 
    name: 'Lapislazuli', 
    zodiac: 'Waage', 
    model: require('../assets/models/original/Waage_Lapislazuli.glb'), 
    texture: require('../assets/models/waage-lapislazuli/baseColor_1.jpg'),
    dateRange: '24. September – 23. Oktober',
    description: 'Lapislazuli fördert Harmonie, Klarheit und Wahrheit – Themen, die für Waagen zentral sind. Er unterstützt sie, Entscheidungen im Einklang mit Herz und Verstand zu treffen.',
    origin: 'Das tiefblaue Gestein mit goldenen Pyrit-Einschlüssen stammt vor allem aus Afghanistan und Chile. Es wurde schon im alten Ägypten als Symbol für Weisheit und Schönheit verehrt.'
  },
  { 
    id: 'skorpion', 
    name: 'Obsidian', 
    zodiac: 'Skorpion', 
    model: require('../assets/models/original/Skorpion_obsidian.glb'), 
    texture: require('../assets/models/skorpion-obsidian/baseColor_1.jpg'),
    dateRange: '24. Oktober – 22. November',
    description: 'Der Obsidian symbolisiert Tiefgang, Schutz und Transformation – Qualitäten, die zum intensiven, ehrlichen Wesen des Skorpions passen. Er hilft, innere Stärke bewusst zu leben.',
    origin: 'Obsidian ist ein vulkanisches Glas, das bei der schnellen Abkühlung von Lava entsteht. Funde gibt es in Mexiko, Island und Armenien. Die glänzende, schwarze Oberfläche wirkt kraftvoll und geheimnisvoll.'
  },
  { 
    id: 'schuetze', 
    name: 'Türkis', 
    zodiac: 'Schütze', 
    model: require('../assets/models/original/Schuetze_Tuerkis.glb'), 
    texture: require('../assets/models/schuetze-tuerkis/baseColor.jpg'),
    dateRange: '23. November – 21. Dezember',
    description: 'Türkis steht für Abenteuerlust, Freiheit und Inspiration. Er begleitet Schütz:innen auf der Suche nach neuen Horizonten und bewahrt dabei innere Balance.',
    origin: 'Türkis ist ein himmelblauer bis grünlicher Kupfer-Aluminium-Phosphat-Stein. Vorkommen finden sich in Iran, USA und Tibet. Er gehört zu den ältesten bekannten Schmucksteinen.'
  },
  { 
    id: 'steinbock', 
    name: 'Onyx', 
    zodiac: 'Steinbock', 
    model: require('../assets/models/original/steinbock_onyx.glb'), 
    texture: require('../assets/models/steinbock-onyx/baseColor.jpg'),
    dateRange: '22. Dezember – 20. Januar',
    description: 'Der Onyx stärkt Disziplin, Fokus und Durchhaltevermögen – Tugenden, die den Steinbock prägen. Er hilft, Ziele klar zu verfolgen und Ruhe in Verantwortung zu finden.',
    origin: 'Onyx ist eine schwarze, fein gebänderte Varietät des Chalcedons. Fundorte liegen in Brasilien, Indien und Uruguay. Er symbolisiert Stabilität und innere Stärke.'
  },
  { 
    id: 'wassermann', 
    name: 'Amethyst', 
    zodiac: 'Wassermann', 
    model: require('../assets/models/original/Wassermann_amethyst.glb'), 
    texture: require('../assets/models/wassermann-amethyst/baseColor.jpg'),
    dateRange: '21. Januar – 19. Februar',
    description: 'Der Amethyst fördert geistige Klarheit und Intuition – beides kennzeichnet den visionären Wassermann. Er unterstützt kreatives Denken und innere Ruhe.',
    origin: 'Der violette Quarz entsteht in Hohlräumen vulkanischer Gesteine. Er wird in Brasilien, Uruguay und Russland gewonnen. Seine Farbe reicht von zartem Flieder bis zu tiefem Purpur.'
  },
  { 
    id: 'fische', 
    name: 'Aquamarin', 
    zodiac: 'Fische', 
    model: require('../assets/models/original/Fische_aquamarine.glb'), 
    texture: require('../assets/models/fische-aquamarine/baseColor_1.jpg'),
    dateRange: '20. Februar – 20. März',
    description: 'Der Aquamarin spiegelt die emotionale, verträumte Natur der Fische wider. Er steht für Gelassenheit, Vertrauen und die Fähigkeit, sich dem Fluss des Lebens hinzugeben.',
    origin: 'Der klare, blaugrüne Beryll wird in Brasilien, Pakistan und Madagaskar gefunden. Sein Name bedeutet „Meerwasser" – und genau so ruhig und rein wirkt er auch.'
  },
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

    // Load GLB model
    console.log('[CrystalViewer] Starting to load model for:', crystal.name);
    try {
      // Download model and texture assets
      const modelAsset = Asset.fromModule(crystal.model);
      const textureAsset = Asset.fromModule(crystal.texture);
      
      await Promise.all([
        modelAsset.downloadAsync(),
        textureAsset.downloadAsync()
      ]);
      
      console.log('[CrystalViewer] Assets downloaded');
      console.log('[CrystalViewer] Model URI:', modelAsset.localUri);
      console.log('[CrystalViewer] Texture URI:', textureAsset.localUri);
      
      // Load texture via expo-three
      let texture: THREE.Texture | null = null;
      try {
        texture = await loadAsync(textureAsset) as THREE.Texture;
        if (texture) {
          texture.flipY = false;
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;
          console.log('[CrystalViewer] Texture loaded successfully');
        }
      } catch (texError) {
        console.log('[CrystalViewer] Could not load texture:', texError);
      }
      
      // Load GLB file using fetch + GLTFLoader.parse
      let model: THREE.Object3D | null = null;
      
      try {
        console.log('[CrystalViewer] Fetching GLB file...');
        const response = await fetch(modelAsset.localUri!);
        const arrayBuffer = await response.arrayBuffer();
        console.log('[CrystalViewer] GLB fetched, size:', arrayBuffer.byteLength);
        
        const loader = new GLTFLoader();
        const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
          loader.parse(
            arrayBuffer,
            '',
            (result) => {
              console.log('[CrystalViewer] GLTFLoader.parse success');
              resolve(result);
            },
            (error) => {
              console.error('[CrystalViewer] GLTFLoader.parse error:', error);
              reject(error);
            }
          );
        });
        
        model = gltf.scene;
        console.log('[CrystalViewer] Model loaded from GLB');
        
        // Replace all materials with our own using the separately loaded texture
        // This bypasses the blob texture loading issue in React Native
        model.traverse((child: any) => {
          if (child.isMesh) {
            const newMaterial = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              metalness: 0.2,
              roughness: 0.5,
              side: THREE.DoubleSide,
            });
            if (texture) {
              newMaterial.map = texture;
            }
            child.material = newMaterial;
          }
        });
        console.log('[CrystalViewer] Applied texture to model meshes');
      } catch (glbError) {
        console.error('[CrystalViewer] GLB loading failed:', glbError);
      }
      
      // Fallback to octahedron if GLB failed
      if (!model) {
        console.log('[CrystalViewer] Using fallback geometry');
        const geometry = new THREE.OctahedronGeometry(1, 0);
        const material = new THREE.MeshStandardMaterial({
          color: texture ? 0xffffff : 0xff69b4,
          metalness: 0.3,
          roughness: 0.4,
          transparent: true,
          opacity: 0.95,
          side: THREE.DoubleSide,
        });
        if (texture) {
          material.map = texture;
        }
        model = new THREE.Mesh(geometry, material);
      }
      
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.viewerSection}>
          <Text style={styles.selectedTitle}>{selectedCrystal.zodiac} – {selectedCrystal.name}</Text>
          <Text style={styles.dateRange}>{selectedCrystal.dateRange}</Text>
          <CrystalViewer key={selectedCrystal.id} crystal={selectedCrystal} />

        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>{selectedCrystal.description}</Text>
          <Text style={styles.originText}>{selectedCrystal.origin}</Text>
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
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
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
  dateRange: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      default: undefined,
    }),
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  descriptionSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  descriptionText: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      default: undefined,
    }),
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  originText: {
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, sans-serif',
      default: undefined,
    }),
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
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
