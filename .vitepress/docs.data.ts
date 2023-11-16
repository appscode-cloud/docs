import { createContentLoader } from 'vitepress'

interface MenuItemDetails {
  identifier: string
  name: string
  parent?: string
  weight: number
  url: string
}
interface MenuItemBody {
  children: string[]
  details: MenuItemDetails
}
interface MenuItem extends Record<string, MenuItemBody> {}
interface Menu extends Record<string, MenuItem> {}

export default createContentLoader<Menu>('**/*.md', {
  transform: (pages) => {
    const globalMenu: Menu = {}
    pages.forEach((page) => {
      const { frontmatter, url } = page
      const { menu, menu_name } = frontmatter
      if (menu && menu_name) {
        if (!globalMenu[menu_name]) {
          // add menu to globalMenu
          globalMenu[menu_name] = {}
        }
        const { identifier, parent } = menu[menu_name] || {}
        if (identifier) {
          const menuRefFromGlobalMenu = globalMenu[menu_name]
          if (!menuRefFromGlobalMenu[identifier]) {
            // add menu item body
            menuRefFromGlobalMenu[identifier] = {
              children: [],
              details: {
                ...menu[menu_name],
                url,
              },
            }
          }
          else {
            // menu item already exists
            menuRefFromGlobalMenu[identifier].details = { ...menu[menu_name], url }
          }

          // handle parent and children
          if (parent) {
            if (!menuRefFromGlobalMenu[parent]) {
              // add menu item body
              menuRefFromGlobalMenu[parent] = {
                children: [identifier],
                details: { identifier: '', name: '', weight: 0, url: '' },
              }
            }
            else {
              // menu item already exists
              menuRefFromGlobalMenu[parent].children.push(identifier)
            }
          }
        }
      }
    })
    return globalMenu
  },
})
