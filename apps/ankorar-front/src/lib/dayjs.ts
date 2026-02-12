import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");

export const SAO_PAULO_TIMEZONE = "America/Sao_Paulo";

dayjs.tz.setDefault(SAO_PAULO_TIMEZONE);

export { dayjs };
