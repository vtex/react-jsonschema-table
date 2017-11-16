const FetcherWrapper = jest.genMockFromModule('FetcherWrapper')

function GetFetcher() {
  return {}
}

FetcherWrapper.GetFetcher = GetFetcher

export default FetcherWrapper
