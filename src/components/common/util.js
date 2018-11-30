export const showTitle = (item, vm) => {
  return window.config.useI18n ? vm.$t(item.name) : (item.meta && item.meta.title) || item.name
}
