let snapshotPass = null;

/** True only for the first render of a document saved by the prerender script.
 *  Later client-side mounts animate normally. */
export function isPrerenderSnapshot() {
  if (snapshotPass === null) {
    snapshotPass = typeof window !== 'undefined' && window.__ADCOM_PRERENDERED === 1;
  }
  return snapshotPass === true;
}

export function finishPrerenderSnapshot() {
  snapshotPass = false;
}
