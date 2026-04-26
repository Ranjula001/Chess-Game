import type { PieceBodyProps } from "./piece-archetypes";

export function RookCharacter({ palette, emphasis }: PieceBodyProps) {
  const emissive = 0.04 + emphasis * 0.06;

  return (
    <group>
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.14, 8]} />
        <meshStandardMaterial color={palette.metal} metalness={0.72} roughness={0.24} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0, 0.64, 0]}>
        <boxGeometry args={[0.42, 0.58, 0.28]} />
        <meshStandardMaterial color={palette.armor} metalness={0.44} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 1.16, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={palette.skin} roughness={0.83} />
      </mesh>
      <mesh castShadow position={[0, 0.98, 0.18]}>
        <boxGeometry args={[0.5, 0.46, 0.08]} />
        <meshStandardMaterial color={palette.metal} metalness={0.78} roughness={0.2} emissive={palette.glow} emissiveIntensity={emissive + 0.02} />
      </mesh>
      <mesh castShadow position={[0.3, 0.78, 0]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.1, 0.34, 0.1]} />
        <meshStandardMaterial color={palette.armor} metalness={0.4} roughness={0.42} />
      </mesh>
      <mesh castShadow position={[0, 1.42, 0]}>
        <boxGeometry args={[0.46, 0.14, 0.32]} />
        <meshStandardMaterial color={palette.metal} metalness={0.8} roughness={0.18} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
    </group>
  );
}
