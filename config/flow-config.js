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
        title: "Talk about your product",
        subtitle: "Talking through details boosts accuracy.",
      },
    },
    {
      id: 3,
      title: "Snap Complete",
      description: "Review your snap result.",
      listingForm: {
        shortcuts: [
          { key: "Tab", label: "Edit" },
          { key: "Enter", label: "Resume" },
          { key: "Esc", label: "Cancel" },
        ],
        product: {
          title: "Vintage Air Jordan 1 Retro High OG",
          imageSrc: "/images/product-placeholder.png",
        },
        pricing: [
          { label: "Size", value: "10.5" },
          { label: "Starting", prefix: "$", value: "$220" },
          { label: "Reserve", prefix: "$", value: "$380" },
        ],
        countdown: {
          text: "Auction starts in 3s…",
          progress: 0.65,
        },
      },
    },
  ],
};

export default flowConfig;
