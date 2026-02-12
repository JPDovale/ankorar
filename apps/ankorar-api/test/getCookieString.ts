export function getCookieString(props: {
  refreshToken: string;
  accessToken: string;
  orgId: string;
  memberId: string;
}) {
  return `access_token=${props.accessToken}; refresh_token=${props.refreshToken}; org_id=${props.orgId}; member_id=${props.memberId}`;
}
