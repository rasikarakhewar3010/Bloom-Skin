import React from "react";
import { Timeline } from "@/components/ui/timeline";

const Steps = () => {
  const data = [
    {
      title: "Step 1: Your Skin Profile",
      content: (
        <div>
          <p className="mb-6 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Start by completing your <b>Skin Quiz</b>. We analyze your skin type, current environment, and primary concerns to personalize every recommendation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">📝</span>
              <h4 className="font-bold text-pink-600 mb-2">Personalized Baseline</h4>
              <p className="text-xs text-gray-500">Your routine is uniquely yours, built from your profile data.</p>
            </div>
            <img
              src="/images/snapshot.png"
              alt="snapshot"
              className="h-40 w-full rounded-2xl object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Precision AI Scan",
      content: (
        <div>
          <p className="mb-6 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Use our <b>Camera Guide</b> to take a clear, well-lit photo. Our AI identifies specific conditions like Blackheads, Papules, or Pustules with high accuracy.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/steo2[1].png"
              alt="step 2"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/images/step2[2].jpeg"
              alt="step 2"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
          <p className="mt-4 text-xs italic text-gray-400">Pro tip: Align your face within the guide for the most accurate results.</p>
        </div>
      ),
    },
    {
      title: "Step 3: Daily Habits & Streaks",
      content: (
        <div>
          <p className="mb-6 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Get your auto-generated routine and <b>Check off</b> your AM and PM steps. Maintain your streak to see consistent improvement in your skin health.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">🔥</span>
              <h4 className="font-bold text-teal-600 mb-2">Build Your Streak</h4>
              <p className="text-xs text-gray-500">Consistency is key. Track your daily routine to stay on top of your goals.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">🗓️</span>
              <h4 className="font-bold text-gray-800 mb-2">Daily Reminders</h4>
              <p className="text-xs text-gray-500">A structured routine designed by AI, tracked by you.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Step 4: Visualize Progress",
      content: (
        <div>
          <p className="mb-6 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Compare your journey with our <b>Before & After slider</b> and track your <b>Bloom Score</b>. Watch your progress unfold over weeks of consistent care.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/Dashobard.png"
              alt="history 1"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/images/step3[[2]].png"
              alt="history 2"
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
};

export default Steps;
