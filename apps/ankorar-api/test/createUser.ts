import { Optional } from "@/src/infra/http/types/optional";
import { CreateUserProps } from "@/src/models/user/User";
import { userModule } from "@/src/models/user/UserModule";
import { faker } from "@faker-js/faker";

export async function createUser(
  props: Optional<
    CreateUserProps,
    "created_at" | "updated_at" | "email" | "password" | "name"
  >,
) {
  return await userModule.Users.create({
    name: props.name ?? faker.person.firstName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? "defaultPassword123",
    created_at: props.created_at,
    updated_at: props.updated_at,
    deleted_at: props.deleted_at,
  });
}
