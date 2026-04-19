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
      { text: 'Examples', link: base + 'markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: base + 'markdown-examples' },
          { text: 'Runtime API Examples', link: base + 'api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
