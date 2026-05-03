import type {
  PlantDoctorRequest,
  PlantDoctorResponse,
} from "./types";

/**
 * Mock AI Plant Doctor — returns curated responses based on keyword matching.
 */
export async function diagnose(req: PlantDoctorRequest): Promise<PlantDoctorResponse> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

  const symptoms = req.symptoms.toLowerCase();

  if (symptoms.includes("yellow") || symptoms.includes("yellowing")) {
    return {
      diagnosis:
        "Your plant appears to be suffering from overwatering or nutrient deficiency, leading to chlorosis (yellowing leaves).",
      confidence: 0.82,
      recommendations: [
        "Reduce watering frequency — let the top 2 inches of soil dry out between waterings.",
        "Check for proper drainage holes in your pot.",
        "Apply a balanced liquid fertilizer (10-10-10) at half strength.",
        "Move to a spot with bright, indirect light.",
      ],
      urgency: "medium",
    };
  }

  if (symptoms.includes("brown") || symptoms.includes("crispy")) {
    return {
      diagnosis:
        "Brown, crispy leaf edges typically indicate low humidity or underwatering stress.",
      confidence: 0.78,
      recommendations: [
        "Increase watering slightly — check soil moisture regularly.",
        "Mist the leaves or place a humidity tray nearby.",
        "Move away from direct heat sources or vents.",
        "Trim severely damaged leaves to redirect energy.",
      ],
      urgency: "medium",
    };
  }

  if (symptoms.includes("drooping") || symptoms.includes("wilting")) {
    return {
      diagnosis:
        "Drooping leaves can be caused by either underwatering or root rot from overwatering.",
      confidence: 0.74,
      recommendations: [
        "Check the soil moisture — if dry, water thoroughly.",
        "If soil is soggy, let it dry out and inspect roots for rot.",
        "Ensure the pot has adequate drainage.",
        "Consider repotting if roots appear brown and mushy.",
      ],
      urgency: "high",
    };
  }

  if (symptoms.includes("spots") || symptoms.includes("fungus") || symptoms.includes("mold")) {
    return {
      diagnosis:
        "Dark spots on leaves may indicate a fungal infection, often caused by excess moisture and poor air circulation.",
      confidence: 0.71,
      recommendations: [
        "Remove affected leaves immediately to prevent spread.",
        "Improve air circulation around the plant.",
        "Avoid wetting the leaves when watering.",
        "Apply a neem oil solution as a natural fungicide.",
      ],
      urgency: "high",
    };
  }

  // Default response
  return {
    diagnosis:
      `Based on the symptoms described for your ${req.plantName}, this could be a general stress response. The plant may need environmental adjustments.`,
    confidence: 0.6,
    recommendations: [
      "Ensure consistent watering schedule.",
      "Check light conditions — most houseplants prefer bright, indirect light.",
      "Inspect for pests (spider mites, mealybugs, aphids).",
      "Maintain temperature between 65-80°F (18-27°C).",
      "Consider repotting if the plant has been in the same pot for over a year.",
    ],
    urgency: "low",
  };
}
