declare global {
  namespace jest {
    interface Matchers {
      toBeMomentObject(hh: string | number, mm: string | number): CustomMatcherResult
    }
  }
}

export {};