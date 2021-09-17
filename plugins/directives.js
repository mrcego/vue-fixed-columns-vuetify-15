import Vue from 'vue'

function setElementStyle(
  HTMLElement,
  { left, j: index, fixedColumns: numberFixedColumns }
) {
  try {
    const { style } = HTMLElement
    style.position = 'sticky'
    style.background = 'white'
    style.left = left + 'px'
    style['z-index'] = '10'

    if (index === numberFixedColumns - 1) {
      style['border-right'] = '0.2em solid rgba( 0, 0, 0, 0.15 )'
      style.blur = '6px'
    }

    return HTMLElement
  } catch (err) {
    throw new Error(err)
  }
}

Vue.directive('fixed-columns', (el, binding, vnode) => {
  const datatable = vnode?.componentOptions?.tag === 'v-data-table'

  if (!datatable)
    throw new Error(
      '¡Esta directiva debe colocarse en el componente v-data-table de Vuetify!'
    )

  Vue.nextTick(() => {
    const table = el.getElementsByTagName('table')[0]
    table.style['border-collapse'] = 'separate'

    const row = el.getElementsByTagName('tr')
    const rowLength = row.length
    let fixedColumns = binding.value || 2

    if (fixedColumns <= 0)
      throw new Error('El valor de columnas a fijar debe ser mayor a 0')

    fixedColumns = fixedColumns + 1

    // ? $attrs arg is not present in Vuetify 2.x
    let index = vnode.componentInstance.$vuetify.$attrs ? 2 : 1
    console.info(`Vuetify ${index === 2 ? index - 1 : index + 1}.x detected!`)

    for (index; index < rowLength; index++) {
      let left = 0
      for (let j = 0; j < fixedColumns; j++) {
        let header = el.getElementsByTagName('th')[j]
        let cell = row[index].children[j]

        const defaultParams = { left, j, fixedColumns }

        if (header) header = setElementStyle(header, { ...defaultParams })
        cell = setElementStyle(cell, { ...defaultParams })

        left += cell.getBoundingClientRect().width
      }
    }
  })
})
