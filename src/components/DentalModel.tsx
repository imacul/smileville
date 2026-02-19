import { useRef, useLayoutEffect } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

export function DentalModel() {
    const { scene } = useGLTF('/dental_mold_3d_scan.glb', '/draco-gltf/');
    const ref = useRef<THREE.Group>(null);

    useLayoutEffect(() => {
        const materialSettings = {
            color: '#D4DEE9',
            roughness: 0.8,
            metalness: 0.0,
        };

        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const oldMaterial = mesh.material;
                mesh.geometry.computeVertexNormals();
                mesh.geometry.normalizeNormals();
                mesh.material = new THREE.MeshStandardMaterial(materialSettings);
                if (Array.isArray(oldMaterial)) {
                    oldMaterial.forEach((material) => material.dispose());
                } else {
                    oldMaterial.dispose();
                }
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <Center top>
            <primitive object={scene} ref={ref} />
        </Center>
    );
}

useGLTF.setDecoderPath('/draco-gltf/');
useGLTF.preload('/dental_mold_3d_scan.glb', '/draco-gltf/');
