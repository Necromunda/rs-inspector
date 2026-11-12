import type { PlayerHiscoreSkill } from "#lib/server/rsApi.ts";

export type SkillsTabProps = {
  skills: PlayerHiscoreSkill[];
};

export type SkillProgressBarProps = {
  skill: PlayerHiscoreSkill;
};
