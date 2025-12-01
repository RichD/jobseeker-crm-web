import { JOB_SKILL_CLASSIFICATIONS } from "@/constants/jobs";

import { type Skill } from "./skill";

export type JobSkillClassification = (typeof JOB_SKILL_CLASSIFICATIONS)[number];

export interface JobSkill {
  id?: number;
  skill: Skill;
  years_required?: number;
  classification: JobSkillClassification;
}
