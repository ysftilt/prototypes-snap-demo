import StreamPanel from "./StreamPanel";

export default function StepOne({ config, onNext }) {
  return <StreamPanel onSnap={onNext} />;
}
