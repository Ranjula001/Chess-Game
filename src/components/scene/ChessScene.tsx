"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { BoardStage } from "@/components/board/BoardStage";
import { PieceCharacter } from "@/components/pieces/PieceCharacter";
import { StageRig } from "@/components/scene/StageRig";
import { useChessGameStore } from "@/stores/useChessGameStore";

// The 3D scene reads orchestration state and never decides chess legality on its own.
export function ChessScene() {
  const snapshot = useChessGameStore((state) => state.snapshot);
  const scenePieces = useChessGameStore((state) => state.scenePieces);
  const activeAnimations = useChessGameStore((state) => state.activeAnimations);
  const selection = useChessGameStore((state) => state.selection);
  const hoveredSquare = useChessGameStore((state) => state.hoveredSquare);
  const legalTargets = useChessGameStore((state) => state.legalTargets);
  const captureTargets = useChessGameStore((state) => state.captureTargets);
  const isInputLocked = useChessGameStore((state) => state.isInputLocked);
  const handleSquareClick = useChessGameStore((state) => state.handleSquareClick);
  const setHoveredSquare = useChessGameStore((state) => state.setHoveredSquare);
  const clearSelection = useChessGameStore((state) => state.clearSelection);

  const checkSquare = snapshot.check ? snapshot.kingSquares[snapshot.turn] ?? undefined : undefined;
  const lastMove = snapshot.lastMove
    ? {
        from: snapshot.lastMove.from,
        to: snapshot.lastMove.to
      }
    : undefined;

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [7.8, 8.9, 7.8], fov: 43 }}
      gl={{ antialias: true }}
      onPointerMissed={() => {
        clearSelection();
      }}
    >
      <color attach="background" args={["#05070b"]} />
      <fog attach="fog" args={["#05070b", 9, 21]} />
      <ambientLight intensity={0.9} color="#a7b3c8" />
      <hemisphereLight intensity={0.42} color="#d9dfeb" groundColor="#080b11" />
      <directionalLight
        castShadow
        position={[4.8, 8.8, 5.2]}
        intensity={2.2}
        color="#ffd9b0"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={22}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-5, 5.5, -2.5]} intensity={0.45} color="#6e8fb6" />
      <Suspense fallback={null}>
        <StageRig snapshot={snapshot} />
        <BoardStage
          selectedSquare={selection}
          hoveredSquare={hoveredSquare}
          legalTargets={legalTargets}
          captureTargets={captureTargets}
          lastMove={lastMove}
          checkSquare={checkSquare}
          onSquareSelect={handleSquareClick}
          onSquareHover={setHoveredSquare}
        />
        <group position={[0, 0.07, 0]}>
          {scenePieces.map((piece) => (
            <PieceCharacter
              key={piece.id}
              piece={piece}
              animation={activeAnimations[piece.id]}
              isSelected={selection === piece.square}
              isThreatened={captureTargets.includes(piece.square)}
              isCheckedKing={piece.role === "king" && checkSquare === piece.square}
              isLastMoved={lastMove?.to === piece.square}
              interactive={!piece.pendingRemoval && !isInputLocked}
              onSelect={handleSquareClick}
              onHover={setHoveredSquare}
            />
          ))}
        </group>
        <ContactShadows position={[0, -0.46, 0]} opacity={0.55} scale={13} blur={2.6} far={7.5} />
      </Suspense>
    </Canvas>
  );
}



