import { useData } from 'vitepress'
import type { ThemeConfig } from '..'
import type { SidebarConfig, SidebarItemWithLink, SidebarItemWithSections } from '../typings/sidebar'

export function useNavigation() {
  const { theme } = useData<ThemeConfig>()
  const { navigation } = theme.value

  const sidebarOptions = navigation.sidebar

  function flattenSidebarOptions(sidebarOptions: SidebarConfig) {
    const ans: Array<SidebarItemWithLink> = []
    for (const sidebarOption of sidebarOptions) {
      if ((sidebarOption as SidebarItemWithSections).sections)
        ans.push(...flattenSidebarOptions((sidebarOption as SidebarItemWithSections).sections))

      else ans.push(sidebarOption as SidebarItemWithLink)
    }

    return ans
  }
  const flattenedSidebarOptions = flattenSidebarOptions(sidebarOptions)

  return { sidebarOptions, flattenedSidebarOptions }
}
