import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

export function useLang() {
  const { site, page } = useData()

  const { locales } = site.value
  const activeLang = computed(() => {
    return site.value.locales[site.value.localeIndex as string]
  })
  const activeLinkWithoutLang = computed(() => {
    const [link] = page.value.relativePath.split('.')
    const [, ...linkWithoutLang] = link.split('/')
    return linkWithoutLang.join('/')
  })

  function wrapLinkWithLang(link: string) {
    return withBase(`/${activeLang.value.lang}/${link.startsWith('/') ? link.slice(1) : link}`)
  }
  function wrapCurrentPageWithLang(lang: string) {
    return withBase(`/${locales[lang].lang || ''}/${activeLinkWithoutLang.value}`)
  }

  return { activeLang, activeLinkWithoutLang, wrapLinkWithLang, wrapCurrentPageWithLang }
}
