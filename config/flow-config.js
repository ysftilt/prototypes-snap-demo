const flowConfig = {
  steps: [
    {
      id: 1,
      title: "Stream Panel",
      description: "Camera view — tap Snap to capture.",
    },
    {
      id: 2,
      title: "Processing Snap",
      description: "Analyzing your capture...",
      countdownStart: 3,
      promptBanner: {
        title: "Talk, then Snap",
        subtitle: "Talking through details boosts accuracy.",
      },
    },
    {
      id: 3,
      title: "Snap Complete",
      description: "Review your snap result.",
    },
  ],
};

export default flowConfig;
