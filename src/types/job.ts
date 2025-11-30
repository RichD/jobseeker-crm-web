import { JOB_STATUSES } from "@/constants/jobs";

export type JobStatus = (typeof JOB_STATUSES)[number];

export interface Job {
  id?: number;
  title: string;
  company: string;
  location?: string;
  url?: string;
  status?: JobStatus;
  description?: string;
  notes?: string;
  compensation?: string;
  applied_at?: string;
}