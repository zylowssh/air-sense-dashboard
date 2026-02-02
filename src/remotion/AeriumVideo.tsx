import { Sequence, Audio } from "remotion";
import { IntroductionScene } from "./compositions/IntroductionScene";
import { ProblemScene } from "./compositions/ProblemScene";
import { SolutionScene } from "./compositions/SolutionScene";
import { ObjectiveScene } from "./compositions/ObjectiveScene";
import { HowItWorksScene } from "./compositions/HowItWorksScene";
import { FeaturesScene } from "./compositions/FeaturesScene";
import { TechStackScene } from "./compositions/TechStackScene";
import { UseCasesScene } from "./compositions/UseCasesScene";
import { ConclusionScene } from "./compositions/ConclusionScene";
import { aeriumScript } from "./script";

// Main video composition that combines all scenes following the Aerium script
export const AeriumVideo: React.FC = () => {
  let currentFrame = 0;

  const scenes = [
    { Component: IntroductionScene, frames: 180 },
    { Component: ProblemScene, frames: 150 },
    { Component: SolutionScene, frames: 180 },
    { Component: ObjectiveScene, frames: 150 },
    { Component: HowItWorksScene, frames: 180 },
    { Component: FeaturesScene, frames: 150 },
    { Component: TechStackScene, frames: 180 },
    { Component: UseCasesScene, frames: 150 },
    { Component: ConclusionScene, frames: 180 },
  ];

  return (
    <>
      {/* Background audio track: plays throughout the entire video */}
      <Audio
        src="/cylinder-two.mp3"
        startFrom={0}
        endAt={AERIUM_VIDEO_DURATION}
      />

      {scenes.map(({ Component, frames }, index) => {
        const from = currentFrame;
        currentFrame += frames;
        return (
          <Sequence key={index} from={from} durationInFrames={frames}>
            <Component />
          </Sequence>
        );
      })}
    </>
  );
};

// Total duration: 1500 frames = 50 seconds at 30fps
export const AERIUM_VIDEO_DURATION = 1500;
