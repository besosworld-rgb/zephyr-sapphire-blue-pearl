const TARGET_W = 1600;
const TARGET_H = 1200;

export function normalizePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that picture."));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = TARGET_W;
        canvas.height = TARGET_H;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas unavailable."));
          return;
        }
        const scale = Math.max(TARGET_W / img.width, TARGET_H / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.fillStyle = "#111113";
        ctx.fillRect(0, 0, TARGET_W, TARGET_H);
        ctx.drawImage(img, (TARGET_W - dw) / 2, (TARGET_H - dh) / 2, dw, dh);
        resolve(canvas.toDataURL("image/jpeg", 0.88));
      };
      img.onerror = () => reject(new Error("That file is not a usable picture."));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

const CUSTOM_KEY = "serene.custom.image";

export function storeCustomImage(dataUrl: string) {
  try {
    sessionStorage.setItem(CUSTOM_KEY, dataUrl);
  } catch {
    /* quota — keep in-memory only */
  }
}

export function loadCustomImage(): string | null {
  try {
    return sessionStorage.getItem(CUSTOM_KEY);
  } catch {
    return null;
  }
}
