export enum InspectionType {
  Comprehensive = "Comprehensive Inspection",
  Environmental = "Environmental Inspection",
}

export enum InspectionStatus {
  InProgress = "In Progress",
  New = "New",
  Completed = "Completed",
}

export enum AreaConditionType {
  Bathroom = "Bathroom",
  Kitchen = "Kitchen",
  HVAC_AC = "HVAC_AC",
  UtilityRoom = "UtilityRoom",
  Atic = "Atic",
}
export var AreaConditions = [
  { name: "Ceiling stains", checked: false },
  { name: "Visible mold", checked: false },
  { name: "Damaged baseboards / Flooring", checked: false },
  { name: "Window / Door leak", checked: false },
  { name: "Cracked walls / ceilings", checked: false },
  { name: "Dirty AC ducts", checked: false },
];

export var BathroomConditions = [
  { name: "Shower pan", checked: false },
  { name: "Loose tiles", checked: false },
  { name: "Leak behind walls", checked: false },
  { name: "Shower head / Faucet", checked: false },
  { name: "Damaged Flooring", checked: false },
  { name: "Visible Mold", checked: false },
];

export var KitchenConditions = [
  { name: "Leak under sink", checked: false },
  { name: "Damaged cabinets", checked: false },
  { name: "Broken Supply line", checked: false },
  { name: "Broken Drain line", checked: false },
  { name: "Damaged Flooring", checked: false },
  { name: "Dishwasher leak", checked: false },
  { name: "Visible Mold", checked: false },
];

export var HVacConditions = [
  { name: "AC Leak", checked: false },
  { name: "Drain pipe leak", checked: false },
  { name: "Damaged baseboards / Drywall / Flooring", checked: false },
  { name: "Dirty Filter", checked: false },
  { name: "Dirty Coil", checked: false },
  { name: "Visible Mold", checked: false },
];

export var UtilityRoomConditions = [
  { name: "Washer Leak", checked: false },
  { name: "Drain Pipe Leak", checked: false },
  { name: "Leak Under Sink", checked: false },
  { name: "Supply Line Leak", checked: false },
  { name: "Drain Line Leak", checked: false },
  { name: "Damaged Baseboards / Flooring", checked: false },
  { name: "Visible Mold", checked: false },
];

export var AticConditions = [
  { name: "Visible water stains", checked: false },
  { name: "Mold Smell", checked: false },
  { name: "Wet insulation", checked: false },
  { name: "Visible Mold", checked: false },
];

export var ExteriorCondition = [
  { name: "Blue Tarp", checked: false },
  { name: "Loose roof tiles / shingles", checked: false },
  { name: "Damaged window seals", checked: false },
  { name: "Cracks in walls or foundation", checked: false },
];

export var InspectionRecommendations = [
  { name: "Roof Tarp / Wrap", checked: false },
  { name: "Dryout", checked: false },
  { name: "Environmental Inspection(s)", checked: false },
  { name: "Content Cleaning", checked: false },
  { name: "Asbestos Inspection", checked: false },
  { name: "Mold Remediation", checked: false },
  { name: "Roofer", checked: false },
  { name: "Plumber", checked: false },
  { name: "HVAC Tech", checked: false },
  { name: "General Contractor", checked: false },
  { name: "Electrician", checked: false },
  { name: "Public Adjuster / Attorney", checked: false },
  { name: "Handyman", checked: false },
  { name: "Water Quality Specialist", checked: false },
  { name: "AC Filter", checked: false },
  { name: "Other", checked: false },
];
