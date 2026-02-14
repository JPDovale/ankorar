import { dayjs, SAO_PAULO_TIMEZONE } from "@/lib/dayjs";
import type { LibraryPreview } from "@/services/libraries/listLibrariesRequest";

type LibraryActivity = Pick<LibraryPreview, "created_at" | "updated_at">;

export function buildLibraryLastActivityLabel(library: LibraryActivity) {
  const hasBeenUpdated =
    library.updated_at !== null &&
    dayjs(library.updated_at).valueOf() > dayjs(library.created_at).valueOf();
  const activityDate = hasBeenUpdated && library.updated_at ? library.updated_at : library.created_at;
  const activityLabel = hasBeenUpdated ? "Atualizada em" : "Criada em";

  return `${activityLabel} ${dayjs(activityDate).tz(SAO_PAULO_TIMEZONE).format("DD/MM HH:mm")}`;
}
