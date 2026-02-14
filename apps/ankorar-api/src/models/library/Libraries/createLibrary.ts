import { CreateLibraryProps, Library } from "./Library";
import { persistLibrary } from "./fns/persistLibrary";

type CreateLibraryInput = CreateLibraryProps;

type CreateLibraryResponse = {
  library: Library;
};

export async function createLibrary(
  props: CreateLibraryInput,
): Promise<CreateLibraryResponse> {
  const library = Library.create(props);

  await persistLibrary({ library });

  return { library };
}
