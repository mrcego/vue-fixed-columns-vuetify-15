import Vue from 'vue'

function setElementStyle(
  HTMLElement,
  { left, j: index, fixedColumns: numberFixedColumns }
) {
  const { style } = HTMLElement
  style.position = 'sticky'
  style.background = 'white'
  style.left = left + 'px'
  style['z-index'] = '1'

  if (index === numberFixedColumns - 1) {
    style['border-right'] = '0.2em solid rgba( 0, 0, 0, 0.15 )'
    style.blur = '6px'
  }

  return HTMLElement
}

Vue.directive('fixed-column', (el, binding, vnode) => {
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

    for (let i = 2; i < rowLength; i++) {
      let left = 0
      for (let j = 0; j < fixedColumns; j++) {
        let header = el.getElementsByTagName('th')[j]
        let cell = row[i].children[j]

        const defaultParams = { left, j, fixedColumns }

        header = setElementStyle(header, { ...defaultParams })
        cell = setElementStyle(cell, { ...defaultParams })

        left += header.offsetWidth
      }
    }
  })
})
