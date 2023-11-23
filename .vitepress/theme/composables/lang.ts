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

  function wrapLinkWithLang(link: string, linkAlreadyHasLang?: boolean) {
    let path = link
    if (linkAlreadyHasLang) {
      // remove the embedded lang
      path = path.split('/').slice(2).join('/')
    }
    return withBase(`/${activeLang.value.lang}/${path.startsWith('/') ? path.slice(1) : path}`)
  }
  function wrapCurrentPageWithLang(lang: string) {
    return withBase(`/${locales[lang].lang || ''}/${activeLinkWithoutLang.value}`)
  }

  return { activeLang, activeLinkWithoutLang, wrapLinkWithLang, wrapCurrentPageWithLang }
}
