import { db } from "@/src/infra/database/pool";
import { dateModule } from "@/src/models/date/DateModule";
import { findUserById } from "./findUserById";
import { validateUserUniqueEmail } from "../validateUserUniqueEmail";

type UpdateProfileByIdInput = {
  userId: string;
  name?: string;
  email?: string;
};

type UpdateProfileByIdResponse = void;

export async function updateProfileById({
  userId,
  name,
  email,
}: UpdateProfileByIdInput): Promise<UpdateProfileByIdResponse> {
  const data: Record<string, unknown> = {
    updated_at: dateModule.Date.nowUtcDate(),
  };

  if (name !== undefined && name.trim() !== "") {
    data.name = name.trim();
  }

  if (email !== undefined) {
    const normalizedEmail = email.toLowerCase().trim();
    const { user } = await findUserById({ id: userId });
    if (normalizedEmail !== user.email) {
      user.email = normalizedEmail;
      await validateUserUniqueEmail({ user });
      data.email = normalizedEmail;
    }
  }

  if (Object.keys(data).length <= 1) {
    return;
  }

  await db.user.update({
    where: { id: userId },
    data,
  });
}
