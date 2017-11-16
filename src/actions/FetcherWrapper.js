let _fetcher = null

export function SetFetcher(implementation) {
  _fetcher = implementation
}

export function GetFetcher() {
  return _fetcher
}
