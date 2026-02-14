import { dayjs, SAO_PAULO_TIMEZONE } from "@/lib/dayjs";

export function createDateBasedMapTitle(inputDate?: string | Date) {
  const currentDateInSaoPaulo = inputDate
    ? dayjs(inputDate).tz(SAO_PAULO_TIMEZONE)
    : dayjs().tz(SAO_PAULO_TIMEZONE);

  const weekday = currentDateInSaoPaulo
    .format("ddd")
    .replace(".", "")
    .toLowerCase();

  return `${weekday} ${currentDateInSaoPaulo.format("DD/MM HH:mm")}`;
}
