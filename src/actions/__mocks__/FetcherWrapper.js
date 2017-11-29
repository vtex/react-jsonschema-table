export function GetFetcher() {
  return {
    getItems: () => {
      return new Promise((resolve, reject) => {
        process.nextTick(() =>
          resolve({
            items: [{ id: '1' }, { id: '2' }],
            totalRows: 2,
            rowStart: 0,
          })
        )
      })
    },
  }
}
