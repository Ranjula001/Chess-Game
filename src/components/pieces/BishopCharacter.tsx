import type { PieceBodyProps } from "./piece-archetypes";

export function BishopCharacter({ palette, emphasis }: PieceBodyProps) {
  const emissive = 0.05 + emphasis * 0.07;

  return (
    <group>
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.12, 10]} />
        <meshStandardMaterial color={palette.metal} metalness={0.68} roughness={0.24} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.15, 0.64, 6, 10]} />
        <meshStandardMaterial color={palette.cloth} metalness={0.12} roughness={0.75} />
      </mesh>
      <mesh castShadow position={[0, 1.24, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={palette.skin} roughness={0.84} />
      </mesh>
      <mesh castShadow position={[0, 1.37, 0]}>
        <torusGeometry args={[0.18, 0.035, 12, 28]} />
        <meshStandardMaterial color={palette.metal} metalness={0.84} roughness={0.18} emissive={palette.glow} emissiveIntensity={emissive + 0.03} />
      </mesh>
      <mesh castShadow position={[0.24, 0.86, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.08, 0.34, 0.08]} />
        <meshStandardMaterial color={palette.armor} metalness={0.32} roughness={0.46} />
      </mesh>
      <mesh castShadow position={[0.32, 1.1, 0]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.026, 0.026, 1.04, 10]} />
        <meshStandardMaterial color={palette.metal} metalness={0.78} roughness={0.22} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0.34, 1.68, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={palette.glow} emissive={palette.glow} emissiveIntensity={0.4 + emphasis * 0.2} metalness={0.45} roughness={0.3} />
      </mesh>
    </group>
  );
}
