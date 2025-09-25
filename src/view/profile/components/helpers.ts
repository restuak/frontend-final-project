export const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];
export const MAX_IMAGE_SIZE = 1024 * 1024;

export const fmtDate = (
  iso?: string | null,
  opts?: Intl.DateTimeFormatOptions
) => {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat(
      "id-ID",
      opts ?? { dateStyle: "long" }
    ).format(new Date(iso));
  } catch {
    return "-";
  }
};

export const toPhoneString = (v?: number | null) =>
  v == null ? "" : String(v);
