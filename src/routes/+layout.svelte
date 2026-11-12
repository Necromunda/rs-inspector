<script lang="ts">
  import "./layout.css";
  import favicon from "#lib/assets/favicon.svg";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-dvh flex flex-col bg-grayish">
  <header class="flex h-[5vh] shrink-0 items-center px-5 bg-gold justify-between">
    <a href="/" class="text-xl text-grayish font-bold">
      RS-Inspector
    </a>
    <div class="flex hover:underline font-bold">
      <a href="/about">About</a>
    </div>
  </header>

  <main class="flex-1 flex flex-col min-h-0">
    {@render children()}
  </main>

  <footer class="flex bg-gold h-[5vh] items-center justify-center">
    <p>RS-Inspector 2026</p>
  </footer>
</div>
