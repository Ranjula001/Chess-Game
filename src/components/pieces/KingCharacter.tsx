import type { PieceBodyProps } from "./piece-archetypes";

export function KingCharacter({ palette, emphasis }: PieceBodyProps) {
  const emissive = 0.05 + emphasis * 0.07;

  return (
    <group>
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.14, 10]} />
        <meshStandardMaterial color={palette.metal} metalness={0.74} roughness={0.2} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.18, 0.66, 6, 10]} />
        <meshStandardMaterial color={palette.armor} metalness={0.48} roughness={0.36} />
      </mesh>
      <mesh castShadow position={[0, 1.28, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={palette.skin} roughness={0.82} />
      </mesh>
      <mesh castShadow position={[0, 0.92, -0.18]}>
        <boxGeometry args={[0.42, 0.62, 0.08]} />
        <meshStandardMaterial color={palette.cloth} metalness={0.12} roughness={0.74} />
      </mesh>
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[0.2, 0.06, 0.06]} />
        <meshStandardMaterial color={palette.metal} metalness={0.88} roughness={0.16} emissive={palette.glow} emissiveIntensity={emissive + 0.02} />
      </mesh>
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[0.06, 0.22, 0.06]} />
        <meshStandardMaterial color={palette.metal} metalness={0.88} roughness={0.16} emissive={palette.glow} emissiveIntensity={emissive + 0.02} />
      </mesh>
      <mesh castShadow position={[0.3, 0.92, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.08, 0.32, 0.08]} />
        <meshStandardMaterial color={palette.armor} metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0.38, 1.2, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.88, 8]} />
        <meshStandardMaterial color={palette.metal} metalness={0.84} roughness={0.18} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0.38, 1.65, 0]}>
        <boxGeometry args={[0.1, 0.12, 0.1]} />
        <meshStandardMaterial color={palette.metal} metalness={0.9} roughness={0.14} emissive={palette.glow} emissiveIntensity={emissive + 0.04} />
      </mesh>
    </group>
  );
}
