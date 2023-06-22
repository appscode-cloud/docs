import { computed } from 'vue'
import { useData } from 'vitepress'

export function useLang() {
  const { site, page } = useData()

  const { locales } = site.value
  const activeLang = computed(() => {
    return site.value.locales[site.value.localeIndex as string]
  })
  const activeLinkWithoutLang = computed(() => {
    const [link] = page.value.relativePath.split('.')
    const [, linkWithoutLang] = link.split('/')
    return linkWithoutLang
  })

  function wrapLinkWithLang(link: string) {
    return `/${activeLang.value.lang}/${link.startsWith('/') ? link.split('/')[1] : link}`
  }
  function wrapCurrentPageWithLang(lang: string) {
    return `/${locales[lang].lang || ''}/${activeLinkWithoutLang.value}`
  }

  return { activeLang, activeLinkWithoutLang, wrapLinkWithLang, wrapCurrentPageWithLang }
}
