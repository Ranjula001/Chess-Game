import type { PieceBodyProps } from "./piece-archetypes";

export function QueenCharacter({ palette, emphasis }: PieceBodyProps) {
  const emissive = 0.06 + emphasis * 0.09;

  return (
    <group>
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.2, 0.26, 0.14, 10]} />
        <meshStandardMaterial color={palette.metal} metalness={0.72} roughness={0.2} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0, 0.72, 0]}>
        <capsuleGeometry args={[0.16, 0.72, 6, 10]} />
        <meshStandardMaterial color={palette.cloth} metalness={0.18} roughness={0.62} />
      </mesh>
      <mesh castShadow position={[0, 1.28, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={palette.skin} roughness={0.84} />
      </mesh>
      <mesh castShadow position={[0, 1.48, 0]}>
        <torusGeometry args={[0.16, 0.03, 10, 24]} />
        <meshStandardMaterial color={palette.metal} metalness={0.85} roughness={0.16} emissive={palette.glow} emissiveIntensity={emissive + 0.04} />
      </mesh>
      <mesh castShadow position={[0.14, 1.62, 0]}>
        <coneGeometry args={[0.05, 0.18, 6]} />
        <meshStandardMaterial color={palette.metal} metalness={0.86} roughness={0.16} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0, 1.66, 0]}>
        <coneGeometry args={[0.05, 0.2, 6]} />
        <meshStandardMaterial color={palette.metal} metalness={0.86} roughness={0.16} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[-0.14, 1.62, 0]}>
        <coneGeometry args={[0.05, 0.18, 6]} />
        <meshStandardMaterial color={palette.metal} metalness={0.86} roughness={0.16} emissive={palette.glow} emissiveIntensity={emissive} />
      </mesh>
      <mesh castShadow position={[0.32, 0.92, 0.02]} rotation={[0, 0, 0.22]}>
        <boxGeometry args={[0.05, 0.64, 0.08]} />
        <meshStandardMaterial color={palette.metal} metalness={0.9} roughness={0.15} emissive={palette.glow} emissiveIntensity={emissive + 0.02} />
      </mesh>
      <mesh castShadow position={[-0.32, 0.92, 0.02]} rotation={[0, 0, -0.22]}>
        <boxGeometry args={[0.05, 0.64, 0.08]} />
        <meshStandardMaterial color={palette.metal} metalness={0.9} roughness={0.15} emissive={palette.glow} emissiveIntensity={emissive + 0.02} />
      </mesh>
    </group>
  );
}
