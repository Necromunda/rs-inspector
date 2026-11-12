<script lang="ts">
  import SkillProgressBar from "./skill_progress_bar.svelte";

  // import icon from "#lib/assets/icons/Agility_detail.png";
  import type { SkillsTabProps } from "./types";

  let { skills }: SkillsTabProps = $props();
</script>

<!-- <h1 class="text-center text-gold font-bold text-2xl pb-2">Skills</h1> -->
<!-- <div class="overflow-y-auto scrollbar-modern"> -->
<!-- <div class="border border-gold p-2 rounded-sm bg-dark space-y-2"> -->
<div class="space-y-2">
  {#each skills as skill}
    <div class="flex bg-dark border border-gold rounded-sm p-1">
      <div class="grid grid-cols-4 w-full items-center font-bold text-gold">
        <enhanced:img
          class="max-w-7.5 mr-3"
          alt={skill.name}
          src={`/icons/skills/${skill.name}_detail.png`}
        />
        <p>{skill.name}</p>
        <p>Level: {skill.level}</p>
        <!-- <p class="font-bold">Xp: {skill.xp.toLocaleString()}</p> -->
        <p>
          #{skill.rank.toLocaleString()}
        </p>

        <div class="col-span-full">
          <SkillProgressBar {skill} />
        </div>
      </div>
    </div>
  {/each}
</div>
<!-- </div> -->
