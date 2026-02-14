import { Prisma } from "@/src/infra/database/prisma/client";
import { db } from "@/src/infra/database/pool";
import { LibraryNotFound } from "@/src/infra/errors/LibraryNotFound";
import { Module } from "@/src/infra/shared/entities/Module";
import { CreateLibraryProps, Library } from "./Library";

interface LibraryMapPreview {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date | null;
}

interface LibraryWithMapsPreview {
  library: Library;
  maps: LibraryMapPreview[];
}

interface LibraryModuleProps {
  name: string;
  Libraries: {
    create: (props: CreateLibraryProps) => Promise<{ library: Library }>;
    connectMap: (props: {
      id: string;
      organizationId: string;
      mapId: string;
    }) => Promise<{ library: Library }>;
    fns: {
      findByOrganizationId: (props: {
        organizationId: string;
      }) => Promise<{ libraries: Library[] }>;
      findByOrganizationIdWithMaps: (props: {
        organizationId: string;
      }) => Promise<{ libraries: LibraryWithMapsPreview[] }>;
      findByIdAndOrganizationId: (props: {
        id: string;
        organizationId: string;
      }) => Promise<{ library: Library }>;
      connectMap: (props: {
        mapId: string;
        libraryId: string;
      }) => Promise<void>;
      persist: (props: { library: Library }) => Promise<{ library: Library }>;
    };
  };
}

class LibraryModule extends Module<LibraryModuleProps> {
  static create(props: LibraryModuleProps) {
    return new LibraryModule(props, props.name);
  }

  get Libraries() {
    return this.props.Libraries;
  }
}

export const libraryModule = LibraryModule.create({
  name: "library",
  Libraries: {
    async create(props) {
      const library = Library.create(props);

      await this.fns.persist({ library });

      return { library };
    },

    async connectMap({ id, organizationId, mapId }) {
      const { library } = await this.fns.findByIdAndOrganizationId({
        id,
        organizationId,
      });

      await this.fns.connectMap({
        mapId,
        libraryId: library.id,
      });

      return { library };
    },

    fns: {
      async findByOrganizationId({ organizationId }) {
        const librariesOnDb = await db.library.findMany({
          where: {
            organization_id: organizationId,
            deleted_at: null,
          },
          orderBy: {
            created_at: "desc",
          },
        });

        const libraries = librariesOnDb.map((libraryOnDb) =>
          Library.create(
            {
              organization_id: libraryOnDb.organization_id,
              name: libraryOnDb.name,
              created_at: libraryOnDb.created_at,
              updated_at: libraryOnDb.updated_at,
              deleted_at: libraryOnDb.deleted_at,
            },
            libraryOnDb.id,
          ),
        );

        return { libraries };
      },

      async findByOrganizationIdWithMaps({ organizationId }) {
        const librariesOnDb = await db.library.findMany({
          where: {
            organization_id: organizationId,
            deleted_at: null,
          },
          orderBy: {
            created_at: "desc",
          },
          include: {
            maps: {
              include: {
                map: {
                  select: {
                    id: true,
                    title: true,
                    created_at: true,
                    updated_at: true,
                    deleted_at: true,
                  },
                },
              },
            },
          },
        });

        const libraries = librariesOnDb.map((libraryOnDb) => {
          const library = Library.create(
            {
              organization_id: libraryOnDb.organization_id,
              name: libraryOnDb.name,
              created_at: libraryOnDb.created_at,
              updated_at: libraryOnDb.updated_at,
              deleted_at: libraryOnDb.deleted_at,
            },
            libraryOnDb.id,
          );

          const maps = libraryOnDb.maps
            .map((libraryMapOnDb) => libraryMapOnDb.map)
            .filter((mapOnDb) => mapOnDb.deleted_at === null)
            .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
            .map((mapOnDb) => ({
              id: mapOnDb.id,
              title: mapOnDb.title,
              created_at: mapOnDb.created_at,
              updated_at: mapOnDb.updated_at,
            }));

          return {
            library,
            maps,
          };
        });

        return { libraries };
      },

      async findByIdAndOrganizationId({ id, organizationId }) {
        const libraryOnDb = await db.library.findFirst({
          where: {
            id,
            organization_id: organizationId,
            deleted_at: null,
          },
        });

        if (!libraryOnDb) {
          throw new LibraryNotFound();
        }

        const library = Library.create(
          {
            organization_id: libraryOnDb.organization_id,
            name: libraryOnDb.name,
            created_at: libraryOnDb.created_at,
            updated_at: libraryOnDb.updated_at,
            deleted_at: libraryOnDb.deleted_at,
          },
          libraryOnDb.id,
        );

        return { library };
      },

      async connectMap({ mapId, libraryId }) {
        await db.mapLibrary.createMany({
          data: [
            {
              map_id: mapId,
              library_id: libraryId,
            },
          ],
          skipDuplicates: true,
        });
      },

      async persist({ library }) {
        function mapToDbModel(library: Library) {
          return {
            id: library.id,
            organization_id: library.organization_id,
            name: library.name,
            created_at: library.created_at,
            updated_at: library.updated_at,
            deleted_at: library.deleted_at,
          };
        }

        if (library.isNewEntity) {
          await db.library.create({
            data: mapToDbModel(library),
          });
        }

        if (library.isUpdatedRecently) {
          await db.library.update({
            where: {
              id: library.id,
            },
            data: mapToDbModel(library) as Prisma.LibraryUpdateInput,
          });
        }

        library.forceNotNew();

        return { library };
      },
    },
  },
});
