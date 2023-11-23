// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { type MenuItem, type MenuItemDetails, data as globalMenu } from '../../menu.data'

export type Sidebar = Array<MenuItemDetails & { children?: MenuItemDetails[] }>
export function useMenu(menuName: string) {
  const menuTree: MenuItem = globalMenu[menuName]
  const treeRootIds = Object.keys(menuTree).filter(node => menuTree[node].details.parent === undefined)
  function generateDocSidebar(roots: string[]): Sidebar {
    return roots.map((root) => {
      const menuItem = menuTree[root]
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
  const activeMenu = generateDocSidebar(treeRootIds)

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
  const flattenedActiveMenu = flattenMenu(activeMenu)
  return { activeMenu, flattenedActiveMenu }
}
