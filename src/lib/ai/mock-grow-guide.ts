import type {
  GrowGuidePlanRequest,
  GrowGuidePlanResponse,
  GrowGuideQuestionRequest,
  GrowGuideQuestionResponse,
} from "./types";

/**
 * Mock AI Grow Guide — generates a grow plan and answers grow questions.
 */

export async function generateGrowPlan(
  req: GrowGuidePlanRequest
): Promise<GrowGuidePlanResponse> {
  await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500));

  const basePlan: GrowGuidePlanResponse = {
    stages: [
      {
        name: "Setup",
        durationDays: 2,
        description: `Prepare your ${req.startType} planting setup for ${req.plantName}. Gather materials and create the ideal environment.`,
        tasks: [
          "Choose a clean container with drainage holes.",
          "Fill with seed-starting mix or appropriate potting soil.",
          "Moisten the soil evenly before planting.",
          `Place ${req.startType === "seed" ? "seeds 1/4 inch deep" : req.startType === "cutting" ? "cutting 2 inches deep" : req.startType === "bulb_tuber" ? "bulb pointed-side up, 2 inches deep" : "seedling at the same depth as original container"}.`,
        ],
      },
      {
        name: "Germination",
        durationDays: req.startType === "seed" ? 10 : 5,
        description: "Keep conditions warm and moist. Watch for the first signs of growth.",
        tasks: [
          "Maintain soil moisture — mist daily.",
          "Keep temperature at 65-75°F (18-24°C).",
          "Cover with plastic wrap to maintain humidity.",
          "Place in a warm spot with indirect light.",
          "Check daily for signs of sprouting.",
        ],
      },
      {
        name: "Sprout",
        durationDays: 7,
        description: "Your first sprouts have appeared! Provide gentle light and continue moisture.",
        tasks: [
          "Remove plastic cover once sprouts appear.",
          "Move to bright, indirect light.",
          "Water gently — avoid disturbing roots.",
          "Take your first sprout photo! 📸",
        ],
      },
      {
        name: "Seedling",
        durationDays: 14,
        description: "Seedlings are developing true leaves. Strengthen them with proper care.",
        tasks: [
          "Gradually increase light exposure.",
          "Begin very light fertilizing (quarter-strength).",
          "Thin seedlings if multiple grew in same spot.",
          "Rotate container for even growth.",
          "Monitor for any signs of damping off.",
        ],
      },
      {
        name: "Pot Transfer",
        durationDays: 3,
        description: "Time to give your growing plant a bigger home.",
        tasks: [
          "Choose a pot 1-2 inches larger than current container.",
          "Use appropriate potting mix for the species.",
          "Carefully remove seedling with root ball intact.",
          "Plant at the same depth — don't bury the stem.",
          "Water thoroughly after transplanting.",
          "Keep in shade for 2-3 days to recover.",
        ],
      },
      {
        name: "Young Plant",
        durationDays: 21,
        description: "Your plant is establishing in its new pot. Regular care routine begins.",
        tasks: [
          "Establish a regular watering schedule.",
          "Begin half-strength fertilizing every 2 weeks.",
          "Monitor for pests.",
          "Prune any leggy or damaged growth.",
          "Take weekly progress photos.",
        ],
      },
      {
        name: "Mature Plant",
        durationDays: 30,
        description: `Congratulations! Your ${req.plantName} is now a mature, established plant.`,
        tasks: [
          "Continue regular care routine.",
          "Full-strength fertilizing on schedule.",
          "Repot annually or when rootbound.",
          "Share your success with the community! 🎉",
        ],
      },
    ],
    tips: [
      `${req.plantName} typically thrives in bright, indirect light.`,
      "Consistency is key — stick to a regular care schedule.",
      "Take photos at each stage to track your progress.",
      "Don't be discouraged by setbacks — every gardener has them!",
      "Join the community to ask questions and share tips.",
    ],
    estimatedTotalDays: 0,
  };

  basePlan.estimatedTotalDays = basePlan.stages.reduce(
    (sum, s) => sum + s.durationDays,
    0
  );

  return basePlan;
}

export async function answerGrowQuestion(
  req: GrowGuideQuestionRequest
): Promise<GrowGuideQuestionResponse> {
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

  const q = req.question.toLowerCase();

  if (q.includes("water") || q.includes("watering")) {
    return {
      answer: `During the ${req.currentStage} stage (day ${req.dayNumber}), your ${req.plantName} needs consistent but gentle watering. Check soil moisture by pressing your finger 1 inch into the soil — water only when it feels dry. Avoid overwatering as young plants are susceptible to root rot.`,
      relatedTips: [
        "Use room-temperature water.",
        "Water in the morning for best absorption.",
        "Bottom watering can help prevent overwatering.",
      ],
    };
  }

  if (q.includes("light") || q.includes("sun")) {
    return {
      answer: `At the ${req.currentStage} stage, your ${req.plantName} needs bright, indirect light for 6-8 hours daily. Avoid direct afternoon sun which can scorch young leaves. A north or east-facing window is ideal.`,
      relatedTips: [
        "Rotate the plant every few days for even growth.",
        "If natural light is limited, consider a grow light.",
        "Watch for signs of too much light: bleached or crispy leaves.",
      ],
    };
  }

  if (q.includes("fertiliz") || q.includes("feed")) {
    return {
      answer: `At day ${req.dayNumber} in the ${req.currentStage} stage, start with a very diluted fertilizer (1/4 strength) once every two weeks. As the plant matures, gradually increase to half strength. Avoid fertilizing newly transplanted plants for 2 weeks.`,
      relatedTips: [
        "Use a balanced liquid fertilizer (e.g., 10-10-10).",
        "Never fertilize dry soil — water first.",
        "Yellow lower leaves may indicate nitrogen deficiency.",
      ],
    };
  }

  // Default response
  return {
    answer: `Great question about your ${req.plantName} at the ${req.currentStage} stage! At day ${req.dayNumber}, the most important things are consistent moisture, adequate light, and patience. Each plant grows at its own pace, so don't worry if progress seems slow.`,
    relatedTips: [
      "Keep a growing journal to track changes.",
      "Take regular photos to see progress over time.",
      "Check the community for advice from experienced growers.",
    ],
  };
}
