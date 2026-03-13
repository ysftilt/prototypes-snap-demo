/*
 * page.js — Home Page
 *
 * This is the entry point for the app. It simply renders the Flow
 * component, which handles all the step logic.
 */

import Flow from "@/components/Flow";
import { SpeedProvider } from "@/components/debug/SpeedContext";

export default function Home() {
  return (
    <SpeedProvider>
      <Flow />
    </SpeedProvider>
  );
}
