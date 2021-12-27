/**
 * ASYNC DEBOUNCE
 * - takes any @param function and wraps it in an async function (debounced function), 
 *        resolving it's return value as a promise, instead of returning it synchronously
 * - repeated calls within the @param wait period (idle) will never be resolved
 * - if @param function is async, the @returned promise will behave exactly the same (resolving and rejecting equally)
 * - @param option.idleCallback is called whenever the debounced function is called within the idle period, returing the stored result IF @param option.leading is true
 * - @param option.leadingCallback is called whenever the debounced function first executes on a row
 * - @param option.trailingCallback is called whenever the deobounce function executes for the last time on a row
 */

import { PromiseValue } from "type-fest";

type DebounceFunction<R, A extends any[]> = (...args: A) => R;
type IdleCallback<R> = (v: R) => void;
type DebounceOptions<R> = {
  leading?: boolean;
  idleCallback?: IdleCallback<R | Error>;
  leadingCallback?: IdleCallback<R | Error>;
  trailingCallback?: IdleCallback<R | Error>;
}
export function debounce<R, A extends any[]>(f: DebounceFunction<R,A>, w: number, options: DebounceOptions<PromiseValue<R>>): DebounceFunction<Promise<R>, A>;
export default function debounce <R, A extends any[]>(theFunction: DebounceFunction<R,A>, wait: number, options: DebounceOptions<R> = {}) {
  const { leading, idleCallback, leadingCallback, trailingCallback } = {
    leading: false,
    idleCallback: () => {},
    leadingCallback: () => {},
    trailingCallback: () => {},
    ...options
  };
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let storedResult: R;
  const isTimeoutClear = () => timeout === null;
  const resetTimeout = () => timeout = null;
  const wrapWithLeadingCallback = (callback: Function) => async () => {
    await callback();
    leadingCallback(storedResult);
  }
  const wrapWithTrailingCallback = (callback: Function) => async () => {
    resetTimeout();
    await callback();
    trailingCallback(storedResult);
  }
  const mkPromiseCallbackExecutor = (args: A, resolve: Function, reject: Function) => async () => {
    try {
      storedResult = await theFunction(...args);
      console.log(timeout, storedResult);
      resolve(storedResult);
    } catch (e) {
      storedResult = e as R;
      reject(e);
    }
  };
  const mkStaggeredExecution = (args: A) => async (resolve: Function, reject: Function) => {
    const execute = mkPromiseCallbackExecutor(args, resolve, reject);
    const leadingAction = leading ? execute : () => {};
    const trailingAction = leading ? () => {} : execute;
    if (isTimeoutClear()) await wrapWithLeadingCallback(leadingAction)();
    else idleCallback(storedResult);
    timeout = setTimeout(wrapWithTrailingCallback(trailingAction), wait);
  }
  

  return async function(...args: A) {
    if (!isTimeoutClear()) clearTimeout(timeout!);
    return new Promise(mkStaggeredExecution(args));
  }
}
