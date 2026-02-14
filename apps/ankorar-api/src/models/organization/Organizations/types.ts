export type OrganizationInvitePreview = {
  id: string;
  email: string;
  status: string;
  created_at: Date;
  organization: {
    id: string;
    name: string;
  };
  invited_by_user: {
    id: string;
    name: string;
    email: string;
  };
};
