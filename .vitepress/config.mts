import { defineConfig } from 'vitepress'

const base = "/appweb-tp2-doc/"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: base,
  title: "TP2-Doc",
  description: "Application de combat Pokémon",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: base },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
