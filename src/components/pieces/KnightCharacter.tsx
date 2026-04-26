import type { PieceBodyProps } from "./piece-archetypes";

export function KnightCharacter({ palette, emphasis }: PieceBodyProps) {
  const emissive = 0.05 + emphasis * 0.08;

  return (
    <group rotation={[0, 0.08, 0]}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.12, 10]} />
        <meshStandardMaterial color={palette.metal} metalness={0.68} roughness={0.26} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0, 0.62, -0.02]} rotation={[0.08, 0, 0]}>
        <capsuleGeometry args={[0.16, 0.56, 6, 10]} />
        <meshStandardMaterial color={palette.armor} metalness={0.42} roughness={0.42} />
      </mesh>
      <mesh castShadow position={[0, 1.18, -0.03]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={palette.skin} roughness={0.82} />
      </mesh>
      <mesh castShadow position={[-0.02, 0.84, -0.19]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.34, 0.52, 0.08]} />
        <meshStandardMaterial color={palette.cloth} metalness={0.15} roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0.26, 0.82, 0]} rotation={[0, 0, -0.44]}>
        <boxGeometry args={[0.08, 0.38, 0.08]} />
        <meshStandardMaterial color={palette.armor} metalness={0.38} roughness={0.45} />
      </mesh>
      <mesh castShadow position={[0.42, 1.04, 0.02]} rotation={[0, 0, 0.36]}>
        <cylinderGeometry args={[0.022, 0.022, 0.94, 8]} />
        <meshStandardMaterial color={palette.metal} metalness={0.82} roughness={0.18} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0.58, 1.44, 0.02]} rotation={[0, 0, 0.36]}>
        <boxGeometry args={[0.04, 0.36, 0.08]} />
        <meshStandardMaterial color={palette.metal} metalness={0.9} roughness={0.16} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
    </group>
  );
}
