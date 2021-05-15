declare global {
  namespace jest {
    interface Matchers<R> {
      toBeMomentObject(hh: string | number, mm: string | number): CustomMatcherResult
    }
  }
}

export {};