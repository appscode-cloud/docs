export interface SidebarItem {
  title: string
}
export interface SidebarItemWithSections extends SidebarItem {
  sections: SidebarConfig
}
export interface SidebarItemWithLink extends SidebarItem {
  link: string
}
export interface SidebarConfig extends Array<SidebarItemWithSections | SidebarItemWithLink> {}
