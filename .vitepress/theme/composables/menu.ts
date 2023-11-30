import { type ComputedRef, type Ref, computed } from 'vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { type MenuItem, type MenuItemDetails, data as globalMenu } from '../../menu.data'

export type Sidebar = Array<MenuItemDetails & { children?: MenuItemDetails[] }>
export function useMenu(menuName: Ref<string>) {
  const menuTree: ComputedRef<MenuItem> = computed(() => globalMenu[menuName.value] || {})
  const treeRootIds = computed(() => menuTree.value ? Object.keys(menuTree.value).filter(node => menuTree.value[node].details.parent === undefined) : [])
  function generateDocSidebar(roots: string[]): Sidebar {
    return roots.map((root) => {
      const menuItem = menuTree.value[root] || { children: [], details: { identifier: '', name: '', url: '', weight: 0 } }
      if (menuItem.children.length) {
        return {
          ...menuItem.details,
          children: generateDocSidebar(menuItem.children),
        }
      }
      else {
        // leaf node
        return {
          ...menuItem.details,
        }
      }
    }).sort((opt1, opt2) => opt1.weight - opt2.weight)
  }
  const activeMenu = computed(() => generateDocSidebar(treeRootIds.value))

  function flattenMenu(menu: Sidebar) {
    const ans: Array<MenuItemDetails> = []
    for (const menuItem of menu) {
      if (menuItem.children?.length)
        ans.push(...flattenMenu(menuItem.children))

      else
        ans.push(menuItem)
    }

    return ans
  }
  const flattenedActiveMenu = computed(() => flattenMenu(activeMenu.value))

  return { activeMenu, flattenedActiveMenu }
}
