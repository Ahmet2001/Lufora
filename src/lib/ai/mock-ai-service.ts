/**
 * Mock AI Service — server-side mock implementations.
 *
 * All AI outputs are framed as suggestions, not guaranteed diagnoses.
 * Replace with real AI API calls (OpenAI, Google AI, etc.) in Phase 5+.
 */

// ─── identifyPlant ───
export async function identifyPlant(input: { description: string; imageUrl?: string }) {
  await delay(800);
  const lower = input.description.toLowerCase();

  const speciesMap: Record<string, { species: string; alternatives: string[] }> = {
    monstera: { species: "Monstera deliciosa", alternatives: ["Monstera adansonii", "Philodendron"] },
    pothos: { species: "Epipremnum aureum", alternatives: ["Philodendron", "Scindapsus pictus"] },
    snake: { species: "Sansevieria trifasciata", alternatives: ["Dracaena trifasciata", "Sansevieria cylindrica"] },
    cactus: { species: "Echinocactus grusonii", alternatives: ["Mammillaria", "Opuntia"] },
    orchid: { species: "Phalaenopsis", alternatives: ["Dendrobium", "Cattleya"] },
    basil: { species: "Ocimum basilicum", alternatives: ["Ocimum tenuiflorum", "Ocimum gratissimum"] },
    fern: { species: "Nephrolepis exaltata", alternatives: ["Adiantum", "Asplenium nidus"] },
  };

  const match = Object.keys(speciesMap).find((k) => lower.includes(k));
  const result = match ? speciesMap[match] : { species: "Unknown species", alternatives: ["Upload a clearer photo for better results"] };

  return {
    predictedSpecies: result.species,
    confidence: match ? 0.85 : 0.3,
    alternativeSpecies: result.alternatives,
    disclaimer: "This is an AI-generated suggestion. Verify with a local expert or plant database.",
  };
}

// ─── generateCarePlan ───
export async function generateCarePlan(input: { species: string; roomLocation?: string; lightLevel?: string }) {
  await delay(600);

  return {
    wateringFrequency: "Every 7–10 days, let top 2 inches of soil dry between waterings",
    fertilizingFrequency: "Every 2 weeks during growing season (spring/summer), monthly in winter",
    leafCleaningFrequency: "Wipe leaves with damp cloth every 2 weeks",
    photoUpdateFrequency: "Weekly for tracking growth progress",
    recommendedTasks: [
      { title: `Water ${input.species}`, type: "watering", intervalDays: 7, points: 10 },
      { title: "Check soil moisture", type: "soil_check", intervalDays: 3, points: 5 },
      { title: "Clean leaves", type: "leaf_cleaning", intervalDays: 14, points: 15 },
      { title: "Add growth photo", type: "photo_update", intervalDays: 7, points: 20 },
      { title: "Health check", type: "health_check", intervalDays: 14, points: 15 },
    ],
    disclaimer: "Care recommendations are AI-generated suggestions. Adjust based on your specific environment and plant condition.",
  };
}

// ─── plantDoctorAnalysis ───
export async function plantDoctorAnalysis(input: { plantName: string; species?: string; symptoms: string; imageUrl?: string }) {
  await delay(1200);
  const lower = input.symptoms.toLowerCase();

  let diagnosis = {
    possibleCause: "Environmental stress",
    confidence: "Medium" as string,
    secondPossibility: "Nutrient deficiency",
    suggestedSteps: [
      "Check watering frequency — both overwatering and underwatering can cause stress",
      "Ensure adequate light exposure for the plant species",
      "Monitor temperature and humidity levels",
      "Consider repotting if the plant is root-bound",
    ],
  };

  if (lower.includes("yellow") || lower.includes("yellowing")) {
    diagnosis = {
      possibleCause: "Overwatering",
      confidence: "Medium",
      secondPossibility: "Nutrient deficiency (nitrogen)",
      suggestedSteps: [
        "Reduce watering frequency — let top 2 inches of soil dry between waterings",
        "Check drainage holes and remove standing water from saucer",
        "Consider repotting with well-draining potting mix",
        "Monitor new growth for improvement over 2 weeks",
      ],
    };
  } else if (lower.includes("brown") || lower.includes("crispy")) {
    diagnosis = {
      possibleCause: "Low humidity or underwatering",
      confidence: "High",
      secondPossibility: "Fertilizer burn",
      suggestedSteps: [
        "Increase watering frequency or mist leaves regularly",
        "Place a humidity tray beneath the pot",
        "Move plant away from direct heat sources or AC vents",
        "Trim severely damaged leaves to redirect energy",
      ],
    };
  } else if (lower.includes("droop") || lower.includes("wilt")) {
    diagnosis = {
      possibleCause: "Underwatering",
      confidence: "High",
      secondPossibility: "Root rot from overwatering",
      suggestedSteps: [
        "Check soil moisture immediately — water thoroughly if dry",
        "If soil is wet, check roots for rot (brown/mushy roots)",
        "Ensure pot has adequate drainage",
        "Move to indirect light while recovering",
      ],
    };
  } else if (lower.includes("spot") || lower.includes("spots")) {
    diagnosis = {
      possibleCause: "Fungal infection",
      confidence: "Medium",
      secondPossibility: "Bacterial leaf spot",
      suggestedSteps: [
        "Isolate the affected plant from others",
        "Remove affected leaves with sterilized scissors",
        "Improve air circulation around the plant",
        "Avoid getting water on leaves when watering",
      ],
    };
  }

  return {
    ...diagnosis,
    disclaimer: "This is an AI-generated suggestion, not a professional diagnosis. For serious plant health issues, consult a local plant specialist.",
  };
}

