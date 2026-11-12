<script lang="ts">
  import type { SkillProgressBarProps } from "./types";

  let { skill }: SkillProgressBarProps = $props();

  function xpForLevel(level: number): number {
    let points = 0;

    for (let i = 1; i < level; i++) {
      points += Math.floor(i + 300 * 2 ** (i / 7));
    }

    return Math.floor(points / 4);
  }

  function getXpProgress(xp: number, maxLevel = 120) {
    let level = 1;

    while (level < maxLevel && xp >= xpForLevel(level + 1)) {
      level++;
    }

    if (level === maxLevel) {
      return {
        level,
        nextLevel: null,
        progress: 100,
        xpRemaining: 0,
        xpGained: 0,
        xpRequired: 0,
      };
    }

    const currentLevelXp = xpForLevel(level);
    const nextLevelXp = xpForLevel(level + 1);

    const xpGained = Math.max(0, xp - currentLevelXp);
    const xpRequired = nextLevelXp - currentLevelXp;

    return {
      level,
      nextLevel: level + 1,
      progress: (xpGained / xpRequired) * 100,
      xpRemaining: nextLevelXp - xp,
      xpGained,
      xpRequired,
    };
  }

  let progress = $derived(getXpProgress(skill.xp));
  let hasProgress = $derived(!!progress.nextLevel);
</script>

<div>
  {#if skill.name != "Overall"}
    <p class="text-sm">
      {progress.level}
      {hasProgress ? "→" : null}
      {progress.nextLevel}
    </p>
  {/if}

  <!-- <progress class="w-full" value={progress.progress} max="100"></progress> -->
  <div class="relative h-5 w-full">
    <progress value={progress.progress} max="100" class="h-full w-full"
    ></progress>

    <span
      class="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold"
    >
      {skill.xp.toLocaleString()} ({progress.progress.toFixed(1)}%)
    </span>
  </div>

  {#if hasProgress}
    <p class="text-sm">
      <!-- {progress.progress.toFixed(1)}%, {progress.xpRemaining.toLocaleString()} XP remaining -->
      {progress.xpRemaining.toLocaleString()} XP remaining
    </p>
  {/if}
</div>
