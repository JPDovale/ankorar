import { Prisma } from "@/src/infra/database/prisma/client";
import { db } from "@/src/infra/database/pool";
import { Module } from "@/src/infra/shared/entities/Module";
import { CreateMapProps, JsonValue, Map } from "./Map";

interface MapModuleProps {
  name: string;
  Maps: {
    create: (props: CreateMapProps) => Promise<{ map: Map }>;
    fns: {
      findById: (props: { id: string }) => Promise<{ map: Map }>;
      findByMemberId: (props: { memberId: string }) => Promise<{ maps: Map[] }>;
      persist: (props: { map: Map }) => Promise<{ map: Map }>;
    };
  };
}

class MapModule extends Module<MapModuleProps> {
  static create(props: MapModuleProps) {
    return new MapModule(props, props.name);
  }

  get Maps() {
    return this.props.Maps;
  }
}

export const mapModule = MapModule.create({
  name: "map",
  Maps: {
    async create(props) {
      const map = Map.create(props);

      await this.fns.persist({ map });

      return { map };
    },

    fns: {
      async findById({ id }) {
        const mapOnDb = await db.map.findFirst({
          where: {
            id,
            deleted_at: null,
          },
        });

        if (!mapOnDb) {
          throw new Error("Map not found");
        }

        const map = Map.create(
          {
            member_id: mapOnDb.member_id,
            title: mapOnDb.title,
            content: mapOnDb.content as JsonValue,
            created_at: mapOnDb.created_at,
            updated_at: mapOnDb.updated_at,
            deleted_at: mapOnDb.deleted_at,
          },
          mapOnDb.id,
        );

        return { map };
      },

      async findByMemberId({ memberId }) {
        const mapsOnDb = await db.map.findMany({
          where: {
            member_id: memberId,
            deleted_at: null,
          },
          orderBy: {
            created_at: "desc",
          },
        });

        const maps = mapsOnDb.map((mapOnDb) =>
          Map.create(
            {
              member_id: mapOnDb.member_id,
              title: mapOnDb.title,
              content: mapOnDb.content as JsonValue,
              created_at: mapOnDb.created_at,
              updated_at: mapOnDb.updated_at,
              deleted_at: mapOnDb.deleted_at,
            },
            mapOnDb.id,
          ),
        );

        return { maps };
      },

      async persist({ map }) {
        function mapToDbModel(map: Map) {
          return {
            id: map.id,
            member_id: map.member_id,
            title: map.title,
            content: map.content as Prisma.InputJsonValue,
            created_at: map.created_at,
            updated_at: map.updated_at,
            deleted_at: map.deleted_at,
          };
        }

        if (map.isNewEntity) {
          await db.map.create({
            data: mapToDbModel(map),
          });
        }

        if (map.isUpdatedRecently) {
          await db.map.update({
            where: {
              id: map.id,
            },
            data: mapToDbModel(map),
          });
        }

        map.forceNotNew();

        return { map };
      },
    },
  },
});
