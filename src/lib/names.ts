export const HUMAN_NAMES = [
  "Josh","Mia","Noah","Emma","Liam","Ava","Sofia","Ethan","Olivia","Lucas",
  "Nora","Isak","Sara","Leo","Elin","Oskar","Ida","Max","Ella","Jonas",
  "Amir","Linnea","Benjamin","Hanna","Theo","Ingrid","Adrian","Selma","Aria","Markus",
];

export function randomHumanName() {
  return HUMAN_NAMES[Math.floor(Math.random() * HUMAN_NAMES.length)];
}
