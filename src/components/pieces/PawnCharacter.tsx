import type { PieceBodyProps } from "./piece-archetypes";

export function PawnCharacter({ palette, emphasis }: PieceBodyProps) {
  const emissive = 0.04 + emphasis * 0.05;

  return (
    <group>
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.12, 10]} />
        <meshStandardMaterial color={palette.metal} metalness={0.65} roughness={0.28} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0, 0.58, 0]}>
        <capsuleGeometry args={[0.14, 0.42, 6, 10]} />
        <meshStandardMaterial color={palette.armor} metalness={0.35} roughness={0.48} />
      </mesh>
      <mesh castShadow position={[0, 1.12, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={palette.skin} roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0.24, 0.82, 0.02]} rotation={[0, 0, -0.22]}>
        <boxGeometry args={[0.08, 0.34, 0.08]} />
        <meshStandardMaterial color={palette.armor} metalness={0.25} roughness={0.52} />
      </mesh>
      <mesh castShadow position={[0.31, 1.12, 0.02]} rotation={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.025, 0.025, 0.82, 8]} />
        <meshStandardMaterial color={palette.metal} metalness={0.75} roughness={0.25} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0.33, 1.56, 0.02]} rotation={[0, 0, 0.06]}>
        <coneGeometry args={[0.06, 0.18, 8]} />
        <meshStandardMaterial color={palette.metal} metalness={0.8} roughness={0.22} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
    </group>
  );
}
