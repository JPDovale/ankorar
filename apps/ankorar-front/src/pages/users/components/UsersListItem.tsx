import type { UserListItem } from "@/services/users/listUsersRequest";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

interface UsersListItemProps {
  user: UserListItem;
  subscriptionLabel: string;
  onSelect: () => void;
}

export function UsersListItem({
  user,
  subscriptionLabel,
  onSelect,
}: UsersListItemProps) {
  return (
    <tr
      className="group transition-colors hover:bg-zinc-50/80"
      data-state="default"
    >
      <td className="px-4 py-3">
        <Link
          to={`/users/${user.id}`}
          onClick={() => {
            onSelect();
          }}
          className="block font-medium text-zinc-900 hover:text-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded"
        >
          {user.name}
        </Link>
        <div className="mt-0.5 text-xs text-zinc-500 sm:hidden">
          {user.email}
        </div>
      </td>
      <td className="hidden px-4 py-3 text-zinc-600 sm:table-cell">
        {user.email}
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium data-[subscription=active]:bg-emerald-500/15 data-[subscription=active]:text-emerald-800 data-[subscription=trialing]:bg-violet-500/15 data-[subscription=trialing]:text-violet-800 data-[subscription=past_due]:bg-amber-500/15 data-[subscription=past_due]:text-amber-800 data-[subscription=canceled]:bg-zinc-500/15 data-[subscription=canceled]:text-zinc-700 data-[subscription=none]:bg-zinc-100 data-[subscription=none]:text-zinc-600"
          data-subscription={user.subscription_status ?? "none"}
        >
          {subscriptionLabel}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          to={`/users/${user.id}`}
          onClick={() => onSelect()}
          className="inline-flex items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
          aria-label={`Ver detalhes de ${user.name}`}
        >
          <ChevronRight className="size-4" />
        </Link>
      </td>
    </tr>
  );
}
