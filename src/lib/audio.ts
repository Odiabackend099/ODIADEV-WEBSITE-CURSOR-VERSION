let unlocked = false;

export async function unlockAudioContext() {
  if (unlocked) return;
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    await ctx.resume();
    unlocked = true;
  } catch { /* best-effort */ }
}

let queue: Promise<void> = Promise.resolve();

export function playDataUrl(dataUrl: string) {
  queue = queue.then(async () => {
    try {
      await unlockAudioContext();
      const a = new Audio(dataUrl);
      await a.play();
    } catch { /* ignore to keep queue alive */ }
  });
  return queue;
}
