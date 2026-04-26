"use client";

import type { PerspectiveCamera } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { MathUtils, Vector3 } from "three";

import type { ChessSnapshot } from "@/features/chess/types/chess";

export function StageRig({ snapshot }: { snapshot: ChessSnapshot }) {
  const { camera } = useThree();
  const calm = useMemo(() => new Vector3(7.8, 8.9, 7.8), []);
  const alert = useMemo(() => new Vector3(7.2, 8.2, 6.6), []);
  const finale = useMemo(() => new Vector3(6.6, 7.4, 5.8), []);
  const lookAt = useMemo(() => new Vector3(0, 0.5, 0), []);

  useFrame(() => {
    const target = snapshot.checkmate ? finale : snapshot.check ? alert : calm;
    const perspectiveCamera = camera as PerspectiveCamera;

    perspectiveCamera.position.lerp(target, snapshot.checkmate ? 0.04 : 0.03);
    perspectiveCamera.lookAt(lookAt);
    perspectiveCamera.fov = MathUtils.lerp(
      perspectiveCamera.fov,
      snapshot.checkmate ? 39 : snapshot.check ? 41 : 43,
      0.04
    );
    perspectiveCamera.updateProjectionMatrix();
  });

  return null;
}
