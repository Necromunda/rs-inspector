import type { PlayerHiscore, PlayerQuests } from "#lib/server/rsApi.ts";

export function getRunescore(hiscore: PlayerHiscore): number {
  return (
    hiscore.activities.find(
      (activity) => activity.name.toLowerCase() === "runescore"
    )?.score ?? 0
  );
}

export function getTotalLevel(hiscore: PlayerHiscore): number {
  return (
    hiscore.skills.find((skill) => skill.name.toLowerCase() === "overall")
      ?.level ?? 0
  );
}

export function getMaxedSkills(hiscore: PlayerHiscore): number {
  return hiscore.skills.filter((skill) => skill.id !== 0 && skill.level >= 99)
    .length;
}

export function getSkillCount(hiscore: PlayerHiscore): number {
  return hiscore.skills.filter((skill) => skill.id !== 0).length;
}

export function getCompletedQuestsCount(quests: PlayerQuests): number {
  return Object.values(quests.quests).filter(
    (quest) => quest.status === "COMPLETED"
  ).length;
}

export function getQuestsCompletedPct(quests: PlayerQuests): number {
  const total = Object.keys(quests.quests).length;
  return total === 0
    ? 0
    : Math.round((getCompletedQuestsCount(quests) / total) * 100);
}

export function getQuestTitleColor(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "text-green-500";
    case "STARTED":
      return "text-yellow-400";
    default:
      return "text-white";
  }
}
