declare module "*.svg" {
  import type { SvelteComponent } from "svelte";
  const content: SvelteComponent;
  export default content;
} 