// ─── generateGrowPlan ───
export async function generateGrowPlan(input: { plantName: string; startingType: string; environmentType?: string }) {
  await delay(1000);

  const plans: Record<string, object> = {
    seed: {
      estimatedGerminationTime: "5–14 days depending on species",
      recommendedLight: "Bright indirect light, 12–16 hours per day",
      moistureGuidance: "Keep soil consistently moist but not waterlogged. Mist daily.",
      photoUpdateFrequency: "Every 3 days",
      stageMilestones: [
        { stage: "setup", title: `${input.plantName} seeds planted`, points: 10 },
        { stage: "germination", title: "First sprout visible", points: 50 },
        { stage: "sprout", title: "First true leaves", points: 30 },
        { stage: "seedling", title: "Seedling 3+ inches tall", points: 30 },
        { stage: "pot_transfer", title: "Transplanted to main pot", points: 40 },
        { stage: "young_plant", title: "Established growth", points: 50 },
        { stage: "mature_plant", title: "Fully mature — journey complete!", points: 100 },
      ],
      firstTasks: [
        { title: "Prepare starter tray with moist soil", type: "custom", points: 10 },
        { title: `Plant ${input.plantName} seeds at recommended depth`, type: "custom", points: 10 },
        { title: "Cover tray for humidity", type: "grow_environment_check", points: 5 },
        { title: "Check soil moisture daily", type: "soil_check", points: 5 },
      ],
    },
  };

  const plan = plans[input.startingType] || plans.seed;

  return {
    ...plan,
    disclaimer: "This grow plan is AI-generated. Actual timelines vary by species, environment, and care.",
  };
}

// ─── growGuideAnswer ───
export async function growGuideAnswer(input: { plantName: string; currentStage: string; dayNumber: number; question: string }) {
  await delay(900);
  const lower = input.question.toLowerCase();

  let answer = `Based on your ${input.plantName} at the ${input.currentStage} stage (day ${input.dayNumber}), here are my suggestions:`;
  let recommendedAction = "Continue monitoring your plant's progress.";
  const relatedTasks: string[] = [];

  if (lower.includes("lean") || lower.includes("leaning")) {
    answer += " Seedling leaning is usually caused by uneven light. The plant grows toward the light source (phototropism).";
    recommendedAction = "Rotate the pot 90° every day to ensure even light exposure. If leaning is severe, provide a small support stake.";
    relatedTasks.push("Rotate pot daily", "Check light exposure");
  } else if (lower.includes("pot") || lower.includes("bigger") || lower.includes("transfer")) {
    answer += " Most seedlings are ready for pot transfer when they have 2–3 sets of true leaves and are 3–4 inches tall.";
    recommendedAction = `At day ${input.dayNumber}, monitor the root development. If roots are visible at drainage holes, it's time to transfer.`;
    relatedTasks.push("Check root development", "Prepare new pot with drainage");
  } else if (lower.includes("light")) {
    answer += " Most seedlings need 12–16 hours of bright indirect light daily. Direct sun can scorch young leaves.";
    recommendedAction = "Place near a bright window or use a grow light. Ensure 6–8 hours minimum of good light.";
    relatedTasks.push("Adjust light position", "Check light duration");
  } else if (lower.includes("water") || lower.includes("moist")) {
    answer += " Keep the soil consistently moist but not waterlogged. Overwatering is the most common seedling killer.";
    recommendedAction = "Use bottom watering or mist the soil surface. Let the top layer dry slightly between waterings.";
    relatedTasks.push("Check soil moisture", "Adjust watering schedule");
  } else {
    answer += " Keep providing consistent care with proper light, moisture, and temperature for your grow stage.";
    relatedTasks.push("Monitor daily progress", "Add a progress photo");
  }

  return {
    answer,
    recommendedAction,
    relatedTasks,
    disclaimer: "This is AI-generated guidance. Every plant is unique — adjust based on what you observe.",
  };
}

// ─── Utility ───
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
