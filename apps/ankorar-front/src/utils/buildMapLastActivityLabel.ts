import { dayjs, SAO_PAULO_TIMEZONE } from "@/lib/dayjs";

export function buildMapLastActivityLabel(map: {
  created_at: string;
  updated_at: string | null;
}) {
  const hasBeenUpdated =
    map.updated_at !== null &&
    dayjs(map.updated_at).valueOf() > dayjs(map.created_at).valueOf();
  const activityDate = hasBeenUpdated && map.updated_at ? map.updated_at : map.created_at;
  const activityLabel = hasBeenUpdated ? "Atualizado em" : "Criado em";

  return `${activityLabel} ${dayjs(activityDate).tz(SAO_PAULO_TIMEZONE).format("DD/MM HH:mm")}`;
}
