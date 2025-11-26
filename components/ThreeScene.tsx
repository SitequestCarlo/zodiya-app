import React, { useRef, useEffect } from 'react';
import { StyleSheet, Platform, PanResponder, View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function ThreeScene() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // PanResponder for iOS/Android touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDraggingRef.current = true;
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;
        targetRotationRef.current.y += dx * 0.001;
        targetRotationRef.current.x += dy * 0.001;
      },
      onPanResponderRelease: () => {
        isDraggingRef.current = false;
      },
      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
      },
    })
  ).current;

  const onContextCreate = async (gl: any) => {
    // Create renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create geometry - a dodecahedron with wireframe
    const geometry = new THREE.DodecahedronGeometry(1.5, 0);
    
    // Create materials
    const material = new THREE.MeshPhongMaterial({
      color: 0xf5f5f5,
      emissive: 0x222222,
      specular: 0xaaaaaa,
      shininess: 30,
      flatShading: true,
    });

    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
    });

    // Create meshes
    const mesh = new THREE.Mesh(geometry, material);
    const wireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      wireframeMaterial
    );

    mesh.add(wireframe);
    scene.add(mesh);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x808080, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // Web-only touch/mouse controls
    if (Platform.OS === 'web') {
      let isDragging = false;
      let previousTouch = { x: 0, y: 0 };

      // Handle mouse events for orbit controls
      const handleMouseDown = (event: MouseEvent) => {
        isDragging = true;
        isDraggingRef.current = true;
        previousTouch = { x: event.clientX, y: event.clientY };
        event.preventDefault();
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging) return;
        
        const deltaX = event.clientX - previousTouch.x;
        const deltaY = event.clientY - previousTouch.y;

        targetRotationRef.current.y += deltaX * 0.01;
        targetRotationRef.current.x += deltaY * 0.01;

        previousTouch = { x: event.clientX, y: event.clientY };
        event.preventDefault();
      };

      const handleMouseUp = () => {
        isDragging = false;
        isDraggingRef.current = false;
      };

      // Handle touch events for orbit controls
      const handleTouchStart = (event: TouchEvent) => {
        if (event.touches.length > 0) {
          isDragging = true;
          isDraggingRef.current = true;
          previousTouch = { 
            x: event.touches[0].clientX, 
            y: event.touches[0].clientY 
          };
          event.preventDefault();
        }
      };

      const handleTouchMove = (event: TouchEvent) => {
        if (!isDragging || event.touches.length === 0) return;
        
        const touch = event.touches[0];
        const deltaX = touch.clientX - previousTouch.x;
        const deltaY = touch.clientY - previousTouch.y;

        targetRotationRef.current.y += deltaX * 0.01;
        targetRotationRef.current.x += deltaY * 0.01;

        previousTouch = { x: touch.clientX, y: touch.clientY };
        event.preventDefault();
      };

      const handleTouchEnd = () => {
        isDragging = false;
        isDraggingRef.current = false;
      };

      const canvas = gl.canvas;
      if (canvas) {
        // Mouse events
        canvas.addEventListener('mousedown', handleMouseDown as any);
        canvas.addEventListener('mousemove', handleMouseMove as any);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseUp);
        
        // Touch events
        canvas.addEventListener('touchstart', handleTouchStart as any, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove as any, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);
        
        // Prevent context menu on right-click
        canvas.addEventListener('contextmenu', (e: Event) => e.preventDefault());
      }
    }

    // Animation loop
    const render = () => {
      timeoutRef.current = setTimeout(() => {
        requestAnimationFrame(render);

        // Smooth rotation interpolation
        rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1;
        rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1;

        mesh.rotation.x = rotationRef.current.x;
        mesh.rotation.y = rotationRef.current.y;

        // Auto-rotate slowly if not dragging
        if (!isDraggingRef.current) {
          targetRotationRef.current.y += 0.005;
        }

        renderer.render(scene, camera);
        gl.endFrameEXP();
      }, 1000 / 60);
    };

    render();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container} {...(Platform.OS !== 'web' ? panResponder.panHandlers : {})}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  glView: {
    flex: 1,
  },
});
